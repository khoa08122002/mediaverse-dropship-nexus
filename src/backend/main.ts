import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    // Print startup information
    logger.log('=================================');
    logger.log('Starting application initialization...');
    logger.log(`Environment: ${process.env.NODE_ENV}`);
    logger.log(`Port: ${process.env.PORT}`);
    logger.log(`Host: ${process.env.HOST}`);
    logger.log('=================================');

    // Create NestJS application
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      abortOnError: false,
    });

    // Configure CORS
    const corsOrigins = process.env.NODE_ENV === 'production'
      ? ['https://phg2.vercel.app']
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    logger.log(`Configuring CORS with origins: ${corsOrigins}`);
    
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    // Configure global pipes and middleware
    logger.log('Setting up global pipes and middleware...');
    
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    app.use(cookieParser());
    app.setGlobalPrefix('api');

    // Configure Swagger
    logger.log('Setting up Swagger documentation...');
    
    const config = new DocumentBuilder()
      .setTitle('PHG Corporation API')
      .setDescription('The PHG Corporation API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start the server
    const port = process.env.PORT || 3002;
    const host = process.env.HOST || '0.0.0.0';
    
    logger.log(`Starting server on ${host}:${port}...`);
    await app.listen(port, host);
    
    logger.log('=================================');
    logger.log('Application successfully started!');
    logger.log(`Server is running on ${host}:${port}`);
    logger.log(`Environment: ${process.env.NODE_ENV}`);
    logger.log(`Health check endpoint: /api/health`);
    logger.log('=================================');
    
    // Handle shutdown gracefully
    process.on('SIGTERM', async () => {
      logger.log('SIGTERM received. Shutting down gracefully...');
      try {
        await app.close();
        logger.log('Application closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start application:', error);
    logger.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Start the application
bootstrap().catch(error => {
  console.error('Fatal error during bootstrap:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});