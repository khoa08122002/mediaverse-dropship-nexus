const { PrismaClient } = require('@prisma/client');

// Global singleton instance
let prisma;

function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Optimize for serverless
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'minimal',
    });

    console.log('Prisma client initialized (singleton)');
    return prisma;

  } catch (error) {
    console.error('Prisma client initialization failed:', error);
    throw error;
  }
}

// Graceful disconnect
async function disconnectPrisma() {
  if (prisma) {
    try {
      await prisma.$disconnect();
      console.log('Prisma client disconnected');
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    } finally {
      prisma = null;
    }
  }
}

// Database operation wrapper with automatic connection management
async function withDatabase(operation) {
  const client = getPrismaClient();
  
  try {
    // Test connection
    await client.$connect();
    
    // Execute operation  
    const result = await operation(client);
    
    return result;
    
  } catch (error) {
    console.error('Database operation failed:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // If it's a connection error, reset the client
    if (error.code === 'P1001' || error.code === 'P1017' || error.message.includes('prepared statement')) {
      console.log('Resetting Prisma client due to connection error');
      await disconnectPrisma();
    }
    
    throw error;
  }
}

module.exports = {
  getPrismaClient,
  disconnectPrisma,
  withDatabase
}; 