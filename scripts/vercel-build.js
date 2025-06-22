#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');

try {
  console.log('📦 Installing dependencies...');
  
  console.log('🔍 Validating environment variables...');
  try {
    execSync('node scripts/validate-env.js', { stdio: 'inherit' });
  } catch (envError) {
    console.log('⚠️ Environment validation failed, but continuing build...');
  }
  
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Check if migration should be skipped
  if (process.env.SKIP_DB_MIGRATION === 'true') {
    console.log('⏭️ SKIP_DB_MIGRATION=true, skipping database setup');
  } else if (process.env.DATABASE_URL) {
    console.log('🗄️ Database URL found, running safe migration...');
    try {
      execSync('node scripts/safe-migrate.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️ Safe migration script had issues, but continuing...');
    }
  } else {
    console.log('⚠️ No DATABASE_URL found, skipping database setup');
  }
  
  console.log('🏗️ Building frontend...');
  execSync('npm run build:frontend', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 