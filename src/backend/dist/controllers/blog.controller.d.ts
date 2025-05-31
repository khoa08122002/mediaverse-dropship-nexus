import { BlogService } from '../modules/blog/blog.service';
import { CreateBlogDto, UpdateBlogDto } from '../modules/user/dto/blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    getAllBlogs(): Promise<({
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    })[]>;
    getFeaturedBlog(): Promise<{
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
    searchBlogs(query: string): Promise<({
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    })[]>;
    getPopularTags(): Promise<string[]>;
    getBlogsByTag(tag: string): Promise<({
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    })[]>;
    getBlogsByCategory(category: string): Promise<({
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    })[]>;
    getBlogById(id: string): Promise<{
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
    getBlogBySlug(slug: string): Promise<{
        author: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
    createBlog(createBlogDto: CreateBlogDto, req: any): Promise<{
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
    updateBlog(id: string, updateBlogDto: UpdateBlogDto): Promise<{
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
    deleteBlog(id: string): Promise<{
        message: string;
    }>;
    incrementViews(id: string): Promise<{
        title: string;
        status: import(".prisma/client").$Enums.BlogStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        content: string;
        slug: string;
        excerpt: string;
        featuredImage: import("@prisma/client/runtime/library").JsonValue;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        views: number;
        authorId: string;
    }>;
}
