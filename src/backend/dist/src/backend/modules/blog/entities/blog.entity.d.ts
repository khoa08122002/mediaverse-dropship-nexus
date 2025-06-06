import { BlogImage } from './blog-image.entity';
export declare class Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: BlogImage;
    category: string;
    tags: string[];
    readTime?: string;
    views: number;
    isFeatured: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}
