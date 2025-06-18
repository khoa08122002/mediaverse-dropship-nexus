import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check() {
    const startTime = Date.now();
    let dbStatus = 'unknown';
    let error = null;

    try {
      this.logger.log('Starting health check...');
      
      // Basic application check
      const appStatus = {
        status: 'ok',
        service: 'mediaverse-dropship-nexus-api',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
      
      this.logger.log('Application status:', appStatus);

      // Database check
      try {
        this.logger.log('Checking database connection...');
        await this.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
        this.logger.log('Database connection successful');
      } catch (e) {
        dbStatus = 'disconnected';
        error = e.message;
        this.logger.error('Database health check failed:', {
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

      this.logger.log('Health check complete:', response);
      return response;
    } catch (e) {
      this.logger.error('Unexpected error in health check:', e);
      throw e;
    }
  }
} 