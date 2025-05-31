import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { BlogService } from '../modules/blog/blog.service';
import { CreateBlogDto, UpdateBlogDto } from '../modules/user/dto/blog.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả bài viết' })
  @ApiResponse({ status: 200, description: 'Danh sách bài viết' })
  async getAllBlogs() {
    return this.blogService.findAll();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Lấy bài viết nổi bật' })
  @ApiResponse({ status: 200, description: 'Bài viết nổi bật' })
  async getFeaturedBlog() {
    return this.blogService.findFeatured();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm bài viết' })
  @ApiResponse({ status: 200, description: 'Danh sách bài viết tìm thấy' })
  async searchBlogs(@Query('q') query: string) {
    return this.blogService.search(query);
  }

  @Get('tags/popular')
  @ApiOperation({ summary: 'Lấy danh sách tags phổ biến' })
  @ApiResponse({ status: 200, description: 'Danh sách tags' })
  async getPopularTags() {
    return this.blogService.getPopularTags();
  }

  @Get('tags/:tag')
  @ApiOperation({ summary: 'Lấy bài viết theo tag' })
  @ApiResponse({ status: 200, description: 'Danh sách bài viết' })
  async getBlogsByTag(@Param('tag') tag: string) {
    return this.blogService.findByTag(tag);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Lấy bài viết theo danh mục' })
  @ApiResponse({ status: 200, description: 'Danh sách bài viết' })
  async getBlogsByCategory(@Param('category') category: string) {
    return this.blogService.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo ID' })
  @ApiResponse({ status: 200, description: 'Chi tiết bài viết' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async getBlogById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo slug' })
  @ApiResponse({ status: 200, description: 'Chi tiết bài viết' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiResponse({ status: 201, description: 'Bài viết đã được tạo' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  async createBlog(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiResponse({ status: 200, description: 'Bài viết đã được cập nhật' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài viết' })
  @ApiResponse({ status: 200, description: 'Bài viết đã được xóa' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.delete(id);
  }

  @Post(':id/views')
  @ApiOperation({ summary: 'Tăng lượt xem bài viết' })
  @ApiResponse({ status: 200, description: 'Đã tăng lượt xem' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  async incrementViews(@Param('id') id: string) {
    return this.blogService.incrementViews(id);
  }
}