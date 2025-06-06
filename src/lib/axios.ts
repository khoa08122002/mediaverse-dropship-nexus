import axios from 'axios';
import { toast } from 'sonner';

// Define public routes that don't need authentication
const publicRoutes = [
  '/blogs',
  '/blogs/featured',
  '/blogs/slug',
  '/blogs/category',
  '/blogs/tags',
  '/blogs/search'
];

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't add token for login and refresh endpoints
    if (config.url === '/auth/login' || config.url === '/auth/refresh') {
      return config;
    }

      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle errors for login and refresh endpoints
    if (error.config.url === '/auth/login' || error.config.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Clear auth data on 401 Unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }

    if (error.response) {
      // Handle different error status codes
      switch (error.response.status) {
        case 400:
          toast.error('Yêu cầu không hợp lệ', {
            description: error.response.data?.message || 'Vui lòng kiểm tra lại thông tin'
          });
          break;

        case 403:
          toast.error('Không có quyền truy cập', {
            description: 'Bạn không có quyền thực hiện hành động này'
          });
          break;

        case 404:
          toast.error('Không tìm thấy', {
            description: 'Tài nguyên không tồn tại'
          });
          break;

        case 422:
          toast.error('Dữ liệu không hợp lệ', {
            description: error.response.data?.message || 'Vui lòng kiểm tra lại thông tin'
          });
          break;

        case 500:
          toast.error('Lỗi hệ thống', {
            description: 'Vui lòng thử lại sau'
          });
          break;

        default:
          toast.error('Có lỗi xảy ra', {
            description: error.response.data?.message || 'Vui lòng thử lại'
          });
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('Không thể kết nối đến máy chủ', {
        description: 'Vui lòng kiểm tra kết nối mạng và thử lại'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error('Có lỗi xảy ra', {
        description: error.message
      });
    }

    return Promise.reject(error);
  }
); 