import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    })[]>;
    findOne(id: string): Promise<{
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }>;
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    })[]>;
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    })[]>;
    create(createBlogDto: CreateBlogDto, authorId: string): Promise<{
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<{
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
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
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    })[]>;
    getPopularTags(): Promise<{
        tag: string;
        count: number;
    }[]>;
    incrementViews(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }>;
    getFeaturedBlogs(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }[]>;
    findByTag(tag: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }[]>;
    findByCategory(category: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        tags: string[];
        content: string;
        excerpt: string;
        featuredImage: string | null;
        category: string;
        readTime: string | null;
        isFeatured: boolean;
        published: boolean;
        slug: string;
        views: number;
        authorId: string;
    }[]>;
}
