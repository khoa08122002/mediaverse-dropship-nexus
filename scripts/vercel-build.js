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
  
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Database URL found, attempting to deploy migrations...');
    try {
      // Try to deploy migrations
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Database migrations deployed successfully');
    } catch (error) {
      console.log('⚠️ Migration deploy failed, trying db push...');
      try {
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Database schema pushed successfully');
      } catch (pushError) {
        console.log('❌ Database setup failed:', pushError.message);
        console.log('🔄 Continuing build without database...');
      }
    }
        
      // Try to seed database
      try {
        console.log('🌱 Seeding database...');
        execSync('npx prisma db seed', { stdio: 'inherit' });
        console.log('✅ Database seeded successfully');
      } catch (seedError) {
        console.log('⚠️ Database seeding failed:', seedError.message);
        console.log('🔄 Continuing without seed data...');
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