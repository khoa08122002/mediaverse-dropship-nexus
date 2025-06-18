import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log all queries in development
    if (process.env.NODE_ENV !== 'production') {
      this.$on<any>('query', (e: Prisma.QueryEvent) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Always log errors
    this.$on<any>('error', (e: Prisma.LogEvent) => {
      this.logger.error(`Database error: ${e.message}`);
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Attempting to connect to database...');
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      if (this.isConnected) {
        this.logger.log('Disconnecting from database...');
        await this.$disconnect();
        this.isConnected = false;
        this.logger.log('Successfully disconnected from database');
      }
    } catch (error) {
      this.logger.error(`Error disconnecting from database: ${error.message}`);
      throw error;
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error(`Health check failed: ${error.message}`);
      return false;
    }
  }
} 