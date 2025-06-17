import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { slugify } from '../../../utils/string';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  private parseBlogFeaturedImage(blog: any) {
    if (!blog) return null;
    return {
      ...blog,
      featuredImage: blog.featuredImage ? JSON.parse(blog.featuredImage) : null
    };
  }

  private parseBlogsFeaturedImage(blogs: any[]) {
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

  async findOne(id: string) {
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
      throw new NotFoundException('Blog not found');
    }

    return this.parseBlogFeaturedImage(blog);
  }

  async findBySlug(slug: string) {
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
      throw new NotFoundException('Blog not found');
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

  async getByTag(tag: string) {
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

  async getByCategory(category: string) {
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

  async create(createBlogDto: CreateBlogDto, authorId: string) {
    const slug = slugify(createBlogDto.title);
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

  async update(id: string, updateBlogDto: UpdateBlogDto, user: any) {
    const blog = await this.findOne(id);
    
    // Kiểm tra quyền: chỉ ADMIN hoặc tác giả mới được cập nhật toàn bộ bài viết
    if (user.role !== 'ADMIN' && blog.authorId !== user.id) {
      // Nếu không phải ADMIN hoặc tác giả, chỉ cho phép cập nhật trường isFeatured
      const { isFeatured, ...otherFields } = updateBlogDto;
      if (Object.keys(otherFields).length > 0) {
        throw new ForbiddenException('Bạn không có quyền cập nhật các trường khác của bài viết này');
      }
    }
    
    let slug = blog.slug;
    if (updateBlogDto.title) {
      slug = slugify(updateBlogDto.title);
    }

    const { featuredImage, ...blogData } = updateBlogDto;

    // Chỉ lấy các trường được phép cập nhật
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

    // Lọc bỏ các trường undefined
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

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.blog.delete({
      where: { id },
    });
  }

  async search(query: string) {
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

  async getPopularTags(): Promise<{ tag: string; count: number }[]> {
    const blogs = await this.prisma.blog.findMany({
      select: {
        tags: true
      }
    });

    const tagCounts = new Map<string, number>();
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

  async incrementViews(id: string) {
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

  async findByTag(tag: string) {
    const blogs = await this.prisma.blog.findMany({
      where: {
        tags: { has: tag }
      }
    });

    return this.parseBlogsFeaturedImage(blogs);
  }

  async findByCategory(category: string) {
    const blogs = await this.prisma.blog.findMany({
      where: { category }
    });

    return this.parseBlogsFeaturedImage(blogs);
  }
} 