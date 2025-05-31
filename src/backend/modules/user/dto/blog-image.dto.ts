import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlogImageDto {
  @ApiProperty({ description: 'URL của hình ảnh' })
  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;
} 