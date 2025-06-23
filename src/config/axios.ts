import axios from 'axios';
import { getAPIBaseURL } from '../utils/environment';

// Create axios instance with working API endpoint
const axiosConfig = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`Config Axios Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Config Axios Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle 401 errors by redirecting to login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig; 