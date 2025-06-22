#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fix Build Assets for Production');
console.log('=================================\n');

function checkDistFolder() {
    console.log('🔍 Checking dist folder...');
    
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
        console.log('❌ dist folder not found');
        return false;
    }
    
    const indexPath = path.join(distPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log('❌ dist/index.html not found');
        return false;
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    console.log('📄 Production index.html content:');
    console.log(indexContent);
    
    // Check if it still has dev references
    if (indexContent.includes('src="/src/main.tsx"')) {
        console.log('❌ Found development references in production index.html');
        console.log('💡 This indicates Vite build is not working properly');
        return false;
    }
    
    if (indexContent.includes('/assets/') && indexContent.includes('type="module"')) {
        console.log('✅ Production index.html looks correct');
        return true;
    }
    
    console.log('⚠️  Production index.html may have issues');
    return false;
}

function fixRootIndexHtml() {
    console.log('\n🔧 Checking root index.html...');
    
    const rootIndexPath = path.join(process.cwd(), 'index.html');
    const rootContent = fs.readFileSync(rootIndexPath, 'utf8');
    
    console.log('Current root index.html script tag:');
    const scriptMatch = rootContent.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/);
    if (scriptMatch) {
        console.log('Found:', scriptMatch[0]);
    }
    
    // This is the template file - should be fine for Vite to process
    if (rootContent.includes('src="/src/main.tsx"')) {
        console.log('✅ Root index.html has correct development reference (this is normal)');
        console.log('💡 Vite should transform this during build');
    }
}

function createManualIndexHtml() {
    console.log('\n🛠️  Creating manual production index.html...');
    
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
    }
    
    // Look for built assets
    const assetsPath = path.join(distPath, 'assets');
    if (!fs.existsSync(assetsPath)) {
        console.log('⚠️  Assets folder not found, creating minimal version');
        
        const minimalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PHG Corporation - AI Marketing & E-commerce Solutions</title>
    <meta name="description" content="Next-generation AI Marketing and E-commerce solutions for modern businesses" />
  </head>
  <body>
    <div id="root"></div>
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1>⚡ Application Loading...</h1>
      <p>Building assets, please wait...</p>
      <script>
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      </script>
    </div>
  </body>
</html>`;
        
        const indexPath = path.join(distPath, 'index.html');
        fs.writeFileSync(indexPath, minimalHtml);
        console.log('✅ Created minimal index.html');
        return;
    }
    
    // Find CSS and JS files
    const assets = fs.readdirSync(assetsPath);
    const cssFile = assets.find(f => f.endsWith('.css'));
    const jsFile = assets.find(f => f.endsWith('.js') && !f.includes('vendor'));
    
    console.log('Found assets:', { cssFile, jsFile });
    
    if (cssFile && jsFile) {
        const productionHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PHG Corporation - AI Marketing & E-commerce Solutions</title>
    <meta name="description" content="Next-generation AI Marketing and E-commerce solutions for modern businesses" />
    <link rel="preconnect" href="https://prod.spline.design" />
    <link rel="dns-prefetch" href="https://prod.spline.design" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;
        
        const indexPath = path.join(distPath, 'index.html');
        fs.writeFileSync(indexPath, productionHtml);
        console.log('✅ Created production index.html with proper asset references');
    }
}

function showViteBuildTips() {
    console.log('\n💡 VITE BUILD TROUBLESHOOTING:');
    console.log('=============================');
    console.log('1. Ensure vite is in dependencies (not devDependencies)');
    console.log('2. Check vite.config.ts for correct build settings');
    console.log('3. Run build locally to test: npm run build:frontend');
    console.log('4. Check if @vitejs/plugin-react is properly installed');
    console.log('\n🔧 Quick fixes to try:');
    console.log('• npm install @vitejs/plugin-react --save');
    console.log('• npm run build:frontend (local test)');
    console.log('• Check for any TypeScript/build errors');
}

// Main execution
async function main() {
    const distOk = checkDistFolder();
    fixRootIndexHtml();
    
    if (!distOk) {
        console.log('\n🛠️  Dist folder has issues, attempting manual fix...');
        createManualIndexHtml();
    }
    
    showViteBuildTips();
    
    console.log('\n🚀 DEPLOYMENT STRATEGY:');
    console.log('======================');
    console.log('1. Fix vite dependencies');
    console.log('2. Ensure proper build process');
    console.log('3. Verify vercel.json routes are correct');
    console.log('4. Test production build locally');
    console.log('5. Deploy with proper asset references');
}

main().catch(console.error); 