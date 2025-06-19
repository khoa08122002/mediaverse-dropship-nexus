const fs = require('fs');
const path = require('path');

// Read the source package.json
const sourcePackage = JSON.parse(fs.readFileSync('src/backend/package.json', 'utf8'));

// Create production package.json
const productionPackage = {
  name: sourcePackage.name,
  version: sourcePackage.version,
  description: sourcePackage.description,
  main: "src/backend/main.js",
  scripts: {
    start: "node src/backend/main.js"
  },
  dependencies: sourcePackage.dependencies
};

// Ensure dist/backend directory exists
const distDir = path.join('dist', 'backend');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write the production package.json
fs.writeFileSync(
  path.join(distDir, 'package.json'), 
  JSON.stringify(productionPackage, null, 2)
);

console.log('Production package.json created successfully'); 