// Fallback function if Express fails
function createFallbackResponse(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Fallback response - Express dependencies failed',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}

try {
    var express = require('express');
    var cookieParser = require('cookie-parser');
    
    // Create Express app
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    // CORS
    app.use((req, res, next) => {
      const corsOrigins = process.env.NODE_ENV === 'production'
        ? ['https://phg2.vercel.app', 'https://mediaverse-dropship-nexus.vercel.app']
        : ['http://localhost:3000', 'http://localhost:5173'];
        
      const origin = req.headers.origin;
      if (corsOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      next();
    });

    // Routes
    app.get('/', (req, res) => {
      console.log('Express root endpoint called');
      res.json({
        status: 'ok',
        message: 'Express server is working on Vercel',
        timestamp: new Date().toISOString(),
        service: 'mediaverse-dropship-nexus-express',
        platform: 'vercel-express',
        availableEndpoints: ['/health', '/test']
      });
    });

    app.get('/health', (req, res) => {
      console.log('Express health check called');
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'mediaverse-dropship-nexus-express',
        platform: 'vercel-express'
      });
    });

    app.get('/test', (req, res) => {
      console.log('Express test endpoint called');
      res.json({
        status: 'ok',
        message: 'Express on Vercel is working',
        timestamp: new Date().toISOString()
      });
    });

    // Catch all
    app.use('*', (req, res) => {
      console.log(`Express handling: ${req.method} ${req.originalUrl}`);
      res.status(404).json({
        error: 'Endpoint not found',
        method: req.method,
        path: req.originalUrl,
        message: 'Available endpoints: /, /health, /test'
      });
    });

    // Error handler
    app.use((error, req, res, next) => {
      console.error('Express error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    });

    module.exports = app;
    
  } catch (error) {
    console.error('Failed to create Express app:', error);
    
    // Export fallback function
    module.exports = (req, res) => {
      return createFallbackResponse(req, res);
    };
  } 