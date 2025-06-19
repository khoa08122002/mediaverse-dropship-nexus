import { Module, Controller, Get, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { HealthModule } from './modules/health/health.module';
import { Public } from './modules/auth/decorators/public.decorator';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Public()
  @Get('health')
  health() {
    this.logger.log('Health check requested');
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.production'],
      expandVariables: true,
      validate: (config: Record<string, unknown>) => {
        const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
        const missing = required.filter(key => !config[key]);
        if (missing.length > 0) {
          throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return config;
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    BlogModule,
    ContactModule,
    RecruitmentModule,
    FileUploadModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {} 