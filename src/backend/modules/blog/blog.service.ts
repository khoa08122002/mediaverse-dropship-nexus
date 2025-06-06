import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { slugify } from '../../../utils/string';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blog.findMany({
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

    return blog;
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

    return blog;
  }

  async getFeatured() {
    return this.prisma.blog.findMany({
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
  }

  async getByTag(tag: string) {
    return this.prisma.blog.findMany({
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
  }

  async getByCategory(category: string) {
    return this.prisma.blog.findMany({
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
  }

  async create(createBlogDto: CreateBlogDto, authorId: string) {
    const slug = slugify(createBlogDto.title);
    const { featuredImage, ...blogData } = createBlogDto;

    return this.prisma.blog.create({
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

    const { featuredImage, author, authorId, id: blogId, createdAt, updatedAt, views, ...blogData } = updateBlogDto;

    const data = {
      ...blogData,
      slug,
      ...(updateBlogDto.status && { published: updateBlogDto.status === 'published' }),
      ...(featuredImage !== undefined && { 
        featuredImage: featuredImage ? JSON.stringify(featuredImage) : null 
      }),
    };

    return this.prisma.blog.update({
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
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.blog.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return this.prisma.blog.findMany({
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
    return this.prisma.blog.findMany({
      where: {
        published: true,
        isFeatured: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  async findByTag(tag: string) {
    return this.prisma.blog.findMany({
      where: {
        tags: { has: tag }
      }
    });
  }

  async findByCategory(category: string) {
    return this.prisma.blog.findMany({
      where: { 
        AND: [
          { category },
          { published: true }
        ]
      },
    });
  }
} 