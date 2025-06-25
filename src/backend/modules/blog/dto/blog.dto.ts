import { IsString, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BlogImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  alt: string;
}

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  excerpt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => BlogImageDto)
  featuredImage?: BlogImageDto;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  readTime?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ enum: ['draft', 'published'] })
  @IsString()
  status: string;
}

export class UpdateBlogDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => BlogImageDto)
  featuredImage?: BlogImageDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  readTime?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ enum: ['draft', 'published'] })
  @IsString()
  @IsOptional()
  status?: string;
} 