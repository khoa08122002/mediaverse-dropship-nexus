import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    // Print startup information
    logger.log('=================================');
    logger.log('Starting application initialization...');
    logger.log(`Environment: ${process.env.NODE_ENV}`);
    logger.log(`Port: ${process.env.PORT}`);
    logger.log(`Host: ${process.env.HOST}`);
    logger.log(`Database URL configured: ${!!process.env.DATABASE_URL}`);
    logger.log(`JWT Secret configured: ${!!process.env.JWT_SECRET}`);
    logger.log('=================================');

    // Create NestJS application
    logger.log('Creating NestJS application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Configure CORS
    const corsOrigins = process.env.NODE_ENV === 'production'
      ? ['https://phg2.vercel.app']
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    logger.log(`Configuring CORS with origins: ${corsOrigins}`);
    
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });

    // Configure global pipes and middleware
    logger.log('Configuring global pipes and middleware...');
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));

    app.use(cookieParser());
    app.setGlobalPrefix('api');

    // Configure Swagger only in development
    if (process.env.NODE_ENV !== 'production') {
      logger.log('Setting up Swagger documentation...');
      
      const config = new DocumentBuilder()
        .setTitle('PHG Corporation API')
        .setDescription('The PHG Corporation API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api/docs', app, document);
    }

    // Start the server
    const port = process.env.PORT || 3002;
    const host = process.env.HOST || '0.0.0.0';
    
    logger.log(`Attempting to start server on ${host}:${port}...`);
    
    try {
      await app.listen(port, host);
      logger.log('=================================');
      logger.log('Application successfully started!');
      logger.log(`Server is running on ${host}:${port}`);
      logger.log(`Environment: ${process.env.NODE_ENV}`);
      logger.log(`Health check endpoint: /api/health`);
      logger.log('=================================');
    } catch (error) {
      logger.error(`Failed to start server on ${host}:${port}`);
      logger.error('Server startup error:', error);
      throw error;
    }

    // Handle shutdown gracefully
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.log(`${signal} received. Shutting down gracefully...`);
        try {
          await app.close();
          logger.log('Application closed successfully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    });

  } catch (error) {
    logger.error('Fatal error during application bootstrap:');
    logger.error(error);
    process.exit(1);
  }
}

// Add global unhandled error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:');
  console.error(reason);
  process.exit(1);
});

bootstrap();