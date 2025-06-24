const { PrismaClient } = require('@prisma/client');

// Global singleton instance
let prisma;
let connectionPromise;

function getPrismaClient() {
  if (prisma) {
    return prisma;
  }

  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    // Enhanced configuration for serverless
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // Optimize for serverless environment
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'minimal',
      // Add connection pool settings for better serverless performance
      __internal: {
        engine: {
          // Reduce connection overhead
          binaryTargets: ['native'],
        },
      },
    });

    console.log('Enhanced Prisma client initialized (singleton)');
    return prisma;

  } catch (error) {
    console.error('Prisma client initialization failed:', error);
    throw error;
  }
}

// Graceful disconnect with connection promise cleanup
async function disconnectPrisma() {
  if (prisma) {
    try {
      await prisma.$disconnect();
      console.log('Prisma client disconnected');
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    } finally {
      prisma = null;
      connectionPromise = null;
    }
  }
}

// Force reset everything - for critical errors
async function resetPrisma() {
  console.log('Force resetting Prisma client and connections');
  
  if (prisma) {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error force disconnecting Prisma:', error);
    }
  }
  
  prisma = null;
  connectionPromise = null;
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
}

// Health check for database connection
async function checkDatabaseHealth() {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return { healthy: true, message: 'Database connection is healthy' };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      healthy: false, 
      message: 'Database connection failed',
      error: error.message 
    };
  }
}

// Database operation wrapper with automatic connection management and retry
async function withDatabase(operation, maxRetries = 2) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const client = getPrismaClient();
      
      // Ensure connection with timeout
      if (!connectionPromise) {
        connectionPromise = Promise.race([
          client.$connect(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 10000)
          )
        ]);
      }
      
      await connectionPromise;
      
      // Execute operation with timeout
      const result = await Promise.race([
        operation(client),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), 30000)
        )
      ]);
      
      return result;
      
    } catch (error) {
      lastError = error;
      console.error(`Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}):`, {
        message: error.message,
        code: error.code,
        name: error.name,
        attempt: attempt + 1
      });
      
      // Check if this is a retriable error
      const isRetriableError = 
        error.code === 'P1001' || // Connection failed
        error.code === 'P1017' || // Server has closed the connection
        error.message.includes('prepared statement') ||
        error.message.includes('Connection timeout') ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('ETIMEDOUT');
      
      if (isRetriableError && attempt < maxRetries) {
        console.log(`Retrying database operation (attempt ${attempt + 2}/${maxRetries + 1})`);
        
        // Reset connection for retry
        await disconnectPrisma();
        connectionPromise = null;
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }
      
      // If not retriable or max retries reached, throw the error
      break;
    }
  }
  
  // Reset connection promise on failure
  connectionPromise = null;
  throw lastError;
}

module.exports = {
  getPrismaClient,
  disconnectPrisma,
  resetPrisma,
  checkDatabaseHealth,
  withDatabase
}; 