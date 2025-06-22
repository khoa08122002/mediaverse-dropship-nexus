#!/usr/bin/env node

console.log('🔧 SPA Routing Fix for Vercel');
console.log('=============================\n');

const fs = require('fs');
const path = require('path');

function fixVercelConfig() {
    console.log('🔍 Checking vercel.json configuration...');
    
    const vercelPath = path.join(process.cwd(), 'vercel.json');
    
    if (!fs.existsSync(vercelPath)) {
        console.log('❌ vercel.json not found');
        return false;
    }
    
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    
    // Check routes order
    const routes = vercelConfig.routes || [];
    console.log('📋 Current routes:');
    routes.forEach((route, i) => {
        console.log(`  ${i + 1}. ${route.src} → ${route.dest}`);
    });
    
    // Verify correct order
    const staticAssetRoute = routes.find(r => r.src.includes('\\.(js|'));
    const catchAllRoute = routes.find(r => r.src === '/(.*)' || r.src === '/((?!api|assets).*)');
    
    if (staticAssetRoute && catchAllRoute) {
        const staticIndex = routes.indexOf(staticAssetRoute);
        const catchAllIndex = routes.indexOf(catchAllRoute);
        
        if (staticIndex > catchAllIndex) {
            console.log('⚠️  Route order issue: catch-all comes before static assets');
            return false;
        } else {
            console.log('✅ Route order is correct');
        }
    }
    
    return true;
}

function fixViteConfig() {
    console.log('\n🔍 Checking vite.config.ts...');
    
    const vitePath = path.join(process.cwd(), 'vite.config.ts');
    
    if (!fs.existsSync(vitePath)) {
        console.log('❌ vite.config.ts not found');
        return false;
    }
    
    const viteContent = fs.readFileSync(vitePath, 'utf8');
    
    // Check for base path
    if (viteContent.includes('base:')) {
        console.log('✅ Base path configured in Vite');
    } else {
        console.log('ℹ️  No base path in Vite config (this is usually fine)');
    }
    
    // Check build output
    if (viteContent.includes("outDir: 'dist'")) {
        console.log('✅ Output directory set to dist');
    } else {
        console.log('⚠️  Output directory might not be set correctly');
    }
    
    return true;
}

function createDistStructureCheck() {
    console.log('\n🔍 Checking expected dist structure...');
    
    const distPath = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distPath)) {
        console.log('⚠️  dist folder not found (run build first)');
        return false;
    }
    
    const indexPath = path.join(distPath, 'index.html');
    const assetsPath = path.join(distPath, 'assets');
    
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found in dist');
    } else {
        console.log('❌ index.html missing in dist');
    }
    
    if (fs.existsSync(assetsPath)) {
        console.log('✅ assets folder found in dist');
        const assets = fs.readdirSync(assetsPath);
        console.log(`   Found ${assets.length} asset files`);
    } else {
        console.log('❌ assets folder missing in dist');
    }
    
    return true;
}

function showCommonSolutions() {
    console.log('\n💡 COMMON SPA ROUTING SOLUTIONS:');
    console.log('===============================');
    
    console.log('1. ✅ Fix vercel.json routes order (DONE)');
    console.log('   - Static assets routes BEFORE catch-all');
    console.log('   - Proper regex for file extensions');
    
    console.log('\n2. 🔧 Headers for proper MIME types:');
    console.log('   - JavaScript files: application/javascript');
    console.log('   - CSS files: text/css');
    console.log('   - JSON files: application/json');
    
    console.log('\n3. 📁 Ensure proper dist structure:');
    console.log('   dist/');
    console.log('   ├── index.html');
    console.log('   ├── assets/');
    console.log('   │   ├── *.js');
    console.log('   │   ├── *.css');
    console.log('   │   └── *.png, *.svg, etc.');
    
    console.log('\n4. 🚀 Test routes after deployment:');
    console.log('   - https://domain.com/ → index.html');
    console.log('   - https://domain.com/dashboard → index.html');
    console.log('   - https://domain.com/assets/main.js → main.js');
    console.log('   - https://domain.com/api/health → API response');
}

function showDebuggingSteps() {
    console.log('\n🐛 DEBUGGING STEPS:');
    console.log('==================');
    
    console.log('1. Check browser DevTools → Network tab');
    console.log('   - Look for failed JS/CSS requests');
    console.log('   - Check response headers');
    
    console.log('\n2. Test direct asset URLs:');
    console.log('   - https://your-domain.vercel.app/assets/main.js');
    console.log('   - Should return JS, not HTML');
    
    console.log('\n3. Check Vercel deployment logs:');
    console.log('   - Build output');
    console.log('   - Function logs');
    
    console.log('\n4. Test locally first:');
    console.log('   - npm run build');
    console.log('   - npx serve dist');
    console.log('   - Test SPA routing');
}

// Main execution
async function main() {
    console.log('🔍 Diagnosing SPA routing issues...\n');
    
    const vercelOk = fixVercelConfig();
    const viteOk = fixViteConfig();
    const distOk = createDistStructureCheck();
    
    console.log('\n📋 DIAGNOSIS SUMMARY:');
    console.log('====================');
    console.log(`Vercel config: ${vercelOk ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`Vite config: ${viteOk ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`Dist structure: ${distOk ? '✅ OK' : '⚠️  NEEDS BUILD'}`);
    
    showCommonSolutions();
    showDebuggingSteps();
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('==============');
    console.log('1. Commit and push the vercel.json changes');
    console.log('2. Wait for Vercel to redeploy');
    console.log('3. Test the fixed routing');
    console.log('4. If issues persist, check browser DevTools');
}

main().catch(console.error); 