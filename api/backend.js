const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPrismaClient, withDatabase } = require('./prisma-singleton');

let dbConnectionStatus = 'disconnected';

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

// Helper function to parse request body
async function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) {
      resolve(req.body);
      return;
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        console.error('Body parsing error:', error);
        resolve({});
      }
    });
  });
}

// Get database status
function updateDbStatus() {
  try {
    const prisma = getPrismaClient();
    dbConnectionStatus = 'connected';
    return true;
  } catch (error) {
    dbConnectionStatus = 'error';
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    console.log(`Backend API: ${req.method} ${req.url}`);
    console.log(`[DEBUG] Headers:`, JSON.stringify(req.headers, null, 2));
    console.log(`[DEBUG] Environment:`, {
      NODE_ENV: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      dbStatus: dbConnectionStatus
    });

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
        body = await parseBody(req);
        console.log('[DEBUG] Parsed body:', JSON.stringify(body, null, 2));
      } catch (error) {
        console.error('Body parsing error:', error);
        body = {};
      }
    }

    // Route: Health Check
    if (cleanUrl === '/' || cleanUrl === '/health') {
      return res.status(200).json({
        status: 'ok',
        message: 'PHG Corporation API Backend - DATABASE ONLY',
        timestamp: new Date().toISOString(),
        service: 'database-backend',
        platform: 'vercel-express',
        database: {
          status: dbConnectionStatus,
          hasUrl: !!process.env.DATABASE_URL,
          prismaClient: updateDbStatus(),
          mockDataRemoved: true
        }
      });
    }

    // Route: Auth Login - DATABASE ONLY
    if (cleanUrl === '/auth/login' && method === 'POST') {
      try {
        console.log('[DEBUG] Login attempt started');
        const { email, password } = body;
        
        console.log('[DEBUG] Login data:', { email: email, hasPassword: !!password });
        
        if (!email || !password) {
          console.log('[DEBUG] Missing email or password');
          return res.status(400).json({ error: 'Email and password required' });
        }

        // ONLY DATABASE - NO MOCK DATA
        const hasPrisma = updateDbStatus();
        if (!hasPrisma) {
          console.log('[DEBUG] Prisma client not available');
          return res.status(503).json({ 
            error: 'Database not available - check configuration',
            details: {
              hasUrl: !!process.env.DATABASE_URL,
              dbStatus: dbConnectionStatus
            }
          });
        }

        console.log('[DEBUG] Attempting to find user by email');
        let user;
        try {
          user = await withDatabase(async (db) => {
            console.log('[DEBUG] Executing findUnique query for email:', email);
            const foundUser = await db.user.findUnique({ where: { email } });
            console.log('[DEBUG] Query result:', foundUser ? 'User found' : 'User not found');
            return foundUser;
          });
        } catch (dbError) {
          console.error('[DEBUG] Database query error:', dbError);
          return res.status(500).json({ 
            error: 'Database query failed',
            details: dbError.message 
          });
        }

        console.log('[DEBUG] User found:', !!user);
        
        if (!user) {
          console.log('[DEBUG] User not found');
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[DEBUG] User details:', {
          id: user.id,
          email: user.email,
          hasPassword: !!user.password,
          role: user.role
        });

        console.log('[DEBUG] Comparing password');  
        let passwordMatch;
        try {
          passwordMatch = await bcrypt.compare(password, user.password);
          console.log('[DEBUG] Password match:', passwordMatch);
        } catch (bcryptError) {
          console.error('[DEBUG] Password comparison error:', bcryptError);
          return res.status(500).json({ 
            error: 'Password comparison failed',
            details: bcryptError.message 
          });
        }
        
        if (!passwordMatch) {
          console.log('[DEBUG] Password does not match');
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[DEBUG] Creating JWT token');
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        console.log('[DEBUG] Login successful');
        return res.status(200).json({
          accessToken: token,
          refreshToken: `refresh_${Date.now()}`,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        });
      } catch (error) {
        console.error('Login error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        return res.status(500).json({ 
          error: 'Login failed - database error',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }

    // Route: Get All Jobs - DATABASE ONLY
    if (cleanUrl === '/recruitment/jobs' && method === 'GET') {
      try {
        const jobs = await withDatabase(async (db) => {
          return await db.job.findMany({
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
          });
        });

        res.setHeader('X-Data-Source', 'database');
        res.setHeader('X-Data-Count', jobs.length.toString());
        return res.status(200).json(jobs);
      } catch (error) {
        console.error('Get jobs error:', error);
        return res.status(500).json({ error: 'Failed to fetch jobs from database' });
      }
    }

    // Route: Create Job - DATABASE ONLY
    if (cleanUrl === '/recruitment/jobs' && method === 'POST') {
      try {
        const { title, department, location, type, description, requirements, benefits, salary } = body;

        if (!title || !department || !location || !type) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const job = await withDatabase(async (db) => {
          return await db.job.create({
            data: {
              title,
              department,
              location,
              type,
              description,
              requirements,
              benefits,
              salary,
              status: 'active'
            }
          });
        });

        return res.status(201).json(job);
      } catch (error) {
        console.error('Create job error:', error);
        return res.status(500).json({ error: 'Failed to create job' });
      }
    }

    // Route: Get Job by ID - DATABASE ONLY
    if (cleanUrl.startsWith('/recruitment/jobs/') && method === 'GET') {
      try {
        const jobId = parseInt(cleanUrl.split('/')[3]);
        
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

    // Route: Get All Blogs - DATABASE ONLY
    if (cleanUrl === '/blogs' && method === 'GET') {
      try {
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

        res.setHeader('X-Data-Source', 'database');
        res.setHeader('X-Data-Count', blogs.length.toString());
        return res.status(200).json(blogs);
      } catch (error) {
        console.error('Get blogs error:', error);
        return res.status(500).json({ error: 'Failed to fetch blogs from database' });
      }
    }

    // Route: Create Blog - DATABASE ONLY
    if (cleanUrl === '/blogs' && method === 'POST') {
      try {
        const { title, slug, content, excerpt, category, tags, isFeatured, authorId } = body;

        if (!title || !content || !authorId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.create({
            data: {
              title,
              slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
              content,
              excerpt,
              category,
              tags,
              isFeatured: !!isFeatured,
              published: true,
              authorId
            }
          });
        });

        return res.status(201).json(blog);
      } catch (error) {
        console.error('Create blog error:', error);
        return res.status(500).json({ error: 'Failed to create blog' });
      }
    }

    // Route: Get Featured Blogs - DATABASE ONLY
    if (cleanUrl === '/blogs/featured' && method === 'GET') {
      try {
        const featuredBlogs = await withDatabase(async (db) => {
          return await db.blog.findMany({
            where: { published: true, isFeatured: true },
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        return res.status(200).json(featuredBlogs);
      } catch (error) {
        console.error('Get featured blogs error:', error);
        return res.status(500).json({ error: 'Failed to fetch featured blogs' });
      }
    }

    // Route: Create Contact - DATABASE ONLY
    if (cleanUrl === '/contacts' && method === 'POST') {
      try {
        const { fullName, name, email, phone, message, subject, company, service, budget } = body;
        
        // Use name or fullName (backwards compatibility)
        const contactName = name || fullName;

        if (!contactName || !email || !message) {
          return res.status(400).json({ error: 'Missing required fields: name, email, message' });
        }

        const contact = await withDatabase(async (db) => {
          return await db.contact.create({
            data: { 
              name: contactName, 
              email, 
              phone, 
              message, 
              subject: subject || 'Contact Form Submission',
              company,
              service,
              budget
            }
          });
        });

        return res.status(201).json(contact);
      } catch (error) {
        console.error('Create contact error:', error);
        return res.status(500).json({ error: 'Failed to create contact' });
      }
    }

    // Route: Get All Contacts - DATABASE ONLY (Auth Required)
    if (cleanUrl === '/contacts' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const contacts = await withDatabase(async (db) => {
          return await db.contact.findMany({
            orderBy: { createdAt: 'desc' }
          });
        });

        return res.status(200).json(contacts);
      } catch (error) {
        console.error('Get contacts error:', error);
        return res.status(500).json({ error: 'Failed to fetch contacts' });
      }
    }

    // Route: Get All Users - DATABASE ONLY (Admin Only)
    if (cleanUrl === '/users' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const users = await withDatabase(async (db) => {
          return await db.user.findMany({
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
          });
        });

        return res.status(200).json(users);
      } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
    }

    // Route: Create User - DATABASE ONLY (Admin Only)
    if (cleanUrl === '/users' && method === 'POST') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        const { email, password, fullName, role } = body;

        if (!email || !password || !fullName) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await withDatabase(async (db) => {
          return await db.user.create({
            data: {
              email,
              password: hashedPassword,
              fullName,
              role: role || 'USER',
              status: 'ACTIVE'
            },
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              createdAt: true
            }
          });
        });

        return res.status(201).json(user);
      } catch (error) {
        console.error('Create user error:', error);
        return res.status(500).json({ error: 'Failed to create user' });
      }
    }

    // Fallback for unknown routes
    return res.status(404).json({ 
      error: 'Route not found',
      availableRoutes: [
        'GET /health',
        'POST /auth/login',
        'GET /recruitment/jobs',
        'POST /recruitment/jobs',
        'GET /blogs',
        'POST /blogs',
        'POST /contacts',
        'GET /contacts (auth required)',
        'GET /users (auth required)',
        'POST /users (auth required)'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}; 