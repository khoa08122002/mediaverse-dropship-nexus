import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(): Promise<({
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    })[]>;
    getFeatured(): Promise<({
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    })[]>;
    findById(id: string): Promise<{
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
    findBySlug(slug: string): Promise<{
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
    search(query: string): Promise<({
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    })[]>;
    getPopularTags(): Promise<{
        tag: string;
        count: number;
    }[]>;
    getByTag(tag: string): Promise<({
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    })[]>;
    getByCategory(category: string): Promise<({
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    })[]>;
    create(createBlogDto: CreateBlogDto, req: any): Promise<{
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
    update(id: string, updateBlogDto: UpdateBlogDto, req: any): Promise<{
        author: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
    incrementViews(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        tags: string[];
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        views: number;
        authorId: string;
    }>;
}
