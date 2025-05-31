import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateBlogDto, UpdateBlogDto } from '../user/dto/blog.dto';
import slugify from 'slugify';

const prisma = new PrismaClient();

@Injectable()
export class BlogService {
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

  async findById(id: string) {
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
      throw new NotFoundException('Blog không tồn tại');
    }

    return blog;
  }

  async findBySlug(slug: string) {
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
      throw new NotFoundException('Blog không tồn tại');
    }

    return blog;
  }

  async create(createBlogDto: CreateBlogDto, authorId: string) {
    const slug = slugify(createBlogDto.title, { lower: true });

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

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog không tồn tại');
    }

    const data: any = { ...updateBlogDto };
    if (updateBlogDto.title) {
      data.slug = slugify(updateBlogDto.title, { lower: true });
    }

    return prisma.blog.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog không tồn tại');
    }

    await prisma.blog.delete({ where: { id } });
    return { message: 'Blog đã được xóa thành công' };
  }

  async incrementViews(id: string) {
    return prisma.blog.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });
  }

  async search(query: string) {
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

    const tagCount = new Map<string, number>();
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

  async findByTag(tag: string) {
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

  async findByCategory(category: string) {
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
} 