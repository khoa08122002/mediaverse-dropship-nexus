import axiosInstance from '../config/axios';
import { BlogImage, BlogData, CreateBlogDTO, UpdateBlogDTO } from '../types/blog';

export type { CreateBlogDTO };

export const blogService = {
  getAllBlogs: async (): Promise<BlogData[]> => {
    const response = await axiosInstance.get('/blogs');
    return response.data;
  },

  getFeaturedBlog: async (): Promise<BlogData | null> => {
    const response = await axiosInstance.get('/blogs/featured');
    return response.data;
  },

  getBlogById: async (id: string): Promise<BlogData> => {
    const response = await axiosInstance.get(`/blogs/${id}`);
    console.log('Blog data from getBlogById:', response.data);
    return response.data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogData> => {
    const response = await axiosInstance.get(`/blogs/slug/${slug}`);
    console.log('Blog data from getBlogBySlug:', response.data);
    return response.data;
  },

  createBlog: async (blog: CreateBlogDTO): Promise<BlogData> => {
    const response = await axiosInstance.post('/blogs', {
      ...blog,
      readTime: blog.readTime || '5 phút đọc'
    });
    return response.data;
  },

  updateBlog: async (id: string, blog: Partial<CreateBlogDTO>): Promise<BlogData> => {
    console.log('Updating blog with data:', blog);
    const response = await axiosInstance.put(`/blogs/${id}`, {
      ...blog,
      readTime: blog.readTime || '5 phút đọc'
    });
    console.log('Update response:', response.data);
    return response.data;
  },

  deleteBlog: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/blogs/${id}`);
  },

  uploadImage: async (fileOrBlob: File | Blob): Promise<{ url: string }> => {
    const formData = new FormData();
    
    if (fileOrBlob instanceof File) {
      formData.append('image', fileOrBlob);
    } else {
      // If it's a Blob, create a File from it
      formData.append('image', new File([fileOrBlob], 'image.jpg', { type: fileOrBlob.type }));
    }

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  incrementViews: async (id: string): Promise<void> => {
    await axiosInstance.post(`/blogs/${id}/views`);
  },

  searchBlogs: async (query: string): Promise<BlogData[]> => {
    const response = await axiosInstance.get('/blogs/search', {
      params: { q: query }
    });
    return response.data;
  },

  getPopularTags: async (): Promise<string[]> => {
    const response = await axiosInstance.get('/blogs/tags/popular');
    return response.data;
  },

  getBlogsByTag: async (tag: string): Promise<BlogData[]> => {
    const response = await axiosInstance.get(`/blogs/tags/${tag}`);
    return response.data;
  },

  getBlogsByCategory: async (category: string): Promise<BlogData[]> => {
    const response = await axiosInstance.get(`/blogs/category/${category}`);
    return response.data;
  }
}; 