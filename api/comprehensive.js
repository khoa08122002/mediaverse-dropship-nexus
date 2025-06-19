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
  { id: '1', email: 'admin@phg.com', password: 'admin123', fullName: 'Admin User', role: 'ADMIN' },
  { id: '2', email: 'hr@phg.com', password: 'hr123', fullName: 'HR Manager', role: 'HR' },
  { id: '3', email: 'user@phg.com', password: 'user123', fullName: 'Regular User', role: 'USER' }
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

    // USER PROFILE
    if (path === '/users/profile' && method === 'GET') {
      const auth = requireAuth(req);
      if (auth.error) return res.status(auth.status).json({ error: auth.error });

      let user = null;
      if (prisma && dbStatus === 'connected') {
        try {
          user = await prisma.user.findUnique({
            where: { id: auth.user.id },
            select: { id: true, email: true, fullName: true, role: true }
          });
        } catch { /* fallback */ }
      }
      
      if (!user) user = mockUsers.find(u => u.id === auth.user.id);
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

    // JOB BY ID
    if (path.startsWith('/recruitment/jobs/') && method === 'GET') {
      const jobId = parseInt(path.split('/')[3]);
      let job = mockJobs.find(j => j.id === jobId);
      
      if (prisma && dbStatus === 'connected') {
        try {
          job = await prisma.job.findUnique({ where: { id: jobId } });
        } catch { /* use mock */ }
      }

      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json(job);
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

    // CREATE CONTACT
    if (path === '/contacts' && method === 'POST') {
      const { fullName, email, phone, subject, message } = body;
      
      if (!fullName || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const data = {
        fullName: fullName.trim(), email: email.trim(),
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

    // 404
    return res.status(404).json({
      error: 'Not found', method, path,
      endpoints: [
        'GET /', 'POST /auth/login', 'GET /users/profile',
        'GET /blogs', 'GET /blogs/featured', 'GET /blogs/:id',
        'POST /blogs/:id/views', 'GET /recruitment/jobs',
        'GET /recruitment/jobs/:id', 'POST /recruitment/applications',
        'POST /contacts'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal error', message: error.message
    });
  }
}; 