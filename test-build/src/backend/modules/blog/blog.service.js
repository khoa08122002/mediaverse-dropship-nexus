"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const string_1 = require("../../../utils/string");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    parseBlogFeaturedImage(blog) {
        if (!blog)
            return null;
        return {
            ...blog,
            featuredImage: blog.featuredImage ? JSON.parse(blog.featuredImage) : null
        };
    }
    parseBlogsFeaturedImage(blogs) {
        return blogs.map(blog => this.parseBlogFeaturedImage(blog));
    }
    async findAll() {
        const blogs = await this.prisma.blog.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async findOne(id) {
        const blog = await this.prisma.blog.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        if (!blog) {
            throw new common_1.NotFoundException('Blog not found');
        }
        return this.parseBlogFeaturedImage(blog);
    }
    async findBySlug(slug) {
        const blog = await this.prisma.blog.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        if (!blog) {
            throw new common_1.NotFoundException('Blog not found');
        }
        return this.parseBlogFeaturedImage(blog);
    }
    async getFeatured() {
        const blogs = await this.prisma.blog.findMany({
            where: {
                published: true,
                isFeatured: true
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async getByTag(tag) {
        const blogs = await this.prisma.blog.findMany({
            where: {
                tags: { has: tag }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async getByCategory(category) {
        const blogs = await this.prisma.blog.findMany({
            where: { category },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async create(createBlogDto, authorId) {
        const slug = (0, string_1.slugify)(createBlogDto.title);
        const { featuredImage, ...blogData } = createBlogDto;
        const blog = await this.prisma.blog.create({
            data: {
                ...blogData,
                slug,
                authorId,
                published: createBlogDto.status === 'published',
                featuredImage: featuredImage ? JSON.stringify(featuredImage) : null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogFeaturedImage(blog);
    }
    async update(id, updateBlogDto, user) {
        const blog = await this.findOne(id);
        if (user.role !== 'ADMIN' && blog.authorId !== user.id) {
            const { isFeatured, ...otherFields } = updateBlogDto;
            if (Object.keys(otherFields).length > 0) {
                throw new common_1.ForbiddenException('Bạn không có quyền cập nhật các trường khác của bài viết này');
            }
        }
        let slug = blog.slug;
        if (updateBlogDto.title) {
            slug = (0, string_1.slugify)(updateBlogDto.title);
        }
        const { featuredImage, ...blogData } = updateBlogDto;
        const allowedFields = {
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt,
            category: blogData.category,
            tags: blogData.tags,
            readTime: blogData.readTime,
            isFeatured: blogData.isFeatured,
            status: blogData.status,
            slug,
            published: blogData.status === 'published',
            ...(featuredImage !== undefined && {
                featuredImage: featuredImage ? JSON.stringify(featuredImage) : null
            })
        };
        const data = Object.entries(allowedFields)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        const updatedBlog = await this.prisma.blog.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogFeaturedImage(updatedBlog);
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.blog.delete({
            where: { id },
        });
    }
    async search(query) {
        const blogs = await this.prisma.blog.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } }
                ]
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async getPopularTags() {
        const blogs = await this.prisma.blog.findMany({
            select: {
                tags: true
            }
        });
        const tagCounts = new Map();
        blogs.forEach(blog => {
            blog.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagCounts.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    async incrementViews(id) {
        return this.prisma.blog.update({
            where: { id },
            data: {
                views: { increment: 1 }
            }
        });
    }
    async getFeaturedBlogs() {
        const blogs = await this.prisma.blog.findMany({
            where: {
                published: true,
                isFeatured: true
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async findByTag(tag) {
        const blogs = await this.prisma.blog.findMany({
            where: {
                tags: { has: tag }
            }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
    async findByCategory(category) {
        const blogs = await this.prisma.blog.findMany({
            where: { category }
        });
        return this.parseBlogsFeaturedImage(blogs);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map