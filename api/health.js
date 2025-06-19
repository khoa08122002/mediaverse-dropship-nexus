module.exports = async (req, res) => {
  try {
    console.log('Health check endpoint called');
    
    // Simple health check without database dependencies
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'mediaverse-dropship-nexus-vercel',
      environment: process.env.NODE_ENV || 'production',
      platform: 'vercel-serverless'
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}; 