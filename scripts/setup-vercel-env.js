#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔧 Vercel Environment Variables Setup for Supabase');
console.log('================================================\n');

// Original password from user
const originalPassword = 'Dangkhoa08122002@@';
console.log('🔐 Original password:', originalPassword);

// URL encode the password
const encodedPassword = encodeURIComponent(originalPassword);
console.log('🔐 URL encoded password:', encodedPassword);

// Generate strong JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Supabase connection strings
const connections = {
    // For Vercel (serverless) - Transaction Pooler is recommended
    production: `postgresql://postgres.qwtockcawgwpvpxiewov:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    
    // Alternative: Session Pooler (if transaction pooler has issues)
    session: `postgresql://postgres.qwtockcawgwpvpxiewov:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    
    // For local development - Direct connection
    development: `postgresql://postgres:${encodedPassword}@db.qwtockcawgwpvpxiewov.supabase.co:5432/postgres`
};

console.log('\n📋 RECOMMENDED for Vercel (Production):');
console.log('=====================================');
console.log('CONNECTION TYPE: Transaction Pooler (Best for serverless)');
console.log('DATABASE_URL:', connections.production);
console.log('JWT_SECRET:', jwtSecret);

console.log('\n📋 Alternative for Vercel (if pooler has issues):');
console.log('==============================================');
console.log('CONNECTION TYPE: Session Pooler');
console.log('DATABASE_URL:', connections.session);

console.log('\n📋 For Local Development:');
console.log('========================');
console.log('CONNECTION TYPE: Direct Connection');
console.log('DATABASE_URL:', connections.development);

console.log('\n🚀 VERCEL SETUP INSTRUCTIONS:');
console.log('=============================');
console.log('1. Go to: https://vercel.com/dashboard');
console.log('2. Select your project: mediaverse-dropship-nexus');
console.log('3. Go to: Settings → Environment Variables');
console.log('4. Add these variables:');
console.log('');
console.log('   Variable Name: DATABASE_URL');
console.log('   Value: ' + connections.production);
console.log('   Environment: Production, Preview');
console.log('');
console.log('   Variable Name: JWT_SECRET');
console.log('   Value: ' + jwtSecret);
console.log('   Environment: Production, Preview');
console.log('');
console.log('   Variable Name: NODE_ENV');
console.log('   Value: production');
console.log('   Environment: Production, Preview');

console.log('\n💾 LOCAL .env FILE:');
console.log('==================');
const envContent = `# Supabase Database Configuration (Local Development)
DATABASE_URL="${connections.development}"

# JWT Secret
JWT_SECRET="${jwtSecret}"

# Node Environment
NODE_ENV="development"
PORT=3000

# Optional: Supabase API Keys
SUPABASE_URL="https://qwtockcawgwpvpxiewov.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_KEY="your-supabase-service-key"
`;

console.log(envContent);

// Write to .env file
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');
} catch (error) {
    console.log('⚠️  Could not write .env file:', error.message);
    console.log('Please create it manually with the content above.');
}

console.log('\n🔄 NEXT STEPS:');
console.log('=============');
console.log('1. Copy the DATABASE_URL for Production and paste it in Vercel');
console.log('2. Copy the JWT_SECRET and paste it in Vercel');
console.log('3. Test connection locally: npm run test:supabase');
console.log('4. Deploy schema: npm run prisma:deploy');
console.log('5. Deploy to Vercel: git push');

console.log('\n⚡ CONNECTION POOLER BENEFITS:');
console.log('=============================');
console.log('• Optimized for serverless functions');
console.log('• Automatic connection management');
console.log('• Better performance for Vercel');
console.log('• Reduced connection overhead');

console.log('\n🐛 TROUBLESHOOTING:');
console.log('==================');
console.log('• If connection fails, try Session Pooler instead');
console.log('• Make sure password is URL encoded');
console.log('• Check Supabase project is active');
console.log('• Verify region matches your Vercel deployment'); 