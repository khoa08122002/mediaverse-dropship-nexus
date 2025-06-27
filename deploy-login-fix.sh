#!/bin/bash

echo "=== DEPLOY LOGIN REDIRECT FIX ==="

# Add and commit changes
git add src/pages/Login.tsx src/contexts/AuthContext.tsx
git commit -m "Fix login redirect conflict - remove duplicate navigation logic"

# Push to repository
echo "Pushing changes to repository..."
git push origin main

echo "✅ Changes pushed to repository"
echo ""

# Connect to VPS and deploy
echo "=== DEPLOYING TO VPS ==="
ssh root@198.38.91.102 << 'EOF'
cd /home/deploy/app

echo "Pulling latest changes..."
git pull origin main

echo "Restarting frontend container..."
docker compose -f docker-compose.prod.yml restart frontend

echo "Waiting for containers to be ready..."
sleep 10

echo "Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo "✅ LOGIN FIX DEPLOYED SUCCESSFULLY!"
echo ""
echo "Please test login at: https://phgcorporation.com/login"
echo "Use: admin@phg.com / password"

EOF

echo "=== DEPLOYMENT COMPLETE ===" 