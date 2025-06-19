module.exports = async (req, res) => {
  try {
    console.log(`Express-simple called: ${req.method} ${req.url}`);
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Simple routing based on URL
    const url = req.url || '/';
    
    if (url.includes('/health')) {
      res.status(200).json({
        status: 'ok',
        message: 'Express simple health check',
        timestamp,
        service: 'express-simple-vercel',
        platform: 'vercel-express-simple',
        method: req.method,
        url: req.url
      });
    } else if (url.includes('/test')) {
      res.status(200).json({
        status: 'ok',
        message: 'Express simple test endpoint',
        timestamp,
        method: req.method,
        url: req.url,
        platform: 'vercel-express-simple'
      });
    } else {
      // Root endpoint
      res.status(200).json({
        status: 'ok',
        message: 'Express simple server working on Vercel',
        timestamp,
        method: req.method,
        url: req.url,
        platform: 'vercel-express-simple',
        service: 'mediaverse-dropship-nexus',
        availableEndpoints: ['/', '/health', '/test']
      });
    }
    
  } catch (error) {
    console.error('Express simple function error:', error);
    
    // Manual JSON response as fallback
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Express simple function failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }));
  }
}; 