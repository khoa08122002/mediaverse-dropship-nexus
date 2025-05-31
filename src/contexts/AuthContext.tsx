import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user is already logged in from localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra token trong localStorage khi component mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          // Set token first
          setToken(storedToken);
          
          try {
            // Verify token by making a request to a protected endpoint
            const response = await axiosInstance.get('/users/profile');
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token không hợp lệ, xóa thông tin đăng nhập
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    // Clear localStorage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');

    // Clear auth state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Navigate immediately
    navigate('/login', { replace: true });
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { access_token, user } = response.data;

      // Ensure we have all required user fields
      const userData: User = {
        id: user.id,
        email: user.email,
        fullName: user.fullName || '',
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
      };

      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);

      // Lưu thông tin vào localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    login,
    logout: handleLogout,
    isLoading,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
