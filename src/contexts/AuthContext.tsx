import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { validateDataConsistency } from '../utils/clearCache';

// Remove hardcoded URLs - use environment configuration

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
  const location = useLocation();

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!accessToken || !refreshToken) {
        if (location.pathname === '/admin') {
          navigate('/login');
        }
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/users/profile');
        const userData = response.data;
        setUser(userData);
        
        if (location.pathname === '/admin') {
          if (userData.role !== 'ADMIN' && userData.role !== 'HR') {
            navigate('/login');
            toast.error('Bạn không có quyền truy cập trang quản trị');
            return;
          }
        }
      } catch (profileError) {
        try {
          const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
          const { accessToken: newAccessToken, user: userData } = refreshResponse.data;
          
          localStorage.setItem('accessToken', newAccessToken);
          setUser(userData);
          
          if (location.pathname === '/admin') {
            if (userData.role !== 'ADMIN' && userData.role !== 'HR') {
              navigate('/login');
              toast.error('Bạn không có quyền truy cập trang quản trị');
              return;
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
          
          if (location.pathname === '/admin') {
            navigate('/login');
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (location.pathname === '/admin') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateDataConsistency();
    checkAuthStatus();
  }, [location.pathname]);

  const login = async (email: string, password: string) => {
    let retryCount = 0;
    const maxRetries = 2;

    const attemptLogin = async (): Promise<void> => {
      try {
        setError(null);
        setLoading(true);

        console.log(`Login attempt ${retryCount + 1}/${maxRetries + 1} for email:`, email);

        const response = await axios.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user: userData } = response.data;

        console.log('=== LOGIN DEBUG ===');
        console.log('User role:', userData.role);
        console.log('Is ADMIN?', userData.role === 'ADMIN');
        console.log('Is HR?', userData.role === 'HR');

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);

        // Direct navigation based on role - no setTimeout needed
        if (userData.role === 'ADMIN' || userData.role === 'HR') {
          console.log('Navigating to /admin...');
          navigate('/admin', { replace: true });
        } else {
          console.log('Navigating to home...');
          navigate('/', { replace: true });
        }

        toast.success('Đăng nhập thành công');

      } catch (error: any) {
        console.error(`Login attempt ${retryCount + 1} failed:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        const isRetriableError = 
          error.response?.status === 503 ||
          error.response?.data?.code === 'DB_TIMEOUT' ||
          error.response?.data?.code === 'DB_CONFLICT' ||
          error.response?.data?.code === 'DB_ERROR' ||
          error.message?.includes('Network Error') ||
          error.message?.includes('timeout');

        if (isRetriableError && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying login (attempt ${retryCount + 1}/${maxRetries + 1}) in ${retryCount * 1000}ms...`);
          toast.info(`Đang thử lại... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
          return attemptLogin();
        }

        let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
        if (error.response?.status === 401) {
          message = 'Email hoặc mật khẩu không đúng';
        } else if (error.response?.status === 503) {
          message = 'Hệ thống đang bận, vui lòng thử lại sau';
        } else if (error.response?.data?.message) {
          message = error.response.data.message;
        }

        setError(message);
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    };

    return attemptLogin();
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
