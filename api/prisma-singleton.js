const { PrismaClient } = require('@prisma/client');

// Global singleton instance with enhanced management
let prisma;
let connectionPromise;
let isConnecting = false;
let lastConnectionTime = 0;
const CONNECTION_TIMEOUT = 10000; // 10 seconds
const RECONNECTION_INTERVAL = 5000; // 5 seconds minimum between connections

function createFreshPrismaClient() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    console.log('Creating fresh Prisma client with enhanced serverless config...');

    // Create new client with optimized settings for serverless
    const client = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'minimal',
      // Enhanced serverless optimization
      __internal: {
        engine: {
          binaryTargets: ['native'],
          // Force new engine instance to avoid prepared statement conflicts
          engineType: 'native',
        },
      },
    });

    return client;

  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    throw error;
  }
}

function getPrismaClient() {
  // Check if we need to recreate client due to connection issues
  const now = Date.now();
  if (prisma && (now - lastConnectionTime > 60000)) { // Reset every minute
    console.log('Prisma client aged, recreating...');
    prisma = null;
    connectionPromise = null;
  }

  if (!prisma) {
    prisma = createFreshPrismaClient();
    lastConnectionTime = now;
    console.log('Fresh Prisma client created');
  }

  return prisma;
}

// Enhanced health check with prepared statement error detection
async function checkDatabaseHealth() {
  try {
    const client = getPrismaClient();
    
    // Use a simple database operation that doesn't create prepared statements
    // Instead of $queryRaw, use a regular Prisma operation
    const userCount = await client.user.count();
    
    // If we can count users, database is healthy
    if (typeof userCount === 'number') {
      return { 
        healthy: true, 
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString(),
        userCount
      };
    } else {
      throw new Error('Health check query returned invalid result');
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    
    // Check for prepared statement conflicts
    const isPreparedStatementError = 
      error.message.includes('prepared statement') ||
      error.message.includes('already exists') ||
      error.code === '42P05';

    if (isPreparedStatementError) {
      console.log('Detected prepared statement conflict, triggering reset...');
      try {
        await resetPrisma();
      } catch (resetError) {
        console.error('Reset failed during health check:', resetError);
      }
    }

    return { 
      healthy: false, 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
      needsReset: isPreparedStatementError
    };
  }
}

// Enhanced disconnect with better cleanup
async function disconnectPrisma() {
  if (prisma) {
    try {
      console.log('Disconnecting Prisma client...');
      await prisma.$disconnect();
      console.log('Prisma client disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    } finally {
      prisma = null;
      connectionPromise = null;
      isConnecting = false;
      lastConnectionTime = 0;
    }
  }
}

// Enhanced reset with improved recovery
async function resetPrisma() {
  console.log('=== ENHANCED PRISMA RESET ===');
  
  // Force disconnect current client
  if (prisma) {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error during force disconnect:', error);
    }
  }
  
  // Clear all state
  prisma = null;
  connectionPromise = null;
  isConnecting = false;
  lastConnectionTime = 0;
  
  // Force garbage collection if available
  if (global.gc) {
    try {
      global.gc();
      console.log('Garbage collection triggered');
    } catch (error) {
      console.log('Garbage collection not available');
    }
  }
  
  // Wait a moment for cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Prisma reset completed');
}

// Enhanced database operation wrapper with prepared statement conflict handling
async function withDatabase(operation, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Prevent concurrent connection attempts
      if (isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const client = getPrismaClient();
      
      // Enhanced connection management
      if (!connectionPromise) {
        isConnecting = true;
        connectionPromise = Promise.race([
          client.$connect(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
          )
        ]).finally(() => {
          isConnecting = false;
        });
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
      
      // Enhanced error classification
      const isPreparedStatementError = 
        error.message.includes('prepared statement') ||
        error.message.includes('already exists') ||
        error.code === '42P05';

      const isConnectionError = 
        error.code === 'P1001' || // Connection failed
        error.code === 'P1017' || // Server has closed the connection
        error.message.includes('Connection timeout') ||
        error.message.includes('ECONNRESET') ||
        error.message.includes('ETIMEDOUT');

      const isRetriableError = isPreparedStatementError || isConnectionError;
      
      if (isRetriableError && attempt < maxRetries) {
        console.log(`Retrying database operation (attempt ${attempt + 2}/${maxRetries + 1})`);
        
        // Enhanced recovery strategy
        if (isPreparedStatementError) {
          console.log('Prepared statement conflict detected, performing enhanced reset...');
          await resetPrisma();
          // Longer wait for prepared statement conflicts
          await new Promise(resolve => setTimeout(resolve, 2000 + (attempt * 1000)));
        } else {
          // Regular connection reset
          await disconnectPrisma();
          await new Promise(resolve => setTimeout(resolve, 1000 + (attempt * 500)));
        }
        
        continue;
      }
      
      // If not retriable or max retries reached, break
      break;
    }
  }
  
  // Final cleanup on failure
  if (lastError && lastError.message.includes('prepared statement')) {
    console.log('Final prepared statement cleanup...');
    await resetPrisma();
  }
  
  connectionPromise = null;
  throw lastError;
}

module.exports = {
  getPrismaClient,
  disconnectPrisma,
  resetPrisma,
  checkDatabaseHealth,
  withDatabase,
  createFreshPrismaClient
}; 