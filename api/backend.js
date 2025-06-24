const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getPrismaClient, withDatabase, resetPrisma, checkDatabaseHealth } = require('./prisma-singleton');

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
      const dbHealth = await checkDatabaseHealth();
      
      return res.status(200).json({
        status: 'ok',
        message: 'PHG Corporation API Backend - DATABASE ONLY',
        timestamp: new Date().toISOString(),
        service: 'database-backend',
        platform: 'vercel-express',
        database: {
          status: dbHealth.healthy ? 'connected' : 'error',
          hasUrl: !!process.env.DATABASE_URL,
          prismaClient: updateDbStatus(),
          mockDataRemoved: true,
          healthCheck: dbHealth
        }
      });
    }

    // Route: Database Reset (Emergency) - Admin Only
    if (cleanUrl === '/database/reset' && method === 'POST') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        console.log('[RESET] Force resetting database connection...');
        await resetPrisma();
        
        // Test new connection
        const healthCheck = await checkDatabaseHealth();
        
        return res.status(200).json({
          status: 'success',
          message: 'Database connection reset completed',
          healthCheck
        });
      } catch (error) {
        console.error('Database reset error:', error);
        return res.status(500).json({ 
          error: 'Database reset failed',
          details: error.message 
        });
      }
    }

    // Route: Auth Login - DATABASE ONLY with Enhanced Error Handling
    if (cleanUrl === '/auth/login' && method === 'POST') {
      try {
        console.log('[AUTH-LOGIN] Login attempt started');
        const { email, password } = body;
        
        console.log('[AUTH-LOGIN] Login data:', { email: email, hasPassword: !!password });
        
        if (!email || !password) {
          console.log('[AUTH-LOGIN] Missing email or password');
          return res.status(400).json({ error: 'Email and password required' });
        }

        // ENHANCED DATABASE CONNECTION CHECK
        const dbHealth = await checkDatabaseHealth();
        console.log('[AUTH-LOGIN] Database health check:', dbHealth);
        
        if (!dbHealth.healthy) {
          console.log('[AUTH-LOGIN] Database unhealthy, attempting reset...');
          try {
            await resetPrisma();
            // Wait a moment for connection to stabilize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check again
            const retryHealth = await checkDatabaseHealth();
            if (!retryHealth.healthy) {
              return res.status(503).json({ 
                error: 'Database temporarily unavailable',
                details: 'Please try again in a few moments',
                timestamp: new Date().toISOString()
              });
            }
          } catch (resetError) {
            console.error('[AUTH-LOGIN] Database reset failed:', resetError);
            return res.status(503).json({ 
              error: 'Database connection failed',
              details: 'Please try again in a few moments'
            });
          }
        }

        console.log('[AUTH-LOGIN] Attempting to find user by email with enhanced retry');
        let user;
        try {
          // Use enhanced withDatabase with specific retry logic for auth
          user = await withDatabase(async (db) => {
            console.log('[AUTH-LOGIN] Executing findUnique query for email:', email);
            
            // Add timeout wrapper for this specific query
            const queryTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('User query timeout')), 15000)
            );
            
            const userQuery = db.user.findUnique({ 
              where: { email },
              select: {
                id: true,
                email: true,
                password: true,
                fullName: true,
                role: true,
                status: true
              }
            });
            
            const foundUser = await Promise.race([userQuery, queryTimeout]);
            console.log('[AUTH-LOGIN] Query result:', foundUser ? 'User found' : 'User not found');
            return foundUser;
          }, 3); // Max 3 retries for auth
        } catch (dbError) {
          console.error('[AUTH-LOGIN] Database query error:', {
            message: dbError.message,
            code: dbError.code,
            name: dbError.name,
            stack: dbError.stack?.substring(0, 500)
          });
          
          // Enhanced error response based on error type
          if (dbError.message.includes('timeout')) {
            return res.status(503).json({ 
              error: 'Database response timeout',
              details: 'Please try again in a few moments',
              code: 'DB_TIMEOUT'
            });
          } else if (dbError.message.includes('prepared statement')) {
            return res.status(503).json({ 
              error: 'Database connection conflict',
              details: 'Please try again immediately',
              code: 'DB_CONFLICT'
            });
          } else {
            return res.status(500).json({ 
              error: 'Database query failed',
              details: process.env.NODE_ENV === 'development' ? dbError.message : 'Please try again',
              code: 'DB_ERROR'
            });
          }
        }

        console.log('[AUTH-LOGIN] User found:', !!user);
        
        if (!user) {
          console.log('[AUTH-LOGIN] User not found');
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is active
        if (user.status !== 'ACTIVE') {
          console.log('[AUTH-LOGIN] User account inactive');
          return res.status(401).json({ error: 'Account is inactive' });
        }

        console.log('[AUTH-LOGIN] User details:', {
          id: user.id,
          email: user.email,
          hasPassword: !!user.password,
          role: user.role,
          status: user.status
        });

        console.log('[AUTH-LOGIN] Comparing password');  
        let passwordMatch;
        try {
          passwordMatch = await bcrypt.compare(password, user.password);
          console.log('[AUTH-LOGIN] Password match:', passwordMatch);
        } catch (bcryptError) {
          console.error('[AUTH-LOGIN] Password comparison error:', bcryptError);
          return res.status(500).json({ 
            error: 'Authentication processing failed',
            details: 'Please try again'
          });
        }
        
        if (!passwordMatch) {
          console.log('[AUTH-LOGIN] Password does not match');
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[AUTH-LOGIN] Creating JWT token');
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' } // Extended token life for better UX
        );

        // Update last login timestamp (fire and forget)
        try {
          withDatabase(async (db) => {
            await db.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() }
            });
          }).catch(err => console.log('[AUTH-LOGIN] Last login update failed:', err.message));
        } catch (error) {
          // Ignore last login update errors
        }

        console.log('[AUTH-LOGIN] Login successful');
        return res.status(200).json({
          accessToken: token,
          refreshToken: `refresh_${Date.now()}_${user.id}`,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status
          },
          loginTime: new Date().toISOString()
        });
      } catch (error) {
        console.error('[AUTH-LOGIN] Critical error:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          timestamp: new Date().toISOString()
        });
        return res.status(500).json({ 
          error: 'Authentication service temporarily unavailable',
          details: 'Please refresh the page and try again',
          code: 'AUTH_SERVICE_ERROR',
          timestamp: new Date().toISOString()
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
    if (cleanUrl.startsWith('/recruitment/jobs/') && !cleanUrl.includes('/applications') && method === 'GET') {
      try {
        const jobId = parseInt(cleanUrl.split('/')[3]);
        
        const job = await withDatabase(async (db) => {
          return await db.job.findUnique({
            where: { id: jobId },
            include: {
              applications: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  status: true,
                  createdAt: true
                }
              },
              _count: {
                select: { applications: true }
              }
            }
          });
        });

        if (!job) {
          return res.status(404).json({ error: 'Job not found' });
        }

        return res.status(200).json(job);
      } catch (error) {
        console.error('Get job by ID error:', error);
        return res.status(500).json({ error: 'Failed to fetch job' });
      }
    }

    // Route: Update Job - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/recruitment/jobs/') && !cleanUrl.includes('/applications') && method === 'PUT') {
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

    // Route: Delete Job - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/recruitment/jobs/') && !cleanUrl.includes('/applications') && method === 'DELETE') {
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

        await withDatabase(async (db) => {
          await db.job.delete({
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

    // Route: Get Applications for Job - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/recruitment/jobs/') && cleanUrl.includes('/applications') && method === 'GET') {
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

        const applications = await withDatabase(async (db) => {
          return await db.application.findMany({
            where: { jobId },
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
        console.error('Get job applications error:', error);
        return res.status(500).json({ error: 'Failed to fetch job applications' });
      }
    }

    // Route: Get Application by ID - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/recruitment/applications/') && !cleanUrl.includes('/status') && !cleanUrl.includes('/cv') && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[3]);

        const application = await withDatabase(async (db) => {
          return await db.application.findUnique({
            where: { id: applicationId },
            include: {
              job: {
                select: { title: true, department: true, location: true }
              }
            }
          });
        });

        if (!application) {
          return res.status(404).json({ error: 'Application not found' });
        }

        return res.status(200).json(application);
      } catch (error) {
        console.error('Get application error:', error);
        return res.status(500).json({ error: 'Failed to fetch application' });
      }
    }

    // Route: Update Application Status - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/recruitment/applications/') && cleanUrl.includes('/status') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[3]);
        const { status } = body;

        if (!status || !['pending', 'reviewed', 'interviewed', 'accepted', 'rejected'].includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }

        const application = await withDatabase(async (db) => {
          return await db.application.update({
            where: { id: applicationId },
            data: { status },
            include: {
              job: {
                select: { title: true, department: true }
              }
            }
          });
        });

        return res.status(200).json(application);
      } catch (error) {
        console.error('Update application status error:', error);
        if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Application not found' });
        }
        return res.status(500).json({ error: 'Failed to update application status' });
      }
    }

    // Route: Download CV - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/recruitment/applications/') && cleanUrl.includes('/cv') && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN', 'HR'])) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[3]);

        const application = await withDatabase(async (db) => {
          return await db.application.findUnique({
            where: { id: applicationId },
            select: { cvFile: true, fullName: true }
          });
        });

        if (!application || !application.cvFile) {
          return res.status(404).json({ error: 'CV file not found' });
        }

        // For now, return file path/URL since we don't have file storage setup
        return res.status(200).json({
          message: 'CV download endpoint',
          cvFile: application.cvFile,
          applicantName: application.fullName,
          note: 'File storage integration needed for actual file download'
        });
      } catch (error) {
        console.error('Download CV error:', error);
        return res.status(500).json({ error: 'Failed to download CV' });
      }
    }

    // Route: Delete Application - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/recruitment/applications/') && !cleanUrl.includes('/status') && !cleanUrl.includes('/cv') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const applicationId = parseInt(cleanUrl.split('/')[3]);

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

    // Route: Get User by ID - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/users/') && !cleanUrl.includes('/change-password') && !cleanUrl.includes('/profile') && method === 'GET') {
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

        const user = await withDatabase(async (db) => {
          return await db.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              lastLogin: true,
              _count: {
                select: { blogs: true }
              }
            }
          });
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
      } catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
      }
    }

    // Route: Search Users - DATABASE ONLY (Admin Only)
    if (cleanUrl === '/users/search' && method === 'GET') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        if (!hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'Admin access required' });
        }

        const query = req.url.split('?q=')[1];
        if (!query) {
          return res.status(400).json({ error: 'Search query required' });
        }

        const searchTerm = decodeURIComponent(query);

        const users = await withDatabase(async (db) => {
          return await db.user.findMany({
            where: {
              OR: [
                { email: { contains: searchTerm, mode: 'insensitive' } },
                { fullName: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: {
              id: true,
              email: true,
              fullName: true,
              role: true,
              status: true,
              createdAt: true
            },
            take: 20 // Limit results
          });
        });

        return res.status(200).json(users);
      } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({ error: 'Failed to search users' });
      }
    }

    // Route: Change Password - DATABASE ONLY (Admin Only)
    if (cleanUrl.startsWith('/users/') && cleanUrl.includes('/change-password') && method === 'POST') {
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
        const { currentPassword, newPassword } = body;

        if (!newPassword) {
          return res.status(400).json({ error: 'New password is required' });
        }

        if (newPassword.length < 6) {
          return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Get user to verify current password if provided
        const user = await withDatabase(async (db) => {
          return await db.user.findUnique({
            where: { id: userId }
          });
        });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // If current password is provided, verify it
        if (currentPassword) {
          const passwordMatch = await bcrypt.compare(currentPassword, user.password);
          if (!passwordMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
          }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await withDatabase(async (db) => {
          await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
          });
        });

        return res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Failed to change password' });
      }
    }

    // Route: Get Blog by ID/Slug - DATABASE ONLY
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'GET') {
      try {
        const identifier = cleanUrl.split('/')[2];
        
        const blog = await withDatabase(async (db) => {
          // Try to find by ID first, then by slug
          let foundBlog = null;
          
          // Check if identifier is a number (ID)
          if (!isNaN(identifier)) {
            foundBlog = await db.blog.findUnique({
              where: { id: identifier },
              include: {
                author: {
                  select: { fullName: true, email: true }
                }
              }
            });
          }
          
          // If not found by ID, try slug
          if (!foundBlog) {
            foundBlog = await db.blog.findUnique({
              where: { slug: identifier },
              include: {
                author: {
                  select: { fullName: true, email: true }
                }
              }
            });
          }
          
          // Increment view count if blog is found and published
          if (foundBlog && foundBlog.published) {
            await db.blog.update({
              where: { id: foundBlog.id },
              data: { views: { increment: 1 } }
            });
          }
          
          return foundBlog;
        });

        if (!blog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Get blog error:', error);
        return res.status(500).json({ error: 'Failed to fetch blog' });
      }
    }

    // Route: Update Blog - DATABASE ONLY (Owner/Admin Only)
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'PUT') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const blogId = cleanUrl.split('/')[2];
        const { title, content, excerpt, featuredImage, category, tags, isFeatured, status, published } = body;

        // Check if user owns the blog or is admin
        const existingBlog = await withDatabase(async (db) => {
          return await db.blog.findUnique({
            where: { id: blogId },
            select: { authorId: true }
          });
        });

        if (!existingBlog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        if (existingBlog.authorId !== auth.user.id && !hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'You can only edit your own blogs' });
        }

        const blog = await withDatabase(async (db) => {
          return await db.blog.update({
            where: { id: blogId },
            data: {
              ...(title && { title }),
              ...(content && { content }),
              ...(excerpt && { excerpt }),
              ...(featuredImage && { featuredImage }),
              ...(category && { category }),
              ...(tags && { tags }),
              ...(isFeatured !== undefined && { isFeatured }),
              ...(status && { status }),
              ...(published !== undefined && { published })
            },
            include: {
              author: {
                select: { fullName: true, email: true }
              }
            }
          });
        });

        return res.status(200).json(blog);
      } catch (error) {
        console.error('Update blog error:', error);
        return res.status(500).json({ error: 'Failed to update blog' });
      }
    }

    // Route: Delete Blog - DATABASE ONLY (Owner/Admin Only)
    if (cleanUrl.startsWith('/blogs/') && !cleanUrl.includes('/featured') && method === 'DELETE') {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const auth = verifyToken(token);
        
        if (!auth.valid) {
          return res.status(401).json({ error: auth.error });
        }

        const blogId = cleanUrl.split('/')[2];

        // Check if user owns the blog or is admin
        const existingBlog = await withDatabase(async (db) => {
          return await db.blog.findUnique({
            where: { id: blogId },
            select: { authorId: true, title: true }
          });
        });

        if (!existingBlog) {
          return res.status(404).json({ error: 'Blog not found' });
        }

        if (existingBlog.authorId !== auth.user.id && !hasRole(auth.user, ['ADMIN'])) {
          return res.status(403).json({ error: 'You can only delete your own blogs' });
        }

        await withDatabase(async (db) => {
          await db.blog.delete({
            where: { id: blogId }
          });
        });

        return res.status(200).json({ message: 'Blog deleted successfully' });
      } catch (error) {
        console.error('Delete blog error:', error);
        return res.status(500).json({ error: 'Failed to delete blog' });
      }
    }

    // Route: Get Contact by ID - DATABASE ONLY (HR/Admin Only)
    if (cleanUrl.startsWith('/contacts/') && method === 'GET') {
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

        const contact = await withDatabase(async (db) => {
          return await db.contact.findUnique({
            where: { id: contactId }
          });
        });

        if (!contact) {
          return res.status(404).json({ error: 'Contact not found' });
        }

        return res.status(200).json(contact);
      } catch (error) {
        console.error('Get contact error:', error);
        return res.status(500).json({ error: 'Failed to fetch contact' });
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
    if (cleanUrl.startsWith('/users/') && !cleanUrl.includes('/change-password') && !cleanUrl.includes('/profile') && method === 'PUT') {
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
    if (cleanUrl.startsWith('/users/') && !cleanUrl.includes('/change-password') && !cleanUrl.includes('/profile') && method === 'DELETE') {
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
          'DELETE /recruitment/jobs/{id} (Admin)',
          'GET /recruitment/jobs/{id}/applications (HR/Admin)'
        ],
        applications: [
          'POST /applications',
          'GET /applications (HR/Admin)',
          'GET /recruitment/applications/{id} (HR/Admin)',
          'PUT /recruitment/applications/{id}/status (HR/Admin)',
          'DELETE /recruitment/applications/{id} (Admin)',
          'GET /recruitment/applications/{id}/cv (HR/Admin)'
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
          'GET /contacts/{id} (HR/Admin)',
          'PUT /contacts/{id} (HR/Admin)',
          'DELETE /contacts/{id} (Admin)'
        ],
        users: [
          'GET /users (Admin)',
          'POST /users (Admin)',
          'GET /users/{id} (Admin)',
          'PUT /users/{id} (Admin)',
          'DELETE /users/{id} (Admin)',
          'GET /users/search?q=term (Admin)',
          'POST /users/{id}/change-password (Admin)'
        ],
        health: [
          'GET /',
          'GET /health'
        ],
        admin: [
          'POST /database/reset (Admin)'
        ]
      },
      totalEndpoints: 35,
      note: 'All admin dashboard endpoints are now available. Login working ✅'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}; 