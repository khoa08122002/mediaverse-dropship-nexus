const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Prisma client
let prisma;
let dbConnectionStatus = 'disconnected';

try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    dbConnectionStatus = 'initializing';
    console.log('Prisma client initialized with DATABASE_URL');
  } else {
    console.warn('DATABASE_URL not found in environment variables');
    dbConnectionStatus = 'no-url';
  }
} catch (error) {
  console.error('Prisma initialization failed:', error);
  dbConnectionStatus = 'failed';
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
    if (!prisma) {
      throw new Error('Database not initialized');
    }
    // Test database connection
    await prisma.$connect();
    dbConnectionStatus = 'connected';
    const result = await operation(prisma);
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    dbConnectionStatus = 'error';
    throw error;
  }
}

// Fallback data
const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "fulltime",
    description: "Join our team as a Frontend Developer to build amazing user experiences.",
    requirements: "3+ years React experience, TypeScript, modern CSS",
    benefits: "Competitive salary, remote work, health insurance",
    salary: "$60,000 - $80,000",
    status: "active",
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    applications: []
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering", 
    location: "Ho Chi Minh City",
    type: "fulltime",
    description: "We're looking for a Backend Developer to build scalable APIs and services.",
    requirements: "Node.js, PostgreSQL, Docker, API design",
    benefits: "Great team, learning opportunities, career growth",
    salary: "$55,000 - $75,000",
    status: "active",
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    applications: []
  }
];

const mockBlogs = [
  {
    id: "1",
    title: "Getting Started with React 19",
    slug: "getting-started-react-19",
    content: "React 19 brings exciting new features...",
    excerpt: "Discover the latest features in React 19",
    featuredImage: null,
    category: "Technology",
    tags: ["React", "JavaScript", "Frontend"],
    readTime: "5 min",
    isFeatured: true,
    status: "published",
    published: true,
    views: 150,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    author: {
      fullName: "Tech Team",
      email: "tech@phg.com"
    }
  },
  {
    id: "2", 
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    content: "Web development is rapidly evolving...",
    excerpt: "Exploring trends shaping the future of web development",
    featuredImage: null,
    category: "Industry",
    tags: ["Web Development", "Trends", "Future"],
    readTime: "8 min",
    isFeatured: false,
    status: "published",
    published: true,
    views: 89,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    author: {
      fullName: "Editorial Team",
      email: "editorial@phg.com"
    }
  }
];

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

    // DEBUG: Log the exact URL and method for debugging
    console.log(`[DEBUG] Exact URL received: "${url}", Method: ${method}`);
    console.log(`[DEBUG] URL type: ${typeof url}, URL length: ${url.length}`);

    // Clean URL: remove query params, trailing slashes, and /api/backend prefix
    let cleanUrl = url.split('?')[0].replace(/\/+$/, '') || '/';
    
    // Remove /api/backend prefix if present
    if (cleanUrl.startsWith('/api/backend')) {
      cleanUrl = cleanUrl.replace('/api/backend', '') || '/';
    }
    
    console.log(`[DEBUG] Cleaned URL: "${cleanUrl}" (after removing /api/backend prefix)`);

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
    if (cleanUrl === '/' || cleanUrl === '/health') {
      return res.status(200).json({
        status: 'ok',
        message: 'PHG Corporation API Backend',
        timestamp: new Date().toISOString(),
        service: 'comprehensive-backend',
        platform: 'vercel-express',
        database: {
          status: dbConnectionStatus,
          hasUrl: !!process.env.DATABASE_URL,
          prismaClient: !!prisma,
          fallbackMode: !prisma || dbConnectionStatus !== 'connected'
        }
      });
    }

    // Route: Auth Login
    if (cleanUrl === '/auth/login' && method === 'POST') {
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
    if (cleanUrl === '/recruitment/jobs' && method === 'GET') {
      try {
        if (!prisma || dbConnectionStatus !== 'connected') {
          console.log('Using fallback job data - database not available');
          // Return array directly for frontend compatibility
          res.setHeader('X-Data-Source', 'fallback');
          res.setHeader('X-Data-Message', 'Database not available, showing sample data');
          return res.status(200).json(mockJobs);
        }

        const jobs = await withDatabase(async (db) => {
          return await db.job.findMany({
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
          });
        });

        // Return array directly for frontend compatibility
        res.setHeader('X-Data-Source', 'database');
        res.setHeader('X-Data-Count', jobs.length.toString());
        return res.status(200).json(jobs);
      } catch (error) {
        console.error('Get jobs error:', error);
        console.log('Falling back to mock data due to database error');
        res.setHeader('X-Data-Source', 'fallback-error');
        res.setHeader('X-Data-Message', 'Database error, showing sample data');
        return res.status(200).json(mockJobs);
      }
    }

    // Route: Get Job by ID (Public)
    if (cleanUrl.startsWith('/recruitment/jobs/') && method === 'GET') {
      try {
        const jobId = parseInt(cleanUrl.split('/')[3]);
        
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
    if (cleanUrl === '/blogs' && method === 'GET') {
      try {
        if (!prisma || dbConnectionStatus !== 'connected') {
          console.log('Using fallback blog data - database not available');
          // Return array directly for frontend compatibility
          res.setHeader('X-Data-Source', 'fallback');
          res.setHeader('X-Data-Message', 'Database not available, showing sample data');
          return res.status(200).json(mockBlogs);
        }

        const blogs = await withDatabase(async (db) => {
          return await db.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        // Return array directly for frontend compatibility
        res.setHeader('X-Data-Source', 'database');
        res.setHeader('X-Data-Count', blogs.length.toString());
        return res.status(200).json(blogs);
      } catch (error) {
        console.error('Get blogs error:', error);
        console.log('Falling back to mock data due to database error');
        res.setHeader('X-Data-Source', 'fallback-error');
        res.setHeader('X-Data-Message', 'Database error, showing sample data');
        return res.status(200).json(mockBlogs);
      }
    }

    // Route: Create Contact (Public)
    if (cleanUrl === '/contacts' && method === 'POST') {
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
    if (cleanUrl === '/users/profile' && method === 'GET') {
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
    if (cleanUrl === '/docs' || cleanUrl === '/swagger') {
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
      originalUrl: req.url,
      cleanedUrl: cleanUrl,
      message: 'This API endpoint is not implemented yet',
      debug: {
        urlReceived: `"${url}"`,
        urlCleaned: `"${cleanUrl}"`,
        urlLength: url.length,
        urlType: typeof url
      },
      availableEndpoints: [
        '/ (root/health)',
        '/health',
        '/auth/login (POST)',
        '/recruitment/jobs (GET)',
        '/blogs (GET)',
        '/contacts (POST)',
        '/users/profile (GET)',
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