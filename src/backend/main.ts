import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    console.log('=================================');
    console.log('Starting application initialization...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Port:', process.env.PORT);
    console.log('Database URL is set:', !!process.env.DATABASE_URL);
    console.log('JWT Secret is set:', !!process.env.JWT_SECRET);
    console.log('=================================');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable CORS
    const corsOrigins = process.env.NODE_ENV === 'production'
      ? ['https://phg2.vercel.app']
      : ['http://localhost:3000', 'http://localhost:5173'];
    
    console.log('Configuring CORS with origins:', corsOrigins);
    
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    console.log('Setting up global pipes and middleware...');
    
    // Use global pipes
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Use cookie parser
    app.use(cookieParser());

    // Set global prefix
    app.setGlobalPrefix('api');

    console.log('Setting up Swagger documentation...');
    
    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('PHG Corporation API')
      .setDescription('The PHG Corporation API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3002;
    
    console.log('Starting server...');
    await app.listen(port, '0.0.0.0');
    
    console.log('=================================');
    console.log(`Application successfully started!`);
    console.log(`Server is running on port: ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Health check endpoint: http://0.0.0.0:${port}/api/health`);
    console.log('=================================');
    
    // Handle shutdown gracefully
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      await app.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

bootstrap().catch(error => {
  console.error('Fatal error during bootstrap:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});