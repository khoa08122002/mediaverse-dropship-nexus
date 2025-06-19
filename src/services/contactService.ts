import axios from './axiosConfig';

// Emergency fallback for production
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.log('🚨 ContactService Emergency: Force updating axios baseURL for production');
  axios.defaults.baseURL = 'https://phg2.vercel.app/api/backend';
}
import type { Contact as ContactType, CreateContactDTO } from '@/types/contact';

export type { ContactType as Contact };
export type ContactStatusType = 'NEW' | 'REPLIED' | 'ARCHIVED';
export type ContactPriorityType = 'HIGH' | 'MEDIUM' | 'LOW';

export const contactService = {
  getAllContacts: async (): Promise<ContactType[]> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get('/contacts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllContacts:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get('/contacts', {
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
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  },

  getContactById: async (id: string): Promise<ContactType> => {
    const response = await axios.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (contactData: CreateContactDTO): Promise<ContactType> => {
    const response = await axios.post('/contacts', contactData);
    return response.data;
  },

  updateContact: async (id: string, contactData: Partial<ContactType>): Promise<ContactType> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.put(`/contacts/${id}`, contactData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in updateContact:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.put(`/contacts/${id}`, contactData, {
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
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  },

  deleteContact: async (id: string): Promise<void> => {
    await axios.delete(`/contacts/${id}`);
  },

  searchContacts: async (query: string): Promise<ContactType[]> => {
    const response = await axios.get(`/contacts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  replyToContact: async (id: string, message: string): Promise<ContactType> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.post(`/contacts/${id}/reply`, 
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in replyToContact:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.post(`/contacts/${id}/reply`,
              { message },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            );
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  }
}; 