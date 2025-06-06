import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }

      // Try to get user profile with current token
      try {
        const response = await axios.get('/auth/profile');
        setUser(response.data);
      } catch (profileError) {
        // If profile fetch fails, try to refresh token
        try {
          const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
          const { accessToken: newAccessToken, user: userData } = refreshResponse.data;
          
          localStorage.setItem('accessToken', newAccessToken);
          setUser(userData);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, clear everything
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;

      console.log('Login successful:', { userData, accessToken: accessToken.substring(0, 20) + '...' });

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);

      if (userData.role === 'ADMIN' || userData.role === 'HR') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      console.error('Login failed:', error);
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
    toast.success('Đăng xuất thành công');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
