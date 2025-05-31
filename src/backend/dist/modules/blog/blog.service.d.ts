import { CreateBlogDto, UpdateBlogDto } from '../user/dto/blog.dto';
export declare class BlogService {
    findAll(): Promise<({
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
    findFeatured(): Promise<{
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
    findById(id: string): Promise<{
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
    findBySlug(slug: string): Promise<{
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
    create(createBlogDto: CreateBlogDto, authorId: string): Promise<{
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
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<{
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
    delete(id: string): Promise<{
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
    search(query: string): Promise<({
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
    findByTag(tag: string): Promise<({
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
    findByCategory(category: string): Promise<({
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
}
