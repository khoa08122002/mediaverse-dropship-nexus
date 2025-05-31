import { Module } from '@nestjs/common';
import { BlogController } from '../../controllers/blog.controller';
import { BlogService } from './blog.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {} 