import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../prisma';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('blogs')
@Controller('blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  async findAll() {
    return this.blogService.findAll();
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured blogs' })
  async getFeatured() {
    return this.blogService.getFeatured();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by id' })
  async findById(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search for blogs' })
  async search(@Query('q') query: string) {
    return this.blogService.search(query);
  }

  @Public()
  @Get('tags/popular')
  @ApiOperation({ summary: 'Get popular tags' })
  async getPopularTags() {
    return this.blogService.getPopularTags();
  }

  @Public()
  @Get('tags/:tag')
  @ApiOperation({ summary: 'Get blogs by tag' })
  async getByTag(@Param('tag') tag: string) {
    return this.blogService.getByTag(tag);
  }

  @Public()
  @Get('category/:category')
  @ApiOperation({ summary: 'Get blogs by category' })
  async getByCategory(@Param('category') category: string) {
    return this.blogService.getByCategory(category);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Create a new blog' })
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: any) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Update a blog' })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @Req() req: any) {
    return this.blogService.update(id, updateBlogDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Delete a blog' })
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }

  @Public()
  @Post(':id/views')
  @ApiOperation({ summary: 'Increment views for a blog' })
  async incrementViews(@Param('id') id: string) {
    return this.blogService.incrementViews(id);
  }
} 