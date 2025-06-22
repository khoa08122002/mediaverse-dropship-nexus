// Runtime Database Initialization for Vercel
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

let prisma = null;
let initAttempted = false;
let initSuccess = false;

async function initializeDatabase() {
    if (initAttempted) {
        return { success: initSuccess, prisma };
    }
    
    initAttempted = true;
    console.log('🔄 Runtime database initialization starting...');
    
    try {
        // Try to create Prisma client
        prisma = new PrismaClient({
            log: ['error', 'warn'],
        });
        
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connection established');
        
        // Check if tables exist
        try {
            await prisma.user.findFirst();
            console.log('✅ Database tables exist and accessible');
            initSuccess = true;
            return { success: true, prisma };
        } catch (tableError) {
            console.log('⚠️ Tables not found, attempting to create schema...');
            
            // Try to push schema
            try {
                execSync('npx prisma db push --accept-data-loss --skip-generate', { 
                    stdio: 'inherit',
                    timeout: 30000 // 30 seconds max
                });
                console.log('✅ Database schema created successfully');
                
                // Test again
                await prisma.user.findFirst();
                initSuccess = true;
                return { success: true, prisma };
            } catch (pushError) {
                console.log('❌ Schema creation failed:', pushError.message);
                // Return partial success - connection works but no schema
                return { success: false, prisma, error: 'Schema creation failed' };
            }
        }
    } catch (connectionError) {
        console.log('❌ Database connection failed:', connectionError.message);
        return { success: false, prisma: null, error: connectionError.message };
    }
}

async function safeQuery(queryFn, fallbackResult = null) {
    try {
        const { success, prisma: db } = await initializeDatabase();
        if (!success || !db) {
            console.log('⚠️ Database not available, returning fallback result');
            return fallbackResult;
        }
        return await queryFn(db);
    } catch (error) {
        console.log('❌ Query failed:', error.message);
        return fallbackResult;
    }
}

module.exports = {
    initializeDatabase,
    safeQuery,
    getPrisma: async () => {
        const { prisma: db } = await initializeDatabase();
        return db;
    }
}; 