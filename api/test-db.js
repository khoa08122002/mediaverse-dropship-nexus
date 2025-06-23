const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

let prisma;

try {
  if (process.env.DATABASE_URL) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    console.log('Prisma client initialized for testing');
  } else {
    console.warn('DATABASE_URL not found in environment variables');
  }
} catch (error) {
  console.error('Prisma initialization failed:', error);
}

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

    console.log('Testing database connection...');
    
    if (!prisma) {
      return res.status(503).json({
        error: 'Database not initialized',
        details: {
          hasUrl: !!process.env.DATABASE_URL,
          url: process.env.DATABASE_URL ? 'Present' : 'Missing'
        }
      });
    }

    // Test basic connection
    await prisma.$connect();
    console.log('Database connected successfully');

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@phg.com' }
    });

    console.log('Admin user exists:', !!adminUser);

    // If no admin user, create one
    if (!adminUser) {
      console.log('Creating admin user...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@phg.com',
          password: adminPassword,
          fullName: 'Admin User',
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
      console.log('Admin user created:', newAdmin.email);
    }

    // Test user count
    const userCount = await prisma.user.count();
    const jobCount = await prisma.job.count();
    const blogCount = await prisma.blog.count();
    const contactCount = await prisma.contact.count();

    return res.status(200).json({
      status: 'success',
      message: 'Database test completed',
      data: {
        connected: true,
        adminExists: !!adminUser,
        adminCreated: !adminUser,
        counts: {
          users: userCount,
          jobs: jobCount,
          blogs: blogCount,
          contacts: contactCount
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDbUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!process.env.JWT_SECRET
        }
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({
      error: 'Database test failed',
      details: {
        message: error.message,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}; 