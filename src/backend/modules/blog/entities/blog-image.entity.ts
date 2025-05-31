import { ApiProperty } from '@nestjs/swagger';

export class BlogImage {
  @ApiProperty({ description: 'URL của ảnh' })
  url: string;

  @ApiProperty({ description: 'Alt text của ảnh', required: false })
  alt?: string;
} 