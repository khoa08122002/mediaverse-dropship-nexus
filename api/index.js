const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/backend/src/backend/app.module');
const cookieParser = require('cookie-parser');

let cachedApp;

async function createApp() {
  if (!cachedApp) {
    try {
      console.log('Creating NestJS app for Vercel...');
      
      cachedApp = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log'],
      });

      const corsOrigins = process.env.NODE_ENV === 'production'
        ? ['https://phg2.vercel.app', 'https://mediaverse-dropship-nexus.vercel.app']
        : ['http://localhost:3000', 'http://localhost:5173'];

      cachedApp.enableCors({
        origin: corsOrigins,
        credentials: true,
      });

      cachedApp.useGlobalPipes(new (require('@nestjs/common').ValidationPipe)({
        transform: true,
        whitelist: true,
      }));

      cachedApp.use(cookieParser());
      cachedApp.setGlobalPrefix('api');

      await cachedApp.init();
      console.log('NestJS app initialized successfully');
    } catch (error) {
      console.error('Failed to create NestJS app:', error);
      throw error;
    }
  }
  return cachedApp;
}

module.exports = async (req, res) => {
  try {
    console.log(`Handling ${req.method} ${req.url}`);
    
    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    
    // Handle the request
    return new Promise((resolve, reject) => {
      instance(req, res, (err) => {
        if (err) {
          console.error('Request handling error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 