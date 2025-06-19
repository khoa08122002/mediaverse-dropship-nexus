import axios from './axiosConfig';

// Emergency fallback for production
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.log('🚨 UserService Emergency: Force updating axios baseURL for production');
  axios.defaults.baseURL = 'https://phg2.vercel.app/api/backend';
}
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/user';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllUsers:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get('/users', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Authentication failed');
          }
        }
      }
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserDTO): Promise<User> => {
    const response = await axios.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UpdateUserDTO): Promise<User> => {
    const response = await axios.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`/users/${id}`);
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axios.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    await axios.post(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword
    });
  }
}; 