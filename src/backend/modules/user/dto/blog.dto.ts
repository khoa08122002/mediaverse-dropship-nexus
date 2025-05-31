import { IsString, IsArray, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogImageDto } from './blog-image.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ description: 'Tiêu đề bài viết' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Nội dung bài viết' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Tóm tắt bài viết' })
  @IsString()
  excerpt: string;

  @ApiProperty({ description: 'Ảnh đại diện bài viết' })
  @ValidateNested()
  @Type(() => BlogImageDto)
  featuredImage: BlogImageDto;

  @ApiProperty({ description: 'Danh mục bài viết' })
  @IsString()
  category: string;

  @ApiProperty({ description: 'Các thẻ tag của bài viết', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Thời gian đọc ước tính', required: false })
  @IsString()
  @IsOptional()
  readTime?: string;

  @ApiProperty({ description: 'Bài viết có được đề xuất không', required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Trạng thái bài viết', enum: ['draft', 'published'] })
  @IsString()
  status: 'draft' | 'published';
}

export class UpdateBlogDto {
  @ApiProperty({ description: 'Tiêu đề bài viết', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Nội dung bài viết', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Tóm tắt bài viết', required: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiProperty({ description: 'Ảnh đại diện bài viết', required: false })
  @ValidateNested()
  @Type(() => BlogImageDto)
  @IsOptional()
  featuredImage?: BlogImageDto;

  @ApiProperty({ description: 'Danh mục bài viết', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Các thẻ tag của bài viết', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Thời gian đọc ước tính', required: false })
  @IsString()
  @IsOptional()
  readTime?: string;

  @ApiProperty({ description: 'Bài viết có được đề xuất không', required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Trạng thái bài viết', enum: ['draft', 'published'], required: false })
  @IsString()
  @IsOptional()
  status?: 'draft' | 'published';
} 