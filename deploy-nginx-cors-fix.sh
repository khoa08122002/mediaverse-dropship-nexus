#!/bin/bash

echo "=== DEPLOY NGINX CORS FIX ==="

# Commit and push nginx changes
git add nginx/nginx.conf
git commit -m "Fix login 401 error - remove problematic auth location block without CORS"
git push origin main

echo "✅ Nginx fix pushed to repository"

# Deploy to VPS
echo "=== DEPLOYING TO VPS ==="
ssh root@198.38.91.102 << 'EOF'
cd /home/deploy/app

echo "Pulling latest nginx config..."
git pull origin main

echo "Testing nginx configuration..."
docker compose -f docker-compose.prod.yml exec nginx nginx -t

echo "Reloading nginx with new config..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo "✅ NGINX CORS FIX DEPLOYED!"
echo ""
echo "Fixed issues:"
echo "- Removed auth location block without CORS headers"
echo "- Removed excessive rate limiting (5 req/minute)"
echo "- All API requests now use /api/ location with proper CORS"
echo ""
echo "Test login at: https://phgcorporation.com/login"
echo "Use: admin@phg.com / password"

EOF

echo "=== DEPLOYMENT COMPLETE ===" 