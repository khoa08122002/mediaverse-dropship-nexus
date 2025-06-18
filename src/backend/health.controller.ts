import { Controller, Get, Injectable } from '@nestjs/common';
import { Public } from './modules/auth/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  async check() {
    const startTime = Date.now();
    let dbStatus = 'unknown';
    let error = null;

    try {
      console.log('Starting health check...');
      
      // Basic application check
      const appStatus = {
        status: 'ok',
        service: 'mediaverse-dropship-nexus-api',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
      
      console.log('Application status:', appStatus);

      // Database check
      try {
        console.log('Checking database connection...');
        const isHealthy = await this.prisma.isHealthy();
        dbStatus = isHealthy ? 'connected' : 'disconnected';
        if (isHealthy) {
          console.log('Database connection successful');
        } else {
          console.error('Database health check failed');
        }
      } catch (e) {
        dbStatus = 'disconnected';
        error = e.message;
        console.error('Database health check failed:', {
          error: e.message,
          stack: e.stack,
          DATABASE_URL_SET: !!process.env.DATABASE_URL
        });
      }

      const response = {
        ...appStatus,
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: {
          status: dbStatus,
          error: error,
          responseTime: `${Date.now() - startTime}ms`
        },
        env: {
          NODE_ENV: process.env.NODE_ENV || 'development',
          DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not_set',
          PORT: process.env.PORT || '3002'
        },
        memory: {
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB'
        }
      };

      console.log('Health check complete:', response);
      return response;
    } catch (e) {
      console.error('Unexpected error in health check:', e);
      throw e;
    }
  }
} 