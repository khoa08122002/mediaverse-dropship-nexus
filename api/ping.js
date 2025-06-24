module.exports = async (req, res) => {
  try {
    // Set CORS headers
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

    console.log('Ping endpoint hit:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      status: 'success',
      message: 'Pong! API is working',
      data: {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!process.env.JWT_SECRET
        },
        serverInfo: {
          platform: 'vercel',
          region: process.env.VERCEL_REGION || 'unknown'
        }
      }
    });

  } catch (error) {
    console.error('Ping error:', error);
    return res.status(500).json({
      error: 'Ping failed',
      details: error.message
    });
  }
}; 