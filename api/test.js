module.exports = async (req, res) => {
  try {
    console.log(`Test endpoint called: ${req.method} ${req.url}`);
    
    res.status(200).json({
      status: 'ok',
      message: 'Vercel serverless function is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Test function error:', error);
    res.status(500).json({
      error: 'Test function failed',
      message: error.message
    });
  }
}; 