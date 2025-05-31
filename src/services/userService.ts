import { axiosInstance } from '@/lib/axios';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/user';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserDTO): Promise<User> => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: UpdateUserDTO): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await axiosInstance.get(`/users/search?q=${query}`);
    return response.data;
  },

  changePassword: async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
    if (id === 'profile') {
      await axiosInstance.post('/users/change-password', {
        currentPassword,
        newPassword
      });
    } else {
      await axiosInstance.post(`/users/${id}/change-password`, {
        newPassword
      });
    }
  }
}; 