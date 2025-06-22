#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase Database Connection');
    console.log('======================================\n');

    // Check environment variables
    if (!process.env.DATABASE_URL) {
        console.log('❌ DATABASE_URL environment variable is not set');
        console.log('💡 Run: npm run setup:supabase for setup instructions');
        process.exit(1);
    }

    const dbUrl = process.env.DATABASE_URL;
    
    // Check if it's a Supabase URL
    if (!dbUrl.includes('supabase') && !dbUrl.includes('db.') && !dbUrl.includes('pooler.')) {
        console.log('⚠️  Warning: DATABASE_URL doesn\'t appear to be a Supabase URL');
        console.log('    Supabase URLs typically contain "supabase" or "db." in the hostname');
    }

    console.log('📍 Database URL preview:', dbUrl.substring(0, 30) + '...');

    const prisma = new PrismaClient();

    try {
        console.log('🔄 Connecting to Supabase...');
        await prisma.$connect();
        console.log('✅ Successfully connected to Supabase database!');

        console.log('\n🔄 Testing database queries...');
        
        // Test basic query
        const result = await prisma.$queryRaw`SELECT version()`;
        console.log('✅ Database query successful');
        console.log('📊 PostgreSQL version:', result[0].version.split(' ')[0]);

        // Check if tables exist
        console.log('\n🔄 Checking database tables...');
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `;
        
        if (tables.length === 0) {
            console.log('⚠️  No tables found in database');
            console.log('💡 Run: npm run prisma:deploy to create tables');
        } else {
            console.log('✅ Found tables:', tables.map(t => t.table_name).join(', '));
        }

        // Test user count (if users table exists)
        try {
            const userCount = await prisma.user.count();
            console.log('👥 Users in database:', userCount);
            
            if (userCount === 0) {
                console.log('💡 Run: npm run prisma:seed to add initial data');
            }
        } catch (error) {
            console.log('ℹ️  Users table not found or not accessible (this is normal for fresh databases)');
        }

        console.log('\n🎉 Supabase connection test completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   • If no tables: npm run prisma:deploy');
        console.log('   • If no data: npm run prisma:seed');
        console.log('   • Open Supabase dashboard to manage your database');
        console.log('   • Set up Row Level Security (RLS) for production');

    } catch (error) {
        console.log('❌ Database connection failed!');
        console.log('Error:', error.message);
        
        console.log('\n🔧 Troubleshooting:');
        console.log('   • Check if your Supabase project is active');
        console.log('   • Verify your DATABASE_URL is correct');
        console.log('   • Ensure your password doesn\'t have special characters');
        console.log('   • Try enabling connection pooling: add "?pgbouncer=true" to DATABASE_URL');
        console.log('   • Check Supabase project status in dashboard');
        
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testSupabaseConnection().catch(console.error); 