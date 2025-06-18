import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check() {
    try {
      this.logger.log('Starting health check...');
      
      // Basic application check
      const appStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'mediaverse-dropship-nexus-api',
        env: process.env.NODE_ENV || 'development'
      };

      // Database connection check
      let dbStatus = 'unknown';
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
        this.logger.log('Database health check passed');
      } catch (error) {
        dbStatus = 'disconnected';
        this.logger.error(`Database health check failed: ${error.message}`);
        throw new ServiceUnavailableException('Database connection failed');
      }

      return {
        ...appStatus,
        checks: {
          database: dbStatus
        }
      };
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      throw new ServiceUnavailableException('Service health check failed');
    }
  }
} 