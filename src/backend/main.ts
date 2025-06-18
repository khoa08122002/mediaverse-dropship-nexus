import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('Starting application...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT);

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = process.env.NODE_ENV === 'production'
    ? ['https://phg2.vercel.app']
    : ['http://localhost:3000', 'http://localhost:5173'];
  
  console.log('CORS origins:', corsOrigins);
  
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Use global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Use cookie parser
  app.use(cookieParser());

  // Set global prefix
  app.setGlobalPrefix('api');

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
  await app.listen(port, '0.0.0.0');
  
  console.log('=================================');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
  console.log(`API endpoints are available at: http://localhost:${port}/api`);
  console.log(`Health check endpoint: http://localhost:${port}/api/health`);
  console.log('=================================');
}

bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});