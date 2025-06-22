#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Supabase Setup Guide for Mediaverse Dropship Nexus');
console.log('================================================\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

console.log('📋 Step 1: Create your Supabase project');
console.log('   • Go to https://supabase.com');
console.log('   • Create a new project');
console.log('   • Choose your region\n');

console.log('📋 Step 2: Get your database connection string');
console.log('   • Go to Settings → Database');
console.log('   • Copy the "Connection string" (URI mode)');
console.log('   • It should look like: postgresql://postgres:[password]@[host]:5432/postgres\n');

console.log('📋 Step 3: Set up environment variables');
if (!envExists) {
    console.log('   Creating .env file...');
    const envContent = `# Database Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# JWT Secret (Generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here-change-this"

# Application Configuration
NODE_ENV="development"
PORT=3000

# Optional: Supabase API Configuration
SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_KEY="your-supabase-service-key"
`;
    
    try {
        fs.writeFileSync(envPath, envContent);
        console.log('   ✅ .env file created successfully!');
    } catch (error) {
        console.log('   ❌ Failed to create .env file:', error.message);
    }
} else {
    console.log('   ⚠️  .env file already exists. Please update it manually with:');
    console.log('   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"');
}

console.log('\n📋 Step 4: Configure Vercel environment variables');
console.log('   • Go to your Vercel dashboard');
console.log('   • Select your project');
console.log('   • Go to Settings → Environment Variables');
console.log('   • Add: DATABASE_URL with your Supabase connection string');
console.log('   • Add: JWT_SECRET with a strong random string\n');

console.log('📋 Step 5: Deploy database schema');
console.log('   Run these commands after setting up your DATABASE_URL:');
console.log('   • npm run prisma:deploy');
console.log('   • npm run prisma:seed (optional)\n');

console.log('📋 Step 6: Test the connection');
console.log('   • npm run validate:env');
console.log('   • npm run test:db\n');

console.log('🔧 Troubleshooting:');
console.log('   • Make sure your Supabase project is active');
console.log('   • Check that your password doesn\'t contain special characters that need URL encoding');
console.log('   • Ensure your connection string uses "postgresql://" not "postgres://"');
console.log('   • Test locally first before deploying to Vercel\n');

console.log('💡 Pro Tips:');
console.log('   • Use connection pooling for production: add "?pgbouncer=true" to your DATABASE_URL');
console.log('   • Enable RLS (Row Level Security) in Supabase for better security');
console.log('   • Set up automatic backups in Supabase dashboard\n');

console.log('🎉 You\'re ready to go! Run the migration commands when you\'ve set up your DATABASE_URL.'); 