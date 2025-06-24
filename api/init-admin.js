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
    console.log('Prisma client initialized for admin init');
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

    console.log('Initializing admin user...');
    
    if (!prisma) {
      return res.status(503).json({
        error: 'Database not initialized',
        details: {
          hasUrl: !!process.env.DATABASE_URL,
          url: process.env.DATABASE_URL ? 'Present' : 'Missing'
        }
      });
    }

    // Connect to database
    await prisma.$connect();
    console.log('Database connected successfully');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@phg.com' }
    });

    if (existingAdmin) {
      return res.status(200).json({
        status: 'success',
        message: 'Admin user already exists',
        data: {
          email: existingAdmin.email,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role,
          created: false
        }
      });
    }

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@phg.com',
        password: adminPassword,
        fullName: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log('Admin user created successfully');

    return res.status(201).json({
      status: 'success',
      message: 'Admin user created successfully',
      data: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
        created: true
      }
    });

  } catch (error) {
    console.error('Admin initialization error:', error);
    return res.status(500).json({
      error: 'Failed to initialize admin user',
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