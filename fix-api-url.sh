#!/bin/bash

# Fix API URL Script  
# This script fixes the incorrect API base URL and updates frontend

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔧 Fixing API URL configuration..."

# Copy updated environment.ts to server
echo "📤 Uploading fixed environment.ts..."
scp src/utils/environment.ts ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/src/utils/

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "1️⃣ Verifying the fix..."
echo "--- Updated environment.ts content ---"
grep -A 5 -B 5 "getAPIBaseURL" src/utils/environment.ts

echo ""
echo "2️⃣ Rebuilding frontend with fixed API URL..."
sudo -u deploy docker compose -f docker-compose.prod.yml build frontend

echo ""
echo "3️⃣ Restarting frontend container..."
sudo -u deploy docker compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "4️⃣ Waiting for frontend to start..."
sleep 10

echo ""
echo "5️⃣ Testing API endpoints..."
echo "--- Health check ---"
curl -s https://phgcorporation.com/api/health && echo " ✅ API health OK" || echo "❌ API health failed"

echo ""
echo "--- Auth endpoint test ---"
curl -s -X POST https://phgcorporation.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}' \
  | head -100 && echo " ✅ Auth endpoint responding" || echo "❌ Auth endpoint failed"

echo ""
echo "6️⃣ Container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

echo ""
echo "7️⃣ Recent frontend logs..."
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=10 frontend

EOF

echo ""
echo "🌐 Final external tests..."
echo "--- API health from external ---"
curl -s https://phgcorporation.com/api/health && echo " ✅ External API OK" || echo "❌ External API failed"

echo ""
echo "--- CORS test ---"  
curl -s -I -H "Origin: https://phgcorporation.com" https://phgcorporation.com/api/health | grep -i "access-control" && echo " ✅ CORS headers present" || echo "❌ No CORS headers"

echo ""
echo "✅ API URL fix completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Clear browser cache (Ctrl+Shift+R)"
echo "2. Test login at https://phgcorporation.com/login"
echo "3. Use credentials: admin@phg.com / admin123" 