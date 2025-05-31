"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const slugify_1 = require("slugify");
const prisma = new client_1.PrismaClient();
let BlogService = class BlogService {
    async findAll() {
        return prisma.blog.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async findFeatured() {
        return prisma.blog.findFirst({
            where: {
                AND: [
                    { isFeatured: true },
                    { status: 'published' }
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
    }
    async findById(id) {
        const blog = await prisma.blog.findUnique({
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
            throw new common_1.NotFoundException('Blog không tồn tại');
        }
        return blog;
    }
    async findBySlug(slug) {
        const blog = await prisma.blog.findUnique({
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
            throw new common_1.NotFoundException('Blog không tồn tại');
        }
        return blog;
    }
    async create(createBlogDto, authorId) {
        const slug = (0, slugify_1.default)(createBlogDto.title, { lower: true });
        return prisma.blog.create({
            data: {
                title: createBlogDto.title,
                slug,
                content: createBlogDto.content,
                excerpt: createBlogDto.excerpt,
                featuredImage: {
                    url: createBlogDto.featuredImage.url,
                    alt: createBlogDto.featuredImage.alt
                },
                category: createBlogDto.category,
                tags: createBlogDto.tags,
                readTime: createBlogDto.readTime,
                status: createBlogDto.status || 'draft',
                isFeatured: createBlogDto.isFeatured ?? false,
                author: {
                    connect: {
                        id: authorId
                    }
                }
            }
        });
    }
    async update(id, updateBlogDto) {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            throw new common_1.NotFoundException('Blog không tồn tại');
        }
        const data = { ...updateBlogDto };
        if (updateBlogDto.title) {
            data.slug = (0, slugify_1.default)(updateBlogDto.title, { lower: true });
        }
        return prisma.blog.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            throw new common_1.NotFoundException('Blog không tồn tại');
        }
        await prisma.blog.delete({ where: { id } });
        return { message: 'Blog đã được xóa thành công' };
    }
    async incrementViews(id) {
        return prisma.blog.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        });
    }
    async search(query) {
        return prisma.blog.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { tags: { hasSome: [query] } }
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
    }
    async getPopularTags() {
        const blogs = await prisma.blog.findMany({
            select: { tags: true }
        });
        const tagCount = new Map();
        blogs.forEach(blog => {
            blog.tags.forEach(tag => {
                tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);
    }
    async findByTag(tag) {
        return prisma.blog.findMany({
            where: {
                tags: {
                    has: tag
                }
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
    }
    async findByCategory(category) {
        return prisma.blog.findMany({
            where: {
                AND: [
                    { category },
                    { status: 'published' }
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
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)()
], BlogService);
//# sourceMappingURL=blog.service.js.map