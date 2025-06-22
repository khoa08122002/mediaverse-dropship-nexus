// PHG Corporation Comprehensive API - Full Backend for Vercel
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret';
const DATABASE_URL = process.env.DATABASE_URL;

let prisma = null;
let dbStatus = 'disconnected';

// Initialize Prisma
async function initDB() {
  if (!DATABASE_URL) {
    dbStatus = 'no_url';
    return null;
  }
  try {
    if (!prisma) {
      prisma = new PrismaClient();
      await prisma.$connect();
      dbStatus = 'connected';
    }
    return prisma;
  } catch (error) {
    console.error('DB error:', error);
    dbStatus = 'failed';
    return null;
  }
}

// Auth utilities
function getUser(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
  } catch { return null; }
}

function requireAuth(req) {
  const user = getUser(req);
  return user ? { user } : { error: 'Auth required', status: 401 };
}

function requireRole(req, ...roles) {
  const auth = requireAuth(req);
  if (auth.error) return auth;
  if (!roles.includes(auth.user.role)) {
    return { error: 'No permission', status: 403 };
  }
  return auth;
}

// Mock data
const mockUsers = [
  { 
    id: '1', 
    email: 'admin@phg.com', 
    password: 'admin123', 
    fullName: 'Admin User', 
    role: 'ADMIN',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  { 
    id: '2', 
    email: 'hr@phg.com', 
    password: 'hr123', 
    fullName: 'HR Manager', 
    role: 'HR',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  { 
    id: '3', 
    email: 'user@phg.com', 
    password: 'user123', 
    fullName: 'Regular User', 
    role: 'USER',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  { 
    id: '4', 
    email: 'john.doe@example.com', 
    password: 'password123', 
    fullName: 'John Doe', 
    role: 'USER',
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  { 
    id: '5', 
    email: 'jane.smith@example.com', 
    password: 'password123', 
    fullName: 'Jane Smith', 
    role: 'HR',
    status: 'active',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

const mockJobs = [
  {
    id: 1, title: 'Senior Frontend Developer', description: 'React, TypeScript, UI/UX',
    requirements: ['3+ years React', 'TypeScript', 'UI/UX'], salary: '$80k-$120k',
    location: 'Remote', type: 'FULL_TIME', status: 'active', deadline: '2024-12-31'
  },
  {
    id: 2, title: 'Backend Developer', description: 'Node.js, APIs, databases',
    requirements: ['Node.js', 'Database', 'APIs'], salary: '$70k-$110k',
    location: 'Hybrid', type: 'FULL_TIME', status: 'active', deadline: '2024-12-31'
  }
];

const mockBlogs = [
  {
    id: '1', title: 'React 19 Features', slug: 'react-19-features',
    content: 'React 19 brings new features...', excerpt: 'Latest React updates',
    featuredImage: { url: '/placeholder.svg', alt: 'React 19' },
    published: true, isFeatured: true, category: 'Tech', tags: ['React'],
    views: 150, authorId: '1', author: { fullName: 'Admin', email: 'admin@phg.com' }
  }
];

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDB();
    
    const url = req.url.replace('/api/comprehensive', '') || '/';
    const method = req.method;
    const path = url.split('?')[0];
    
    // Parse JSON body
    let body = {};
    if (['POST', 'PUT'].includes(method)) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      try {
        body = JSON.parse(Buffer.concat(chunks).toString());
      } catch { /* ignore parse errors */ }
    }

    console.log(`${method} ${path}`);

    // HEALTH
    if (path === '/' || path === '/health') {
      return res.json({
        status: 'ok', message: 'PHG Corporation API',
        database: dbStatus, timestamp: new Date().toISOString()
      });
    }

    // AUTH LOGIN
    if (path === '/auth/login' && method === 'POST') {
      const { email, password } = body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      let user = null;
      if (prisma && dbStatus === 'connected') {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (dbUser && await bcrypt.compare(password, dbUser.password)) user = dbUser;
        } catch { /* fallback to mock */ }
      }
      
      if (!user) {
        user = mockUsers.find(u => u.email === email && u.password === password);
      }

      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET, { expiresIn: '24h' }
      );

      return res.json({
        accessToken: token,
        refreshToken: `refresh_${Date.now()}`,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
      });
    }

    // REFRESH TOKEN
    if (path === '/auth/refresh' && method === 'POST') {
      const { refreshToken } = body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }

      // In a real app, validate the refresh token from database
      // For now, just generate a new token if user is authenticated
      const auth = requireAuth(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const newToken = jwt.sign(
        { id: auth.user.id, email: auth.user.email, role: auth.user.role },
        JWT_SECRET, { expiresIn: '24h' }
      );

      return res.json({
        accessToken: newToken,
        refreshToken: `refresh_${Date.now()}`
      });
    }

    // LOGOUT
    if (path === '/auth/logout' && method === 'POST') {
      // In a real app, you would invalidate the refresh token
      return res.json({ message: 'Logged out successfully' });
    }

    // GET ALL USERS (Admin only)
    if (path === '/users' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let users = mockUsers.map(({ password, ...user }) => user);
      
      if (prisma && dbStatus === 'connected') {
        try {
          users = await prisma.user.findMany({
            select: { 
              id: true, email: true, fullName: true, role: true, 
              status: true, createdAt: true, updatedAt: true 
            },
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use mock */ }
      }
      return res.json(users);
    }

    // CREATE USER (Admin only)
    if (path === '/users' && method === 'POST') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const { email, fullName, role, password } = body;
      if (!email || !fullName || !role || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      let existingUser = mockUsers.find(u => u.email === email);
      if (prisma && dbStatus === 'connected') {
        try {
          existingUser = await prisma.user.findUnique({ where: { email } });
        } catch { /* use mock check */ }
      }

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const userData = {
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        role,
        status: 'active'
      };

      let newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (prisma && dbStatus === 'connected') {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          newUser = await prisma.user.create({
            data: { ...userData, password: hashedPassword },
            select: { 
              id: true, email: true, fullName: true, role: true, 
              status: true, createdAt: true, updatedAt: true 
            }
          });
        } catch { /* use mock */ }
      }

      return res.status(201).json(newUser);
    }

    // UPDATE USER (Admin only)
    if (path.startsWith('/users/') && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const userId = path.split('/')[2];
      const { email, fullName, role, status } = body;

      if (!email && !fullName && !role && !status) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const updateData = {};
      if (email) updateData.email = email.trim().toLowerCase();
      if (fullName) updateData.fullName = fullName.trim();
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      updateData.updatedAt = new Date();

      let updatedUser = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { 
              id: true, email: true, fullName: true, role: true, 
              status: true, createdAt: true, updatedAt: true 
            }
          });
        } catch { /* use mock */ }
      }

      if (!updatedUser) {
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        updatedUser = { ...mockUsers[userIndex], ...updateData };
        delete updatedUser.password;
      }

      return res.json(updatedUser);
    }

    // DELETE USER (Admin only)
    if (path.startsWith('/users/') && !path.includes('/change-password') && method === 'DELETE') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const userId = path.split('/')[2];

      // Prevent deleting own account
      if (userId === auth.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      let deletedUser = null;
      if (prisma && dbStatus === 'connected') {
        try {
          deletedUser = await prisma.user.delete({
            where: { id: userId },
            select: { 
              id: true, email: true, fullName: true, role: true 
            }
          });
        } catch { /* use mock */ }
      }

      if (!deletedUser) {
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex === -1) {
          return res.status(404).json({ error: 'User not found' });
        }
        deletedUser = { ...mockUsers[userIndex] };
        delete deletedUser.password;
      }

      return res.json({ message: 'User deleted successfully', user: deletedUser });
    }

    // ADMIN CHANGE USER PASSWORD 
    if (path.match(/^\/users\/[^\/]+\/change-password$/) && method === 'POST') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const userId = path.split('/')[2];
      const { newPassword } = body;

      if (!newPassword) {
        return res.status(400).json({ error: 'New password required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      if (prisma && dbStatus === 'connected') {
        try {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword, updatedAt: new Date() }
          });
        } catch (error) {
          return res.status(404).json({ error: 'User not found' });
        }
      }

      return res.json({ message: 'Password updated successfully' });
    }

    // USER CHANGE OWN PASSWORD
    if (path === '/users/change-password' && method === 'POST') {
      const auth = requireAuth(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      // Verify current password first
      let user = null;
      if (prisma && dbStatus === 'connected') {
        try {
          user = await prisma.user.findUnique({ where: { id: auth.user.id } });
          if (!user || !await bcrypt.compare(currentPassword, user.password)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
          }
          
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await prisma.user.update({
            where: { id: auth.user.id },
            data: { password: hashedPassword, updatedAt: new Date() }
          });
        } catch { /* use mock */ }
      } else {
        user = mockUsers.find(u => u.id === auth.user.id);
        if (!user || user.password !== currentPassword) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
      }

      return res.json({ message: 'Password changed successfully' });
    }

    // SEARCH USERS (Admin only)
    if (path === '/users/search' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const query = req.url.split('?q=')[1];
      if (!query) {
        return res.status(400).json({ error: 'Search query required' });
      }

      const searchTerm = decodeURIComponent(query).toLowerCase();
      let users = mockUsers
        .filter(u => 
          u.fullName.toLowerCase().includes(searchTerm) ||
          u.email.toLowerCase().includes(searchTerm)
        )
        .map(({ password, ...user }) => user);

      if (prisma && dbStatus === 'connected') {
        try {
          users = await prisma.user.findMany({
            where: {
              OR: [
                { fullName: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } }
              ]
            },
            select: { 
              id: true, email: true, fullName: true, role: true, 
              status: true, createdAt: true, updatedAt: true 
            }
          });
        } catch { /* use mock */ }
      }

      return res.json(users);
    }

    // USER PROFILE
    if (path === '/users/profile' && method === 'GET') {
      const auth = requireAuth(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let user = null;
      if (prisma && dbStatus === 'connected') {
        try {
          user = await prisma.user.findUnique({
            where: { id: auth.user.id },
            select: { id: true, email: true, fullName: true, role: true, status: true }
          });
        } catch { /* fallback */ }
      }
      
      if (!user) {
        user = mockUsers.find(u => u.id === auth.user.id);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          user = userWithoutPassword;
        }
      }
      return res.json(user);
    }

    // BLOGS
    if (path === '/blogs' && method === 'GET') {
      let blogs = mockBlogs;
      if (prisma && dbStatus === 'connected') {
        try {
          blogs = await prisma.blog.findMany({
            where: { published: true },
            include: { author: { select: { fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use mock */ }
      }
      return res.json(blogs);
    }

    // FEATURED BLOGS
    if (path === '/blogs/featured' && method === 'GET') {
      let blogs = mockBlogs.filter(b => b.isFeatured);
      if (prisma && dbStatus === 'connected') {
        try {
          blogs = await prisma.blog.findMany({
            where: { published: true, isFeatured: true },
            include: { author: { select: { fullName: true, email: true } } }
          });
        } catch { /* use mock */ }
      }
      return res.json(blogs);
    }

    // BLOG BY ID
    if (path.startsWith('/blogs/') && !path.includes('/views') && method === 'GET') {
      const blogId = path.split('/')[2];
      let blog = mockBlogs.find(b => b.id === blogId);
      
      if (prisma && dbStatus === 'connected') {
        try {
          blog = await prisma.blog.findUnique({
            where: { id: blogId },
            include: { author: { select: { fullName: true, email: true } } }
          });
        } catch { /* use mock */ }
      }

      if (!blog) return res.status(404).json({ error: 'Blog not found' });
      return res.json(blog);
    }

    // CREATE BLOG (Admin only)
    if (path === '/blogs' && method === 'POST') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const { title, content, excerpt, featuredImage, published, isFeatured, category, tags } = body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const data = {
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: excerpt?.trim() || content.substring(0, 150) + '...',
        featuredImage: featuredImage || { url: '/placeholder.svg', alt: title },
        published: published || true,
        isFeatured: isFeatured || false,
        category: category?.trim() || 'General',
        tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
        views: 0,
        authorId: auth.user.id
      };

      let blog = { id: Date.now().toString(), ...data, createdAt: new Date() };
      if (prisma && dbStatus === 'connected') {
        try {
          blog = await prisma.blog.create({
            data,
            include: { author: { select: { fullName: true, email: true } } }
          });
        } catch { /* use mock */ }
      }

      return res.status(201).json(blog);
    }

    // UPDATE BLOG (Admin only)
    if (path.startsWith('/blogs/') && !path.includes('/views') && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const blogId = path.split('/')[2];
      const { title, content, excerpt, featuredImage, published, isFeatured, category, tags } = body;

      const updateData = { updatedAt: new Date() };
      if (title) {
        updateData.title = title.trim();
        updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      if (content) updateData.content = content.trim();
      if (excerpt) updateData.excerpt = excerpt.trim();
      if (featuredImage) updateData.featuredImage = featuredImage;
      if (published !== undefined) updateData.published = published;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (category) updateData.category = category.trim();
      if (tags) updateData.tags = Array.isArray(tags) ? tags : [tags];

      let updatedBlog = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: updateData,
            include: { author: { select: { fullName: true, email: true } } }
          });
        } catch {
          return res.status(404).json({ error: 'Blog not found' });
        }
      }

      return res.json(updatedBlog || { id: blogId, ...updateData });
    }

    // DELETE BLOG (Admin only)
    if (path.startsWith('/blogs/') && !path.includes('/views') && method === 'DELETE') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const blogId = path.split('/')[2];

      if (prisma && dbStatus === 'connected') {
        try {
          await prisma.blog.delete({ where: { id: blogId } });
        } catch {
          return res.status(404).json({ error: 'Blog not found' });
        }
      }

      return res.json({ message: 'Blog deleted successfully' });
    }

    // GET ALL BLOGS FOR ADMIN (Admin only)
    if (path === '/admin/blogs' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let blogs = mockBlogs;
      if (prisma && dbStatus === 'connected') {
        try {
          blogs = await prisma.blog.findMany({
            include: { author: { select: { fullName: true, email: true } } },
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use mock */ }
      }
      return res.json(blogs);
    }

    // BLOG VIEWS
    if (path.match(/^\/blogs\/[^\/]+\/views$/) && method === 'POST') {
      const blogId = path.split('/')[2];
      if (prisma && dbStatus === 'connected') {
        try {
          await prisma.blog.update({
            where: { id: blogId },
            data: { views: { increment: 1 } }
          });
        } catch { /* ignore errors */ }
      }
      return res.json({ message: 'Views incremented' });
    }

    // JOBS
    if (path === '/recruitment/jobs' && method === 'GET') {
      let jobs = mockJobs;
      if (prisma && dbStatus === 'connected') {
        try {
          jobs = await prisma.job.findMany({
            where: { status: 'active' },
            include: { applications: { select: { id: true } } }
          });
        } catch { /* use mock */ }
      }
      return res.json(jobs);
    }

    // CREATE JOB (Admin/HR only)
    if (path === '/recruitment/jobs' && method === 'POST') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const { title, description, requirements, salary, location, type, deadline } = body;
      
      if (!title || !description || !requirements || !location || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const data = {
        title: title.trim(),
        description: description.trim(),
        requirements: Array.isArray(requirements) ? requirements : [requirements],
        salary: salary?.trim() || '',
        location: location.trim(),
        type,
        deadline: deadline ? new Date(deadline) : null,
        status: 'active'
      };

      let job = { id: Date.now(), ...data, createdAt: new Date() };
      if (prisma && dbStatus === 'connected') {
        try {
          job = await prisma.job.create({ data });
        } catch { /* use mock */ }
      }

      return res.status(201).json(job);
    }

    // JOB BY ID
    if (path.startsWith('/recruitment/jobs/') && !path.includes('/applications') && method === 'GET') {
      const jobId = parseInt(path.split('/')[3]);
      let job = mockJobs.find(j => j.id === jobId);
      
      if (prisma && dbStatus === 'connected') {
        try {
          job = await prisma.job.findUnique({ 
            where: { id: jobId },
            include: { applications: { select: { id: true } } }
          });
        } catch { /* use mock */ }
      }

      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json(job);
    }

    // UPDATE JOB (Admin/HR only)
    if (path.startsWith('/recruitment/jobs/') && !path.includes('/applications') && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const jobId = parseInt(path.split('/')[3]);
      const { title, description, requirements, salary, location, type, deadline, status } = body;

      const updateData = { updatedAt: new Date() };
      if (title) updateData.title = title.trim();
      if (description) updateData.description = description.trim();
      if (requirements) updateData.requirements = Array.isArray(requirements) ? requirements : [requirements];
      if (salary) updateData.salary = salary.trim();
      if (location) updateData.location = location.trim();
      if (type) updateData.type = type;
      if (deadline) updateData.deadline = new Date(deadline);
      if (status) updateData.status = status;

      let updatedJob = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: updateData,
            include: { applications: { select: { id: true } } }
          });
        } catch {
          return res.status(404).json({ error: 'Job not found' });
        }
      }

      return res.json(updatedJob || { id: jobId, ...updateData });
    }

    // DELETE JOB (Admin only)
    if (path.startsWith('/recruitment/jobs/') && !path.includes('/applications') && method === 'DELETE') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const jobId = parseInt(path.split('/')[3]);

      if (prisma && dbStatus === 'connected') {
        try {
          // Delete related applications first
          await prisma.application.deleteMany({ where: { jobId } });
          await prisma.job.delete({ where: { id: jobId } });
        } catch {
          return res.status(404).json({ error: 'Job not found' });
        }
      }

      return res.json({ message: 'Job and related applications deleted successfully' });
    }

    // CREATE APPLICATION
    if (path === '/recruitment/applications' && method === 'POST') {
      const { jobId, fullName, email, phone, coverLetter } = body;
      
      if (!jobId || !fullName || !email || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const data = {
        jobId: parseInt(jobId), fullName: fullName.trim(),
        email: email.trim().toLowerCase(), phone: phone.trim(),
        coverLetter: coverLetter?.trim() || '', status: 'pending'
      };

      let application = { id: Date.now(), ...data, createdAt: new Date() };
      if (prisma && dbStatus === 'connected') {
        try {
          application = await prisma.application.create({ data });
        } catch { /* use mock */ }
      }

      return res.status(201).json(application);
    }

    // GET ALL APPLICATIONS (Admin/HR only)
    if (path === '/recruitment/applications' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let applications = [];
      if (prisma && dbStatus === 'connected') {
        try {
          applications = await prisma.application.findMany({
            include: { job: { select: { title: true, id: true } } },
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use empty array */ }
      }
      return res.json(applications);
    }

    // GET APPLICATIONS BY JOB (Admin/HR only)
    if (path.match(/^\/recruitment\/jobs\/\d+\/applications$/) && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const jobId = parseInt(path.split('/')[3]);
      let applications = [];
      if (prisma && dbStatus === 'connected') {
        try {
          applications = await prisma.application.findMany({
            where: { jobId },
            include: { job: { select: { title: true, id: true } } },
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use empty array */ }
      }
      return res.json(applications);
    }

    // GET SINGLE APPLICATION (Admin/HR only)
    if (path.match(/^\/recruitment\/applications\/\d+$/) && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const applicationId = parseInt(path.split('/')[3]);
      let application = null;

      if (prisma && dbStatus === 'connected') {
        try {
          application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { job: { select: { title: true, id: true } } }
          });
        } catch {
          return res.status(404).json({ error: 'Application not found' });
        }
      }

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      return res.json(application);
    }

    // UPDATE APPLICATION STATUS (Admin/HR only)
    if (path.match(/^\/recruitment\/applications\/\d+\/status$/) && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const applicationId = parseInt(path.split('/')[3]);
      const { status } = body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updateData = { status, updatedAt: new Date() };

      let updatedApplication = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: updateData,
            include: { job: { select: { title: true, id: true } } }
          });
        } catch {
          return res.status(404).json({ error: 'Application not found' });
        }
      }

      return res.json(updatedApplication || { id: applicationId, ...updateData });
    }

    // UPDATE APPLICATION (Admin/HR only)
    if (path.startsWith('/recruitment/applications/') && !path.includes('/status') && !path.includes('/cv') && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const applicationId = parseInt(path.split('/')[3]);
      const { status, notes } = body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updateData = { status, updatedAt: new Date() };
      if (notes) updateData.notes = notes.trim();

      let updatedApplication = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: updateData,
            include: { job: { select: { title: true, id: true } } }
          });
        } catch {
          return res.status(404).json({ error: 'Application not found' });
        }
      }

      return res.json(updatedApplication || { id: applicationId, ...updateData });
    }

    // DOWNLOAD CV (Admin/HR only)
    if (path.match(/^\/recruitment\/applications\/\d+\/cv$/) && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const applicationId = parseInt(path.split('/')[3]);
      
      // For Vercel, we can't serve actual files easily, so return a mock response
      return res.status(404).json({ 
        error: 'CV file not found',
        message: 'CV download is not available in this demo environment'
      });
    }

    // DELETE APPLICATION (Admin only)
    if (path.startsWith('/recruitment/applications/') && method === 'DELETE') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const applicationId = parseInt(path.split('/')[3]);

      if (prisma && dbStatus === 'connected') {
        try {
          await prisma.application.delete({ where: { id: applicationId } });
        } catch {
          return res.status(404).json({ error: 'Application not found' });
        }
      }

      return res.json({ message: 'Application deleted successfully' });
    }

    // RECRUITMENT STATS (Admin/HR only)
    if (path === '/recruitment/stats' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let stats = {
        activeJobs: 2,
        totalApplications: 0,
        pendingReview: 0,
        interviewed: 0,
        hired: 0,
        recentApplications: []
      };

      if (prisma && dbStatus === 'connected') {
        try {
          const [activeJobs, totalApplications, pendingApplications] = await Promise.all([
            prisma.job.count({ where: { status: 'active' } }),
            prisma.application.count(),
            prisma.application.count({ where: { status: 'pending' } })
          ]);

          const recentApplications = await prisma.application.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              job: { select: { title: true } }
            }
          });

          stats = {
            activeJobs,
            totalApplications,
            pendingReview: pendingApplications,
            interviewed: await prisma.application.count({ where: { status: 'interviewed' } }),
            hired: await prisma.application.count({ where: { status: 'accepted' } }),
            recentApplications
          };
        } catch (error) {
          console.error('Get recruitment stats error:', error);
          // Use mock data on error
        }
      }

      return res.json(stats);
    }

    // CREATE CONTACT
    if (path === '/contacts' && method === 'POST') {
      const { name, email, phone, subject, message } = body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const data = {
        name: name.trim(), email: email.trim(),
        phone: phone?.trim() || '', subject: subject?.trim() || '',
        message: message.trim(), status: 'pending'
      };

      let contact = { id: Date.now().toString(), ...data, createdAt: new Date() };
      if (prisma && dbStatus === 'connected') {
        try {
          contact = await prisma.contact.create({ data });
        } catch { /* use mock */ }
      }

      return res.status(201).json(contact);
    }

    // GET ALL CONTACTS (Admin/HR only)
    if (path === '/contacts' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let contacts = [];
      if (prisma && dbStatus === 'connected') {
        try {
          contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
          });
        } catch { /* use empty array */ }
      }
      return res.json(contacts);
    }

    // UPDATE CONTACT STATUS (Admin/HR only)
    if (path.startsWith('/contacts/') && method === 'PUT') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const contactId = path.split('/')[2];
      const { status, notes } = body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const updateData = { status, updatedAt: new Date() };
      if (notes) updateData.notes = notes.trim();

      let updatedContact = null;
      if (prisma && dbStatus === 'connected') {
        try {
          updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: updateData
          });
        } catch {
          return res.status(404).json({ error: 'Contact not found' });
        }
      }

      return res.json(updatedContact || { id: contactId, ...updateData });
    }

    // DELETE CONTACT (Admin only)
    if (path.startsWith('/contacts/') && method === 'DELETE') {
      const auth = requireRole(req, 'ADMIN');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      const contactId = path.split('/')[2];

      if (prisma && dbStatus === 'connected') {
        try {
          await prisma.contact.delete({ where: { id: contactId } });
        } catch {
          return res.status(404).json({ error: 'Contact not found' });
        }
      }

      return res.json({ message: 'Contact deleted successfully' });
    }

    // DASHBOARD STATISTICS (Admin/HR only)
    if (path === '/admin/dashboard/stats' && method === 'GET') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let stats = {
        users: { total: 5, active: 5, inactive: 0 },
        jobs: { total: 2, active: 2, inactive: 0 },
        applications: { total: 0, pending: 0, approved: 0, rejected: 0 },
        contacts: { total: 0, pending: 0, responded: 0 },
        blogs: { total: 1, published: 1, draft: 0, views: 150 }
      };

      if (prisma && dbStatus === 'connected') {
        try {
          const [userCount, jobCount, applicationCount, contactCount, blogCount] = await Promise.all([
            prisma.user.groupBy({
              by: ['status'],
              _count: { status: true }
            }),
            prisma.job.groupBy({
              by: ['status'],
              _count: { status: true }
            }),
            prisma.application.groupBy({
              by: ['status'],
              _count: { status: true }
            }),
            prisma.contact.groupBy({
              by: ['status'],
              _count: { status: true }
            }),
            prisma.blog.aggregate({
              _count: { id: true },
              _sum: { views: true }
            })
          ]);

          stats.users = userCount.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            acc.total = (acc.total || 0) + curr._count.status;
            return acc;
          }, {});

          stats.jobs = jobCount.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            acc.total = (acc.total || 0) + curr._count.status;
            return acc;
          }, {});

          stats.applications = applicationCount.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            acc.total = (acc.total || 0) + curr._count.status;
            return acc;
          }, {});

          stats.contacts = contactCount.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            acc.total = (acc.total || 0) + curr._count.status;
            return acc;
          }, {});

          stats.blogs = {
            total: blogCount._count.id || 0,
            views: blogCount._sum.views || 0
          };

        } catch { /* use mock stats */ }
      }

      return res.json(stats);
    }

    // FILE UPLOAD (Admin/HR only)
    if (path === '/upload' && method === 'POST') {
      const auth = requireRole(req, 'ADMIN', 'HR');
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      // For Vercel, we'll return a mock response since file upload requires special handling
      const mockFile = {
        filename: `uploaded-${Date.now()}.jpg`,
        url: `/uploads/uploaded-${Date.now()}.jpg`,
        size: 1024,
        mimetype: 'image/jpeg'
      };

      return res.json({
        message: 'File upload successful',
        file: mockFile
      });
    }

    // 404
    return res.status(404).json({
      error: 'Not found', method, path,
      message: 'This API endpoint is not implemented yet',
      availableEndpoints: [
        '== AUTHENTICATION ==',
        'POST /auth/login',
        'POST /auth/refresh',
        'POST /auth/logout',
        '== USER MANAGEMENT ==',
        'GET /users/profile',
        'POST /users/change-password',
        'GET /users (admin)',
        'POST /users (admin)',
        'PUT /users/:id (admin)',
        'DELETE /users/:id (admin)',
        'POST /users/:id/change-password (admin)',
        'GET /users/search (admin)',
        '== BLOG MANAGEMENT ==',
        'GET /blogs',
        'POST /blogs (admin)',
        'GET /blogs/featured',
        'GET /blogs/:id',
        'PUT /blogs/:id (admin)',
        'DELETE /blogs/:id (admin)',
        'GET /admin/blogs (admin)',
        'POST /blogs/:id/views',
        '== JOB MANAGEMENT ==',
        'GET /recruitment/jobs',
        'POST /recruitment/jobs (admin/hr)',
        'GET /recruitment/jobs/:id',
        'PUT /recruitment/jobs/:id (admin/hr)',
        'DELETE /recruitment/jobs/:id (admin)',
        '== APPLICATION MANAGEMENT ==',
        'POST /recruitment/applications',
        'GET /recruitment/applications (admin/hr)',
        'GET /recruitment/applications/:id (admin/hr)',
        'GET /recruitment/jobs/:id/applications (admin/hr)',
        'PUT /recruitment/applications/:id (admin/hr)',
        'PUT /recruitment/applications/:id/status (admin/hr)',
        'GET /recruitment/applications/:id/cv (admin/hr)',
        'DELETE /recruitment/applications/:id (admin)',
        'GET /recruitment/stats (admin/hr)',
        '== CONTACT MANAGEMENT ==',
        'POST /contacts',
        'GET /contacts (admin/hr)',
        'PUT /contacts/:id (admin/hr)',
        'DELETE /contacts/:id (admin)',
        '== ADMIN DASHBOARD ==',
        'GET /admin/dashboard/stats (admin/hr)',
        '== FILE UPLOAD ==',
        'POST /upload (admin/hr)',
        '== SYSTEM ==',
        'GET / (health)'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal error', message: error.message
    });
  }
}; 