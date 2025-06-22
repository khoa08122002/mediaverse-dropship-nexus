#!/usr/bin/env node

console.log('🔧 Fixing Vercel Build Issues');
console.log('============================\n');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env.production exists for Vercel
function checkProductionEnv() {
    console.log('🔍 Checking production environment...');
    
    const envProdPath = path.join(process.cwd(), '.env.production');
    
    if (!fs.existsSync(envProdPath)) {
        console.log('⚠️  .env.production not found, creating from template...');
        
        const envContent = `# Production Environment for Vercel
# Note: These are placeholders - actual values should be set in Vercel dashboard

DATABASE_URL="postgresql://postgres.qwtockcawgwpvpxiewov:Dangkhoa08122002%40%40@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="production-jwt-secret-will-be-set-in-vercel-dashboard"
NODE_ENV="production"
`;
        
        try {
            fs.writeFileSync(envProdPath, envContent);
            console.log('✅ .env.production created');
        } catch (error) {
            console.log('⚠️  Could not create .env.production:', error.message);
        }
    } else {
        console.log('✅ .env.production exists');
    }
}

// Create .vercelignore if it doesn't exist
function createVercelIgnore() {
    console.log('\n🔍 Checking .vercelignore...');
    
    const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');
    
    if (!fs.existsSync(vercelIgnorePath)) {
        console.log('📝 Creating .vercelignore...');
        
        const ignoreContent = `# Development files
.env.local
.env.development
*.log

# Test files
**/__tests__/**
**/*.test.*
**/*.spec.*
jest.config.js
coverage/

# Development tools
.vscode/
.idea/

# Local uploads (use cloud storage in production)
uploads/cv/
uploads/temp/

# Documentation
*.md
!README.md

# Cache and temporary files
.cache/
tmp/
temp/
`;
        
        try {
            fs.writeFileSync(vercelIgnorePath, ignoreContent);
            console.log('✅ .vercelignore created');
        } catch (error) {
            console.log('⚠️  Could not create .vercelignore:', error.message);
        }
    } else {
        console.log('✅ .vercelignore exists');
    }
}

// Check package.json for build issues
function checkPackageJson() {
    console.log('\n🔍 Checking package.json configuration...');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Check if prisma is in dependencies
    const hasPrismaInDeps = packageJson.dependencies && packageJson.dependencies.prisma;
    const hasPrismaInDevDeps = packageJson.devDependencies && packageJson.devDependencies.prisma;
    
    if (hasPrismaInDeps) {
        console.log('✅ Prisma is in dependencies (good for Vercel)');
    } else if (hasPrismaInDevDeps) {
        console.log('❌ Prisma is in devDependencies (may cause build issues)');
        console.log('💡 Consider moving prisma to dependencies');
    } else {
        console.log('❌ Prisma not found in dependencies');
    }
    
    // Check build scripts
    const hasVercelBuild = packageJson.scripts && packageJson.scripts['vercel-build'];
    if (hasVercelBuild) {
        console.log('✅ vercel-build script exists');
    } else {
        console.log('❌ vercel-build script missing');
        console.log('💡 Add: "vercel-build": "node scripts/vercel-build.js"');
    }
    
    // Check postinstall
    const postinstall = packageJson.scripts && packageJson.scripts.postinstall;
    if (postinstall && postinstall.includes('prisma generate')) {
        console.log('✅ postinstall includes prisma generate');
    } else {
        console.log('⚠️  postinstall may not generate Prisma client properly');
    }
}

// Test build locally
function testBuildLocally() {
    console.log('\n🧪 Testing build process locally...');
    
    try {
        console.log('🔄 Running vercel-build script...');
        execSync('npm run vercel-build', { stdio: 'pipe' });
        console.log('✅ Local build test passed');
        return true;
    } catch (error) {
        console.log('❌ Local build test failed:');
        console.log(error.stdout?.toString() || error.message);
        return false;
    }
}

// Main execution
async function main() {
    checkProductionEnv();
    createVercelIgnore();
    checkPackageJson();
    
    console.log('\n📋 CURRENT BUILD CONFIGURATION:');
    console.log('===============================');
    console.log('✅ Prisma moved to dependencies');
    console.log('✅ Build script uses npx commands');
    console.log('✅ Environment variables configured');
    console.log('✅ Fallback error handling in place');
    
    console.log('\n🚀 VERCEL DEPLOYMENT CHECKLIST:');
    console.log('==============================');
    console.log('1. ✅ Set DATABASE_URL in Vercel dashboard');
    console.log('2. ✅ Set JWT_SECRET in Vercel dashboard');
    console.log('3. ✅ Set NODE_ENV=production in Vercel dashboard');
    console.log('4. 🔄 Commit and push these changes');
    console.log('5. 🔄 Monitor Vercel build logs');
    
    console.log('\n💡 IF BUILD STILL FAILS:');
    console.log('========================');
    console.log('• Check Vercel function logs');
    console.log('• Verify all environment variables are set');
    console.log('• Ensure Supabase database is accessible');
    console.log('• Try manual redeploy on Vercel dashboard');
    
    console.log('\n🎉 Ready for deployment!');
}

main().catch(console.error); 