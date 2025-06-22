#!/usr/bin/env node

console.log('🚀 Quick Deploy Script (No Database Migration)');
console.log('==============================================\n');

const { execSync } = require('child_process');

try {
  console.log('📦 Installing dependencies...');
  
  console.log('🔧 Generating Prisma Client...');
  execSync('npx prisma generate --no-hints', { stdio: 'inherit' });
  
  console.log('⏭️ Skipping database migration for quick deployment');
  console.log('💡 Database migration can be run manually later');
  
  console.log('🏗️ Building frontend...');
  execSync('npm run build:frontend', { stdio: 'inherit' });
  
  console.log('✅ Quick build completed successfully!');
  console.log('\n📋 Post-deployment steps:');
  console.log('1. Run migration manually: npm run migrate:safe');
  console.log('2. Or set up database via API calls');
  console.log('3. Monitor application logs for any issues');
  
} catch (error) {
  console.error('❌ Quick build failed:', error.message);
  process.exit(1);
} 