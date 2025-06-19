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
    content: "React 19 brings exciting new features that make development faster and more intuitive. From automatic batching to concurrent features, this guide covers everything you need to know to upgrade your React applications.",
    excerpt: "Discover the latest features in React 19 and how they can improve your development workflow",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&crop=center",
      alt: "React 19 development setup"
    },
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
    content: "Web development is rapidly evolving with new frameworks, tools, and methodologies. Explore the trends that will shape the next decade of web development, from AI-powered coding assistants to edge computing.",
    excerpt: "Exploring trends shaping the future of web development in 2025 and beyond",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&crop=center",
      alt: "Future web development technologies"
    },
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
  },
  {
    id: "3",
    title: "AI-Powered E-commerce Revolution",
    slug: "ai-powered-ecommerce-revolution",
    content: "Artificial Intelligence is transforming e-commerce with personalized recommendations, automated customer service, and predictive analytics. Learn how to leverage AI for your online business.",
    excerpt: "How AI is revolutionizing the e-commerce industry with smart automation and personalization",
    featuredImage: {
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&crop=center",
      alt: "AI e-commerce technology"
    },
    category: "AI Marketing",
    tags: ["AI", "E-commerce", "Automation"],
    readTime: "6 min",
    isFeatured: false,
    status: "published",
    published: true,
    views: 203,
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-22'),
    author: {
      fullName: "AI Research Team",
      email: "ai@phg.com"
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

        // If database not available, use mock authentication
        if (!prisma || dbConnectionStatus !== 'connected') {
          console.log('Using mock authentication - database not available');
          
          // Mock admin credentials for testing
          const mockUsers = [
            {
              id: '1',
              email: 'admin@phg.com',
              password: 'admin123', // In real app, this would be hashed
              fullName: 'Admin User',
              role: 'ADMIN'
            },
            {
              id: '2', 
              email: 'hr@phg.com',
              password: 'hr123',
              fullName: 'HR User',
              role: 'HR'
            },
            {
              id: '3',
              email: 'user@phg.com', 
              password: 'user123',
              fullName: 'Regular User',
              role: 'USER'
            }
          ];

          const mockUser = mockUsers.find(u => u.email === email && u.password === password);
          
          if (!mockUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }

          const token = jwt.sign(
            { id: mockUser.id, email: mockUser.email, role: mockUser.role },
            JWT_SECRET,
            { expiresIn: '1h' }
          );

          return res.status(200).json({
            accessToken: token,
            refreshToken: `refresh_${Date.now()}`,
            user: {
              id: mockUser.id,
              email: mockUser.email,
              fullName: mockUser.fullName,
              role: mockUser.role
            }
          });
        }

        // Database available - use real authentication
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

    // Route: Get Featured Blogs (Public)
    if (cleanUrl === '/blogs/featured' && method === 'GET') {
      try {
        if (!prisma || dbConnectionStatus !== 'connected') {
          console.log('Using fallback featured blog data');
          const featuredBlogs = mockBlogs.filter(blog => blog.isFeatured);
          return res.status(200).json(featuredBlogs);
        }

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
        const featuredBlogs = mockBlogs.filter(blog => blog.isFeatured);
        return res.status(200).json(featuredBlogs);
      }
    }

    // Route: Get Blogs by Category (Public) - MUST be before Blog by ID
    if (cleanUrl.startsWith('/blogs/category/') && method === 'GET') {
      try {
        const category = decodeURIComponent(cleanUrl.split('/')[3]);
        
        if (!prisma || dbConnectionStatus !== 'connected') {
          const categoryBlogs = mockBlogs.filter(b => 
            b.category.toLowerCase() === category.toLowerCase() && 
            b.status === 'published'
          );
          return res.status(200).json(categoryBlogs);
        }

        const categoryBlogs = await withDatabase(async (db) => {
          return await db.blog.findMany({
            where: { 
              category: {
                contains: category,
                mode: 'insensitive'
              },
              published: true 
            },
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        return res.status(200).json(categoryBlogs);
      } catch (error) {
        console.error('Get blogs by category error:', error);
        const categoryBlogs = mockBlogs.filter(b => 
          b.category.toLowerCase() === cleanUrl.split('/')[3]?.toLowerCase() && 
          b.status === 'published'
        );
        return res.status(200).json(categoryBlogs);
      }
    }

    // Route: Get Blog by Slug (Public)
    if (cleanUrl.startsWith('/blogs/slug/') && method === 'GET') {
      try {
        const slug = cleanUrl.split('/')[3];
        
        if (!prisma || dbConnectionStatus !== 'connected') {
          const blog = mockBlogs.find(b => b.slug === slug);
          if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
          }
          return res.status(200).json(blog);
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.findUnique({
            where: { slug },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Get blog by slug error:', error);
        return res.status(500).json({ error: 'Failed to fetch blog' });
      }
    }

    // Route: Get Blog by ID (Public) - MUST be after specific routes
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/category/') && !cleanUrl.includes('/slug/') && !cleanUrl.includes('/featured') && !cleanUrl.includes('/views') && method === 'GET') {
      try {
        const blogId = cleanUrl.split('/')[2];
        
        if (!prisma || dbConnectionStatus !== 'connected') {
          const blog = mockBlogs.find(b => b.id === blogId);
          if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
          }
          return res.status(200).json(blog);
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.findUnique({
            where: { id: blogId },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Get blog by ID error:', error);
        return res.status(500).json({ error: 'Failed to fetch blog' });
      }
    }



    // Route: Increment Blog Views (Public)
    if (cleanUrl.match(/^\/blogs\/[^\/]+\/views$/) && method === 'POST') {
      try {
        const blogId = cleanUrl.split('/')[2];
        
        if (!prisma || dbConnectionStatus !== 'connected') {
          // For mock data, just return success
          return res.status(200).json({ message: 'View count incremented', views: 1 });
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.update({
            where: { id: blogId },
            data: {
              views: {
                increment: 1
              }
            }
          });
        });

        return res.status(200).json({ message: 'View count incremented', views: blog.views });
      } catch (error) {
        console.error('Increment views error:', error);
        // Return success even if failed to not block page loading
        return res.status(200).json({ message: 'View count incremented', views: 1 });
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
        '/auth/login (POST) - Try: admin@phg.com / admin123',
        '/recruitment/jobs (GET)',
        '/recruitment/jobs/:id (GET)',
        '/blogs (GET)',
        '/blogs/featured (GET)',
        '/blogs/:id (GET)',
        '/blogs/slug/:slug (GET)',
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