#!/usr/bin/env node

console.log('🔍 Validating Environment Variables...');

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET'
];

const optionalVars = [
  'VITE_TINYMCE_API_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

let hasErrors = false;

console.log('\n📋 Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName === 'DATABASE_URL' 
      ? value.substring(0, 20) + '...' 
      : value.substring(0, 10) + '...';
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = value.substring(0, 10) + '...';
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`⚠️  ${varName}: Not set`);
  }
});

if (process.env.DATABASE_URL) {
  console.log('\n🔗 Database URL Analysis:');
  const url = process.env.DATABASE_URL;
  
  if (url.includes('localhost')) {
    console.log('⚠️  WARNING: DATABASE_URL contains "localhost" - this will not work on Vercel production');
    console.log('   Please use a cloud database service like Supabase, Neon, or Railway');
  } else {
    console.log('✅ DATABASE_URL appears to be a cloud database');
  }
  
  if (url.startsWith('postgresql://')) {
    console.log('✅ PostgreSQL connection string format is correct');
  } else {
    console.log('❌ DATABASE_URL should start with "postgresql://"');
    hasErrors = true;
  }
}

console.log('\n🏗️  Build Environment Check:');
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

if (hasErrors) {
  console.log('\n❌ Environment validation FAILED');
  console.log('\n📝 To fix:');
  console.log('1. Go to Vercel Dashboard → Project → Settings → Environment Variables');
  console.log('2. Add missing required variables');
  console.log('3. Redeploy your project');
  process.exit(1);
} else {
  console.log('\n✅ Environment validation PASSED');
  console.log('Your Vercel environment variables are properly configured!');
  process.exit(0);
} 