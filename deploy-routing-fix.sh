#!/bin/bash

echo "=== DEPLOY ROUTING FIX ==="

# Connect to VPS and deploy
ssh root@198.38.91.102 << 'EOF'
cd /home/deploy/app

echo "Pulling latest routing fixes..."
git pull origin main

echo "Restarting frontend container to apply changes..."
docker compose -f docker-compose.prod.yml restart frontend

echo "Waiting for frontend to be ready..."
sleep 15

echo "Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo "✅ ROUTING FIX DEPLOYED!"
echo ""
echo "Fixed issues:"
echo "- ❌ Removed SpeedInsights (causing JS errors)"  
echo "- ✅ Fixed admin routing (moved outside AppLayout)"
echo "- ✅ Admin is now standalone route like Login"
echo ""
echo "🧪 TEST LOGIN NOW:"
echo "1. Go to: https://phgcorporation.com/login"
echo "2. Login: admin@phg.com / password"  
echo "3. Should redirect to: https://phgcorporation.com/admin"
echo ""

EOF

echo "=== DEPLOYMENT COMPLETE ===" 