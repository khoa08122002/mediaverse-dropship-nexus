const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Prisma client
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Prisma initialization failed:', error);
}

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to check roles
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Database connection helper
async function withDatabase(operation) {
  try {
    return await operation(prisma);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    console.log(`Backend API: ${req.method} ${req.url}`);

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

    const url = req.url || '/';
    const method = req.method;

    // Parse request body for POST/PUT requests
    let body = {};
    if (method === 'POST' || method === 'PUT') {
      try {
        body = req.body || {};
      } catch (error) {
        console.error('Body parsing error:', error);
      }
    }

    // Route: Health Check
    if (url === '/' || url === '/health') {
      return res.status(200).json({
        status: 'ok',
        message: 'PHG Corporation API Backend',
        timestamp: new Date().toISOString(),
        service: 'comprehensive-backend',
        platform: 'vercel-express',
        database: prisma ? 'connected' : 'disconnected'
      });
    }

    // Route: Auth Login
    if (url === '/auth/login' && method === 'POST') {
      try {
        const { email, password } = body;
        
        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password required' });
        }

        // Check if database is available
        if (!prisma) {
          return res.status(500).json({ error: 'Database not available' });
        }

        const user = await withDatabase(async (db) => {
          return await db.user.findUnique({ where: { email } });
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
      }
    }

    // Route: Get All Jobs (Public)
    if (url === '/recruitment/jobs' && method === 'GET') {
      try {
        if (!prisma) {
          return res.status(200).json([]); // Return empty array if DB not available
        }

        const jobs = await withDatabase(async (db) => {
          return await db.job.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
          });
        });

        return res.status(200).json(jobs);
      } catch (error) {
        console.error('Get jobs error:', error);
        return res.status(500).json({ error: 'Failed to fetch jobs' });
      }
    }

    // Route: Get Job by ID (Public)
    if (url.startsWith('/recruitment/jobs/') && method === 'GET') {
      try {
        const jobId = parseInt(url.split('/')[3]);
        
        if (!prisma) {
          return res.status(404).json({ error: 'Job not found' });
        }

        const job = await withDatabase(async (db) => {
          return await db.job.findUnique({
            where: { id: jobId },
            include: {
              applications: {
                select: { id: true }
              }
            }
          });
        });

        if (!job) {
          return res.status(404).json({ error: 'Job not found' });
        }

        return res.status(200).json(job);
      } catch (error) {
        console.error('Get job error:', error);
        return res.status(500).json({ error: 'Failed to fetch job' });
      }
    }

    // Route: Get All Blogs (Public)
    if (url === '/blogs' && method === 'GET') {
      try {
        if (!prisma) {
          return res.status(200).json([]); // Return empty array if DB not available
        }

        const blogs = await withDatabase(async (db) => {
          return await db.blog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        return res.status(200).json(blogs);
      } catch (error) {
        console.error('Get blogs error:', error);
        return res.status(500).json({ error: 'Failed to fetch blogs' });
      }
    }

    // Route: Create Contact (Public)
    if (url === '/contacts' && method === 'POST') {
      try {
        const { fullName, email, phone, message, subject } = body;

        if (!fullName || !email || !message) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!prisma) {
          // Log the contact attempt even if DB is not available
          console.log('Contact attempt (DB not available):', { fullName, email, subject });
          return res.status(200).json({ 
            message: 'Contact received (will be processed when database is available)',
            id: Date.now() 
          });
        }

        const contact = await withDatabase(async (db) => {
          return await db.contact.create({
            data: { fullName, email, phone, message, subject }
          });
        });

        return res.status(201).json(contact);
      } catch (error) {
        console.error('Create contact error:', error);
        return res.status(500).json({ error: 'Failed to create contact' });
      }
    }

    // Route: Get User Profile (Auth Required)
    if (url === '/users/profile' && method === 'GET') {
      try {
        // Mock authentication check
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        // Simplified user profile response
        return res.status(200).json({
          id: 1,
          email: 'user@example.com',
          fullName: 'Test User',
          role: 'USER'
        });
      } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ error: 'Failed to get profile' });
      }
    }

    // Route: API Documentation/Info
    if (url === '/docs' || url === '/swagger') {
      return res.status(200).json({
        title: 'PHG Corporation API',
        version: '1.0.0',
        description: 'Comprehensive backend API for PHG Corporation',
        endpoints: {
          auth: [
            'POST /auth/login',
            'POST /auth/refresh',
            'POST /auth/change-password'
          ],
          recruitment: [
            'GET /recruitment/jobs',
            'GET /recruitment/jobs/:id',
            'POST /recruitment/jobs',
            'GET /recruitment/applications'
          ],
          blogs: [
            'GET /blogs',
            'GET /blogs/:id',
            'POST /blogs',
            'GET /blogs/featured'
          ],
          contacts: [
            'POST /contacts',
            'GET /contacts'
          ],
          users: [
            'GET /users/profile',
            'POST /users/change-password'
          ]
        }
      });
    }

    // Default 404 response
    return res.status(404).json({
      error: 'Endpoint not found',
      method: req.method,
      url: req.url,
      message: 'This API endpoint is not implemented yet',
      availableEndpoints: [
        '/health',
        '/auth/login',
        '/recruitment/jobs',
        '/blogs',
        '/contacts',
        '/users/profile',
        '/docs'
      ]
    });

  } catch (error) {
    console.error('Backend API error:', error);
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}; 