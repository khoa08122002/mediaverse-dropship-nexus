export interface BlogImage {
  url: string;
  alt?: string;
}

export interface Author {
  id: string;
  email: string;
  fullName: string;
}

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: BlogImage;
  author: Author;
  authorId: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  isFeatured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDTO {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: BlogImage;
  category: string;
  tags: string[];
  readTime?: string;
  isFeatured?: boolean;
  status: 'draft' | 'published';
}

export interface UpdateBlogDTO extends Partial<CreateBlogDTO> {} 