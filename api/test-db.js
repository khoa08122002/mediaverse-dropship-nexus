const bcrypt = require('bcrypt');
const { getPrismaClient, withDatabase } = require('./prisma-singleton');

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

    const url = req.url || '/';
    const action = url.includes('init-admin') ? 'init-admin' : 'test-db';
    
    console.log(`Action: ${action}`);
    
    if (action === 'init-admin') {
      // Admin initialization only
      const result = await withDatabase(async (db) => {
        console.log('Database connected for admin initialization');

        const existingAdmin = await db.user.findUnique({
          where: { email: 'admin@phg.com' }
        });

        if (existingAdmin) {
          return {
            exists: true,
            admin: {
              email: existingAdmin.email,
              fullName: existingAdmin.fullName,
              role: existingAdmin.role,
              created: false
            }
          };
        }

        console.log('Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = await db.user.create({
          data: {
            email: 'admin@phg.com',
            password: adminPassword,
            fullName: 'Admin User',
            role: 'ADMIN',
            status: 'ACTIVE'
          }
        });

        return {
          exists: false,
          admin: {
            id: adminUser.id,
            email: adminUser.email,
            fullName: adminUser.fullName,
            role: adminUser.role,
            created: true
          }
        };
      });

      if (result.exists) {
        return res.status(200).json({
          status: 'success',
          message: 'Admin user already exists',
          data: result.admin
        });
      }

      return res.status(201).json({
        status: 'success',
        message: 'Admin user created successfully',
        data: result.admin
      });
    
    } else {
      // Database test with admin check
      const result = await withDatabase(async (db) => {
        console.log('Database connected successfully');

        // Check if admin user exists
        const adminUser = await db.user.findUnique({
          where: { email: 'admin@phg.com' }
        });

        console.log('Admin user exists:', !!adminUser);

        // If no admin user, create one
        let adminCreated = false;
        if (!adminUser) {
          console.log('Creating admin user...');
          const adminPassword = await bcrypt.hash('admin123', 10);
          const newAdmin = await db.user.create({
            data: {
              email: 'admin@phg.com',
              password: adminPassword,
              fullName: 'Admin User',
              role: 'ADMIN',
              status: 'ACTIVE'
            }
          });
          console.log('Admin user created:', newAdmin.email);
          adminCreated = true;
        }

        // Test user count
        const userCount = await db.user.count();
        const jobCount = await db.job.count();
        const blogCount = await db.blog.count();
        const contactCount = await db.contact.count();

        return {
          adminExists: !!adminUser,
          adminCreated,
          counts: {
            users: userCount,
            jobs: jobCount,
            blogs: blogCount,
            contacts: contactCount
          }
        };
      });

      return res.status(200).json({
        status: 'success',
        message: 'Database test completed',
        data: {
          connected: true,
          adminExists: result.adminExists,
          adminCreated: result.adminCreated,
          counts: result.counts,
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            hasJwtSecret: !!process.env.JWT_SECRET
          }
        }
      });
    }

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
    // Prisma singleton handles disconnection automatically
  }
}; 