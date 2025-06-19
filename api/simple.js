module.exports = async (req, res) => {
  try {
    console.log(`Simple function called: ${req.method} ${req.url}`);
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Simple routing based on URL
    const url = req.url || '/';
    
    if (url.includes('/health')) {
      res.status(200).json({
        status: 'ok',
        message: 'Simple health check working',
        timestamp,
        service: 'simple-vercel-function',
        method: req.method,
        url: req.url
      });
    } else if (url.includes('/test')) {
      res.status(200).json({
        status: 'ok',
        message: 'Simple test endpoint working',
        timestamp,
        method: req.method,
        url: req.url,
        headers: req.headers,
        environment: process.env.NODE_ENV || 'unknown'
      });
    } else {
      res.status(200).json({
        status: 'ok',
        message: 'Simple function root endpoint',
        timestamp,
        method: req.method,
        url: req.url,
        availableEndpoints: ['/health', '/test']
      });
    }
    
  } catch (error) {
    console.error('Simple function error:', error);
    
    // Manual JSON response as fallback
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Simple function failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }));
  }
}; 