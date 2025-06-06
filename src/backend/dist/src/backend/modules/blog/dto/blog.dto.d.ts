export declare class BlogImageDto {
    url: string;
    alt: string;
}
export declare class CreateBlogDto {
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: BlogImageDto;
    category: string;
    tags: string[];
    readTime?: string;
    isFeatured?: boolean;
    status: string;
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
    status?: string;
}
