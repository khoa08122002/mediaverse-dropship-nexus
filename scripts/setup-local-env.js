#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up local development environment...\n');

function createEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
        console.log('✅ .env file already exists');
        return;
    }
    
    const envContent = `# Database Configuration (Supabase Pooler)
DATABASE_URL="postgresql://postgres.qwtockcawgwpvpxiewov:Dangkhoa08122002%40%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# If Supabase is unavailable, use SQLite for local development:
# DATABASE_URL="file:./dev.db"

# JWT Configuration  
JWT_SECRET="phg-corporation-super-secret-jwt-key-2025-mediaverse-dropship-nexus"

# Application Configuration
NODE_ENV="development"
PORT=3000

# Cors Configuration
CORS_ORIGIN="http://localhost:5173,https://phg2.vercel.app"

# Optional configurations
VITE_TINYMCE_API_KEY=""
NEXTAUTH_SECRET="phg-nextauth-secret-key-2025"
NEXTAUTH_URL="http://localhost:3000"
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default configuration');
}

function testDatabaseConnection() {
    console.log('\n🔍 Testing database connectivity...');
    
    const { spawn } = require('child_process');
    
    return new Promise((resolve) => {
        const test = spawn('npm', ['run', 'test:db'], { 
            stdio: 'inherit',
            shell: true 
        });
        
        test.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Database connection successful');
                resolve(true);
            } else {
                console.log('❌ Database connection failed');
                console.log('\n💡 Possible solutions:');
                console.log('1. Check if Supabase project is active');
                console.log('2. Use SQLite for local development');
                console.log('3. Create new Supabase project');
                resolve(false);
            }
        });
    });
}

function showUsageInstructions() {
    console.log('\n📋 Next steps:');
    console.log('1. ✅ .env file created');
    console.log('2. 🔄 Test: npm run validate:env');
    console.log('3. 🗄️  Test: npm run test:db');
    console.log('4. 🚀 Start: npm run dev');
    
    console.log('\n🔧 If database fails:');
    console.log('1. Edit .env to use SQLite:');
    console.log('   DATABASE_URL="file:./dev.db"');
    console.log('2. Run: npm run prisma:generate');
    console.log('3. Run: npm run prisma:migrate');
    console.log('4. Run: npm run prisma:seed');
}

async function main() {
    createEnvFile();
    await testDatabaseConnection();
    showUsageInstructions();
}

main().catch(console.error); 