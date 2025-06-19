import axios from './axiosConfig';

// Emergency fallback for production
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.log('🚨 BlogService Emergency: Force updating axios baseURL for production');
  axios.defaults.baseURL = 'https://phg2.vercel.app/api/backend';
}
import { BlogImage, BlogData, CreateBlogDTO, UpdateBlogDTO } from '../types/blog';

export type { CreateBlogDTO };

export const blogService = {
  getAllBlogs: async (): Promise<BlogData[]> => {
    try {
      // Public access - no authentication required for reading blogs
      const response = await axios.get('/blogs');
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllBlogs:', error);
      throw error;
    }
  },

  getFeaturedBlog: async (): Promise<BlogData | null> => {
    // Public access - no authentication required
    const response = await axios.get('/blogs/featured');
    // Get the first featured blog from the array
    return response.data && response.data.length > 0 ? response.data[0] : null;
  },

  getBlogById: async (id: string): Promise<BlogData> => {
    // Public access - no authentication required
    const response = await axios.get(`/blogs/${id}`);
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogData> => {
    // Public access - no authentication required
    const response = await axios.get(`/blogs/slug/${slug}`);
    console.log('Blog data from getBlogBySlug:', response.data);
    return response.data;
  },

  createBlog: async (blogData: CreateBlogDTO): Promise<BlogData> => {
    const response = await axios.post('/blogs', blogData);
    return response.data;
  },

  updateBlog: async (id: string, blogData: Partial<BlogData>): Promise<BlogData> => {
    const response = await axios.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await axios.delete(`/blogs/${id}`);
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post('/blogs/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  incrementViews: async (id: string): Promise<void> => {
    // Public access - no authentication required for view increment
    await axios.post(`/blogs/${id}/views`);
  },

  searchBlogs: async (query: string): Promise<BlogData[]> => {
    // Public access - no authentication required for search
    const response = await axios.get(`/blogs/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getPopularTags: async (): Promise<string[]> => {
    // Public access - no authentication required
    const response = await axios.get('/blogs/tags/popular');
    return response.data;
  },

  getBlogsByTag: async (tag: string): Promise<BlogData[]> => {
    // Public access - no authentication required
    const response = await axios.get(`/blogs/tags/${tag}`);
    return response.data;
  },

  getBlogsByCategory: async (category: string): Promise<BlogData[]> => {
    // Public access - no authentication required
    const response = await axios.get(`/blogs/category/${category}`);
    return response.data;
  }
}; 