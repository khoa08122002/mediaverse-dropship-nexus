#!/bin/bash

# Apply Navigation Fix Script
# This script uploads the fixed AuthContext and tests admin navigation

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔧 Applying navigation fix..."

# Copy updated AuthContext to server
echo "📤 Uploading fixed AuthContext.tsx..."
scp src/contexts/AuthContext.tsx ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/src/contexts/

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "1️⃣ Verifying user roles in database..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.findMany().then(users => {
  console.log('=== Users in database ===');
  users.forEach(user => {
    console.log(\`📧 \${user.email} | 🔑 \${user.role} | 📊 \${user.status}\`);
  });
  return prisma.\$disconnect();
}).catch(err => {
  console.log('❌ Database query failed:', err.message);
});
"

echo ""
echo "2️⃣ Testing login response structure..."
curl -s -X POST https://phgcorporation.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@phg.com","password":"admin123"}' | \
  jq '{user: .user.role, hasAccessToken: (.accessToken != null)}' || echo "Login test failed"

echo ""
echo "3️⃣ Rebuilding frontend with navigation fix..."
sudo -u deploy docker compose -f docker-compose.prod.yml build frontend

echo ""
echo "4️⃣ Restarting frontend..."
sudo -u deploy docker compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "5️⃣ Waiting for frontend to start..."
sleep 10

echo ""
echo "6️⃣ Testing frontend access..."
curl -s https://phgcorporation.com | head -5 && echo " ✅ Frontend accessible"

echo ""
echo "7️⃣ Container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

EOF

echo ""
echo "✅ Navigation fix applied!"
echo ""
echo "🎯 Testing steps:"
echo "1. Go to: https://phgcorporation.com/login"
echo "2. Login with: admin@phg.com / admin123"
echo "3. Open Browser Console (F12) to see debug logs"
echo "4. Should see: User role, navigation attempts, and auto-redirect"
echo ""
echo "Expected behavior:"
echo "- Should navigate to /admin after successful login"
echo "- If navigation fails, will force redirect after 1 second"
echo "- Console will show detailed debug information" 