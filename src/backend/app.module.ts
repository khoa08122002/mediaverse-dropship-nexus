import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    BlogModule,
    ContactModule,
    RecruitmentModule,
    FileUploadModule,
  ],
  controllers: [HealthController],
})
export class AppModule {} 