import { BlogImageDto } from './blog-image.dto';
export declare class CreateBlogDto {
    title: string;
    content: string;
    excerpt: string;
    featuredImage: BlogImageDto;
    category: string;
    tags: string[];
    readTime?: string;
    isFeatured?: boolean;
    status: 'draft' | 'published';
}
export declare class UpdateBlogDto {
    title?: string;
    content?: string;
    excerpt?: string;
    featuredImage?: BlogImageDto;
    category?: string;
    tags?: string[];
    readTime?: string;
    isFeatured?: boolean;
    status?: 'draft' | 'published';
}
