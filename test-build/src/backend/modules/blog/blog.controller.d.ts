import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findAll(): Promise<any[]>;
    getFeatured(): Promise<any[]>;
    findById(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    search(query: string): Promise<any[]>;
    getPopularTags(): Promise<{
        tag: string;
        count: number;
    }[]>;
    getByTag(tag: string): Promise<any[]>;
    getByCategory(category: string): Promise<any[]>;
    create(createBlogDto: CreateBlogDto, req: any): Promise<any>;
    update(id: string, updateBlogDto: UpdateBlogDto, req: any): Promise<any>;
    delete(id: string): Promise<{
        title: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
    incrementViews(id: string): Promise<{
        title: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
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
}
