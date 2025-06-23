import axios from 'axios';
import { getAPIBaseURL } from '../utils/environment';

// Create axios instance with working API endpoint
const axiosInstance = axios.create({
  baseURL: getAPIBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`Axios Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Axios Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 