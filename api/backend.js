const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPrismaClient, withDatabase } = require('./prisma-singleton');

let dbConnectionStatus = 'disconnected';

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Middleware to verify JWT token
function verifyToken(token) {
  if (!token) {
    return { valid: false, error: 'Access token required' };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
}

// Check if user has required role
function hasRole(user, roles) {
  return user && roles.includes(user.role);
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
    } else {
      // Allow all origins in production for debugging (remove this later)
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');

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

    // Route: Refresh Token - DATABASE ONLY
    if (cleanUrl === '/auth/refresh' && method === 'POST') {
      try {
        const { refreshToken } = body;
        
        if (!refreshToken) {
          return res.status(400).json({ error: 'Refresh token required' });
        }

        // For now, just verify the existing token and issue a new one
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        // Create new token
        const newToken = jwt.sign(
          { id: auth.user.id, email: auth.user.email, role: auth.user.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          accessToken: newToken,
          refreshToken: `refresh_${Date.now()}`
        });
      } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(500).json({ error: 'Token refresh failed' });
      }
    }

    // Route: Get User Profile - DATABASE ONLY (Auth Required)
    if (cleanUrl === '/users/profile' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const user = await withDatabase(async (db) => {
          return await db.user.findUnique({
            where: { id: auth.user.id },
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              createdAt: true,
              lastLogin: true
            }
          });
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
      } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }
    }

    // Route: Update User Profile - DATABASE ONLY (Auth Required)
    if (cleanUrl === '/users/profile' && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const { fullName, email, currentPassword, newPassword } = body;
        
        let updateData = {};
        
        if (fullName) updateData.fullName = fullName;
        
        if (email) {
          if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
          }
          updateData.email = email;
        }
        
        // Handle password change
        if (newPassword) {
          if (!currentPassword) {
            return res.status(400).json({ error: 'Current password required to change password' });
          }
          
          if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
          }
          
          // Verify current password
          const user = await withDatabase(async (db) => {
            return await db.user.findUnique({ where: { id: auth.user.id } });
          });
          
          const passwordMatch = await bcrypt.compare(currentPassword, user.password);
          if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
          }
          
          updateData.password = await bcrypt.hash(newPassword, 12);
        }

        const updatedUser = await withDatabase(async (db) => {
          return await db.user.update({
            where: { id: auth.user.id },
            data: updateData,
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              updatedAt: true
            }
          });
        });

        return res.status(200).json(updatedUser);
      } catch (error) {
        console.error('Update profile error:', error);
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to update profile' });
      }
    }

    // Route: Get Recruitment Stats - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl === '/recruitment/stats' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const stats = await withDatabase(async (db) => {
          const [
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            totalUsers,
            totalContacts
          ] = await Promise.all([
            db.job.count(),
            db.job.count({ where: { status: 'active' } }),
            db.application.count(),
            db.application.count({ where: { status: 'pending' } }),
            db.user.count(),
            db.contact.count()
          ]);

          // Get recent applications
          const recentApplications = await db.application.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              job: {
                select: { title: true }
              }
            }
          });

          // Get job applications by status
          const applicationsByStatus = await db.application.groupBy({
            by: ['status'],
            _count: { status: true }
          });

          return {
            overview: {
              totalJobs,
              activeJobs,
              totalApplications,
              pendingApplications,
              totalUsers,
              totalContacts
            },
            recentApplications,
            applicationsByStatus: applicationsByStatus.reduce((acc, item) => {
              acc[item.status] = item._count.status;
              return acc;
            }, {})
          };
        });

        return res.status(200).json(stats);
      } catch (error) {
        console.error('Get recruitment stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch recruitment stats' });
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
        
        if (isNaN(jobId)) {
          return res.status(400).json({ error: 'Invalid job ID' });
        }
        
        const job = await withDatabase(async (db) => {
          return await db.job.findUnique({
            where: { id: jobId },
            include: {
              applications: {
                select: { id: true, fullName: true, email: true, status: true, createdAt: true }
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

    // Route: Update Job by ID - DATABASE ONLY (Auth Required)
    if (cleanUrl.startsWith('/recruitment/jobs/') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const jobId = parseInt(cleanUrl.split('/')[3]);
        
        if (isNaN(jobId)) {
          return res.status(400).json({ error: 'Invalid job ID' });
        }

        const { title, department, location, type, description, requirements, benefits, salary, status } = body;

        const job = await withDatabase(async (db) => {
          return await db.job.update({
            where: { id: jobId },
            data: {
              ...(title && { title }),
              ...(department && { department }),
              ...(location && { location }),
              ...(type && { type }),
              ...(description && { description }),
              ...(requirements && { requirements }),
              ...(benefits && { benefits }),
              ...(salary && { salary }),
              ...(status && { status })
            }
          });
        });

        return res.status(200).json(job);
      } catch (error) {
        console.error('Update job error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Job not found' });
        }
        return res.status(500).json({ error: 'Failed to update job' });
      }
    }

    // Route: Delete Job by ID - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/recruitment/jobs/') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const jobId = parseInt(cleanUrl.split('/')[3]);
        
        if (isNaN(jobId)) {
          return res.status(400).json({ error: 'Invalid job ID' });
        }

        await withDatabase(async (db) => {
          return await db.job.delete({
            where: { id: jobId }
          });
        });

        return res.status(200).json({ message: 'Job deleted successfully' });
      } catch (error) {
        console.error('Delete job error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Job not found' });
        }
        return res.status(500).json({ error: 'Failed to delete job' });
      }
    }

    // Route: Get All Blogs - DATABASE ONLY
    if (cleanUrl === '/blogs' && method === 'GET') {
      try {
        console.log('[DEBUG] Fetching blogs...');
        const blogs = await withDatabase(async (db) => {
          console.log('[DEBUG] Executing blog query...');
          const result = await db.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
          console.log('[DEBUG] Blog query result:', result.length, 'blogs found');
          return result;
        });

        res.setHeader('X-Data-Source', 'database');
        res.setHeader('X-Data-Count', blogs.length.toString());
        return res.status(200).json(blogs);
      } catch (error) {
        console.error('Get blogs error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        return res.status(500).json({ 
          error: 'Failed to fetch blogs from database',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }

    // Route: Create Blog - DATABASE ONLY (Auth Required)
    if (cleanUrl === '/blogs' && method === 'POST') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const { title, slug, content, excerpt, category, tags, isFeatured } = body;

        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.create({
            data: {
              title,
              slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              content,
              excerpt,
              category: category || 'General',
              tags: tags || [],
              isFeatured: !!isFeatured,
              published: true,
              authorId: auth.user.id
            }
          });
        });

        return res.status(201).json(blog);
      } catch (error) {
        console.error('Create blog error:', error);
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Blog slug already exists' });
        }
        return res.status(500).json({ error: 'Failed to create blog' });
      }
    }

    // Route: Get Blog by ID/Slug - DATABASE ONLY
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'GET') {
      try {
        const identifier = cleanUrl.split('/')[2];
        
        const blog = await withDatabase(async (db) => {
          // Try to find by ID first, then by slug
          let where = {};
          if (!isNaN(identifier)) {
            where = { id: identifier };
          } else {
            where = { slug: identifier };
          }

          return await db.blog.findUnique({
            where,
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

        // Increment view count
        await withDatabase(async (db) => {
          await db.blog.update({
            where: { id: blog.id },
            data: { views: { increment: 1 } }
          });
        });

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Get blog error:', error);
        return res.status(500).json({ error: 'Failed to fetch blog' });
      }
    }

    // Route: Update Blog - DATABASE ONLY (Auth Required)
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const blogId = cleanUrl.split('/')[2];
        const { title, slug, content, excerpt, category, tags, isFeatured, published } = body;

        const blog = await withDatabase(async (db) => {
          // Check if user owns the blog or is admin
          const existingBlog = await db.blog.findUnique({
            where: { id: blogId }
          });

          if (!existingBlog) {
            throw new Error('Blog not found');
          }

          if (existingBlog.authorId !== auth.user.id && !hasRole(auth.user, ['ADMIN'])) {
            throw new Error('Unauthorized');
          }

          return await db.blog.update({
            where: { id: blogId },
            data: {
              ...(title && { title }),
              ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }),
              ...(content && { content }),
              ...(excerpt && { excerpt }),
              ...(category && { category }),
              ...(tags && { tags }),
              ...(typeof isFeatured === 'boolean' && { isFeatured }),
              ...(typeof published === 'boolean' && { published })
            }
          });
        });

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Update blog error:', error);
        if (error.message === 'Blog not found') {
          return res.status(404).json({ error: 'Blog not found' });
        }
        if (error.message === 'Unauthorized') {
          return res.status(403).json({ error: 'You can only edit your own blogs' });
        }
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Blog slug already exists' });
        }
        return res.status(500).json({ error: 'Failed to update blog' });
      }
    }

    // Route: Delete Blog - DATABASE ONLY (Auth Required)
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const blogId = cleanUrl.split('/')[2];

        await withDatabase(async (db) => {
          // Check if user owns the blog or is admin
          const existingBlog = await db.blog.findUnique({
            where: { id: blogId }
          });

          if (!existingBlog) {
            throw new Error('Blog not found');
          }

          if (existingBlog.authorId !== auth.user.id && !hasRole(auth.user, ['ADMIN'])) {
            throw new Error('Unauthorized');
          }

          await db.blog.delete({
            where: { id: blogId }
          });
        });

        return res.status(200).json({ message: 'Blog deleted successfully' });
      } catch (error) {
        console.error('Delete blog error:', error);
        if (error.message === 'Blog not found') {
          return res.status(404).json({ error: 'Blog not found' });
        }
        if (error.message === 'Unauthorized') {
          return res.status(403).json({ error: 'You can only delete your own blogs' });
        }
        return res.status(500).json({ error: 'Failed to delete blog' });
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
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
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

    // Route: Update Contact Status - DATABASE ONLY (Auth Required)
    if (cleanUrl.startsWith('/contacts/') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const contactId = cleanUrl.split('/')[2];
        const { status, priority } = body;

        const contact = await withDatabase(async (db) => {
          return await db.contact.update({
            where: { id: contactId },
            data: {
              ...(status && { status }),
              ...(priority && { priority })
            }
          });
        });

        return res.status(200).json(contact);
      } catch (error) {
        console.error('Update contact error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Contact not found' });
        }
        return res.status(500).json({ error: 'Failed to update contact' });
      }
    }

    // Route: Delete Contact - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/contacts/') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const contactId = cleanUrl.split('/')[2];

        await withDatabase(async (db) => {
          await db.contact.delete({
            where: { id: contactId }
          });
        });

        return res.status(200).json({ message: 'Contact deleted successfully' });
      } catch (error) {
        console.error('Delete contact error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Contact not found' });
        }
        return res.status(500).json({ error: 'Failed to delete contact' });
      }
    }

    // Route: Submit Job Application - DATABASE ONLY
    if (cleanUrl === '/applications' && method === 'POST') {
      try {
        const { jobId, fullName, email, phone, coverLetter, cvFile } = body;

        if (!jobId || !fullName || !email) {
          return res.status(400).json({ error: 'Job ID, full name, and email are required' });
        }

        // Check if job exists and is active
        const job = await withDatabase(async (db) => {
          return await db.job.findUnique({
            where: { id: parseInt(jobId) }
          });
        });

        if (!job || job.status !== 'active') {
          return res.status(404).json({ error: 'Job not found or not active' });
        }

        const application = await withDatabase(async (db) => {
          return await db.application.create({
            data: {
              jobId: parseInt(jobId),
              fullName,
              email,
              phone,
              coverLetter,
              cvFile,
              status: 'pending'
            }
          });
        });

        return res.status(201).json(application);
      } catch (error) {
        console.error('Create application error:', error);
        return res.status(500).json({ error: 'Failed to submit application' });
      }
    }

    // Route: Get All Applications - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl === '/applications' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const applications = await withDatabase(async (db) => {
          return await db.application.findMany({
            include: {
              job: {
                select: { title: true, department: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          });
        });

        return res.status(200).json(applications);
      } catch (error) {
        console.error('Get applications error:', error);
        return res.status(500).json({ error: 'Failed to fetch applications' });
      }
    }

    // Route: Update Application Status - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/applications/') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[2]);
        const { status } = body;

        if (!status || !['pending', 'reviewed', 'interviewed', 'accepted', 'rejected'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }

        const application = await withDatabase(async (db) => {
          return await db.application.update({
            where: { id: applicationId },
            data: { status }
          });
        });

        return res.status(200).json(application);
      } catch (error) {
        console.error('Update application error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Application not found' });
        }
        return res.status(500).json({ error: 'Failed to update application' });
      }
    }

    // Route: Delete Application - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/applications/') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[2]);

        await withDatabase(async (db) => {
          await db.application.delete({
            where: { id: applicationId }
          });
        });

        return res.status(200).json({ message: 'Application deleted successfully' });
      } catch (error) {
        console.error('Delete application error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Application not found' });
        }
        return res.status(500).json({ error: 'Failed to delete application' });
      }
    }

    // Route: Get All Users - DATABASE ONLY (Admin Only)
    if (cleanUrl === '/users' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
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
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const { email, password, fullName, role } = body;

        if (!email || !password || !fullName) {
          return res.status(400).json({ error: 'Email, password, and full name are required' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters long' });
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
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to create user' });
      }
    }

    // Route: Update User - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/users/') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const userId = cleanUrl.split('/')[2];
        const { email, fullName, role, status, password } = body;

        let updateData = {};
        
        if (email) {
          if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
          }
          updateData.email = email;
        }
        
        if (fullName) updateData.fullName = fullName;
        if (role) updateData.role = role;
        if (status) updateData.status = status;
        
        if (password) {
          if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
          }
          updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await withDatabase(async (db) => {
          return await db.user.update({
            where: { id: userId },
            data: updateData,
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              updatedAt: true
            }
          });
        });

        return res.status(200).json(user);
      } catch (error) {
        console.error('Update user error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to update user' });
      }
    }

    // Route: Delete User - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/users/') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const userId = cleanUrl.split('/')[2];

        // Prevent admin from deleting themselves
        if (userId === auth.user.id) {
          return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await withDatabase(async (db) => {
          await db.user.delete({
            where: { id: userId }
          });
        });

        return res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Delete user error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Failed to delete user' });
      }
    }

    // Fallback for unknown routes
    return res.status(404).json({ 
      error: 'Route not found',
      message: `No endpoint found for ${method} ${cleanUrl}`,
      availableRoutes: {
        auth: [
          'POST /auth/login',
          'POST /auth/refresh'
        ],
        profile: [
          'GET /users/profile (Auth)',
          'PUT /users/profile (Auth)'
        ],
        recruitment: [
          'GET /recruitment/stats (HR/Admin)',
          'GET /recruitment/jobs',
          'POST /recruitment/jobs (HR/Admin)',
          'GET /recruitment/jobs/{id}',
          'PUT /recruitment/jobs/{id} (HR/Admin)',
          'DELETE /recruitment/jobs/{id} (Admin)'
        ],
        applications: [
          'POST /applications',
          'GET /applications (HR/Admin)',
          'PUT /applications/{id} (HR/Admin)',
          'DELETE /applications/{id} (Admin)'
        ],
        blogs: [
          'GET /blogs',
          'POST /blogs (Auth)',
          'GET /blogs/featured',
          'GET /blogs/{id-or-slug}',
          'PUT /blogs/{id} (Owner/Admin)',
          'DELETE /blogs/{id} (Owner/Admin)'
        ],
        contacts: [
          'POST /contacts',
          'GET /contacts (HR/Admin)',
          'PUT /contacts/{id} (HR/Admin)',
          'DELETE /contacts/{id} (Admin)'
        ],
        users: [
          'GET /users (Admin)',
          'POST /users (Admin)',
          'PUT /users/{id} (Admin)',
          'DELETE /users/{id} (Admin)'
        ],
        health: [
          'GET /',
          'GET /health'
        ]
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}; 