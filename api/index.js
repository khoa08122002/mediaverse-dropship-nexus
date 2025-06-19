// Fallback response for when NestJS fails
function createFallbackResponse(req, res) {
  console.log('Using fallback response for NestJS');
  res.status(200).json({
    status: 'ok',
    message: 'NestJS fallback - dependencies failed to load',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    platform: 'vercel-nestjs-fallback'
  });
}

let cachedApp;
let initializationFailed = false;

async function createApp() {
  if (initializationFailed) {
    throw new Error('Previous initialization failed');
  }
  
  if (!cachedApp) {
    try {
      console.log('Creating NestJS app for Vercel...');
      
      // Try to load dependencies
      const { NestFactory } = require('@nestjs/core');
      const { AppModule } = require('../dist/backend/src/backend/app.module');
      const cookieParser = require('cookie-parser');
      
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
      initializationFailed = true;
      throw error;
    }
  }
  return cachedApp;
}

module.exports = async (req, res) => {
  try {
    console.log(`Handling ${req.method} ${req.url}`);
    
    // Try to create and use NestJS app
    try {
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
    } catch (nestError) {
      console.error('NestJS failed, using fallback:', nestError);
      return createFallbackResponse(req, res);
    }
    
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Last resort fallback
    try {
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        fallback: true
      });
    } catch (resError) {
      console.error('Failed to send error response:', resError);
    }
  }
}; 