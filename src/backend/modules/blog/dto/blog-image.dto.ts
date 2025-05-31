import { IsString, IsOptional } from 'class-validator';

export class BlogImageDto {
  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;
} 