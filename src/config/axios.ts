import axios from 'axios';

// Detect environment based on hostname for reliability
const isProduction = typeof window !== 'undefined' && (
  window.location.hostname === 'phg2.vercel.app' ||
  window.location.hostname.includes('vercel.app') ||
  process.env.NODE_ENV === 'production'
);

const baseURL = isProduction
  ? 'https://phg2.vercel.app/api/comprehensive'  // In production, use Vercel backend function
  : 'http://localhost:3002/api'; // In development, use localhost

// Debug logging
console.log('Config Axios Environment Detection:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  nodeEnv: process.env.NODE_ENV,
  isProduction,
  baseURL
});

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          // If refresh fails, logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, logout
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 