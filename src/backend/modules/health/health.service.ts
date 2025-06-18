import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async check() {
    this.logger.log('Starting basic health check...');
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'mediaverse-dropship-nexus-api',
      env: process.env.NODE_ENV || 'development'
    };
  }
} 