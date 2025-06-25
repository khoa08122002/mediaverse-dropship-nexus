#!/bin/bash

# Fix API Connectivity Script
# This script diagnoses and fixes frontend-backend API connectivity

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔍 Diagnosing API connectivity issues..."

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "📊 Current container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Testing API endpoints..."
echo "=== External API test ==="
curl -s https://phgcorporation.com/api/health && echo " ✅ External API OK" || echo "❌ External API failed"

echo ""
echo "=== Internal API test (from nginx) ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx wget -qO- http://app:3002/api/health && echo " ✅ Internal API OK" || echo "❌ Internal API failed"

echo ""
echo "🔧 Checking CORS configuration..."
curl -s -I -H "Origin: https://phgcorporation.com" https://phgcorporation.com/api/health | grep -i "access-control" || echo "❌ No CORS headers found"

echo ""
echo "📝 Environment variables check..."
echo "--- Backend CORS_ORIGIN ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec app printenv | grep CORS_ORIGIN

echo ""
echo "--- Frontend API URLs ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend printenv | grep VITE_

echo ""
echo "🔍 Testing frontend API calls..."
echo "--- Testing internal proxy ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend sh -c "nc -zv app 3002" || echo "❌ Frontend cannot reach backend"

echo ""
echo "📊 Backend logs (recent)..."
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=10 app | grep -E "(ERROR|error|CORS|cors|API|api)" || echo "No relevant backend logs"

echo ""
echo "📊 Frontend logs (recent)..."
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=10 frontend | grep -E "(ERROR|error|API|api|proxy)" || echo "No relevant frontend logs"

echo ""
echo "🔧 Testing database tables..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count().then(count => {
  console.log('✅ Users in database:', count);
  return prisma.\$disconnect();
}).catch(err => {
  console.log('❌ Database query failed:', err.message);
});
"

echo ""
echo "🔧 Checking API routes..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec app node -e "
console.log('Testing API routes...');
const http = require('http');
const req = http.get('http://localhost:3002/api/health', (res) => {
  console.log('✅ API route responds with status:', res.statusCode);
});
req.on('error', (err) => {
  console.log('❌ API route error:', err.message);
});
setTimeout(() => process.exit(0), 2000);
"

EOF

echo ""
echo "🌐 Testing browser-level connectivity..."
echo "--- Checking if API is accessible from external ---"
curl -s -X GET https://phgcorporation.com/api/health \
  -H "Accept: application/json" \
  -H "Origin: https://phgcorporation.com" && echo " ✅ API accessible" || echo "❌ API not accessible"

echo ""
echo "--- Testing CORS preflight ---"
curl -s -X OPTIONS https://phgcorporation.com/api/health \
  -H "Origin: https://phgcorporation.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" && echo " ✅ CORS preflight OK" || echo "❌ CORS preflight failed"

echo ""
echo "✅ API connectivity diagnosis completed!"
echo ""
echo "💡 Common fixes needed:"
echo "1. Update CORS_ORIGIN in backend"
echo "2. Fix Vite proxy configuration" 
echo "3. Update frontend API URLs"
echo "4. Restart containers with new config" 