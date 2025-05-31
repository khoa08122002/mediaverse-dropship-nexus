import { ApiProperty } from '@nestjs/swagger';
import { BlogImage } from './blog-image.entity';

export class Blog {
  @ApiProperty({ description: 'ID của bài viết' })
  id: string;

  @ApiProperty({ description: 'Tiêu đề bài viết' })
  title: string;

  @ApiProperty({ description: 'Slug của bài viết' })
  slug: string;

  @ApiProperty({ description: 'Nội dung bài viết' })
  content: string;

  @ApiProperty({ description: 'Tóm tắt bài viết' })
  excerpt: string;

  @ApiProperty({ description: 'Ảnh đại diện bài viết', type: BlogImage })
  featuredImage: BlogImage;

  @ApiProperty({ description: 'Danh mục bài viết' })
  category: string;

  @ApiProperty({ description: 'Các thẻ tag của bài viết', type: [String] })
  tags: string[];

  @ApiProperty({ description: 'Thời gian đọc ước tính', required: false })
  readTime?: string;

  @ApiProperty({ description: 'Số lượt xem' })
  views: number;

  @ApiProperty({ description: 'Bài viết có được đề xuất không' })
  isFeatured: boolean;

  @ApiProperty({ description: 'ID của tác giả' })
  authorId: string;

  @ApiProperty({ description: 'Ngày tạo bài viết' })
  createdAt: Date;

  @ApiProperty({ description: 'Ngày cập nhật bài viết' })
  updatedAt: Date;
} 