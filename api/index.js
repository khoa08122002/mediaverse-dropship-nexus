const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/backend/src/backend/app.module');
const cookieParser = require('cookie-parser');

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const corsOrigins = process.env.NODE_ENV === 'production'
      ? ['https://phg2.vercel.app']
      : ['http://localhost:3000', 'http://localhost:5173'];

    app.enableCors({
      origin: corsOrigins,
      credentials: true,
    });

    app.useGlobalPipes(new (require('@nestjs/common').ValidationPipe)({
      transform: true,
      whitelist: true,
    }));

    app.use(cookieParser());
    app.setGlobalPrefix('api');

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  const app = await createApp();
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();
  
  return instance(req, res);
}; 