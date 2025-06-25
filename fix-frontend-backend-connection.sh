#!/bin/bash

# Fix Frontend-Backend Connection Script
# This script fixes common connectivity issues

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔧 Fixing frontend-backend connectivity..."

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "1️⃣ Checking current configuration..."
echo "--- Current CORS_ORIGIN ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec app printenv | grep CORS_ORIGIN || echo "CORS_ORIGIN not set"

echo ""
echo "--- Current VITE config ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend printenv | grep VITE_ || echo "VITE vars not found"

echo ""
echo "2️⃣ Updating .env file with correct CORS..."
# Backup current .env
cp .env .env.backup.$(date +%s)

# Update CORS_ORIGIN in .env
sed -i 's|CORS_ORIGIN=.*|CORS_ORIGIN=https://phgcorporation.com|g' .env

# Ensure all required env vars exist
if ! grep -q "CORS_ORIGIN=" .env; then
    echo "CORS_ORIGIN=https://phgcorporation.com" >> .env
fi

if ! grep -q "VITE_API_URL=" .env; then
    echo "VITE_API_URL=https://phgcorporation.com/api" >> .env
fi

if ! grep -q "VITE_PROXY_TARGET=" .env; then
    echo "VITE_PROXY_TARGET=http://app:3002" >> .env
fi

echo "✅ Updated .env file"
cat .env | grep -E "(CORS|VITE_)"

echo ""
echo "3️⃣ Checking vite.config.ts proxy settings..."
if ! grep -q "proxy:" vite.config.ts; then
    echo "❌ Vite proxy configuration missing!"
    echo "Adding proxy configuration..."
    
    # Backup vite config
    cp vite.config.ts vite.config.ts.backup.$(date +%s)
    
    # This will be handled by copying updated file from local
    echo "⚠️  Need to update vite.config.ts with proper proxy settings"
fi

echo ""
echo "4️⃣ Restarting backend with new CORS settings..."
sudo -u deploy docker compose -f docker-compose.prod.yml restart app

echo ""
echo "5️⃣ Rebuilding and restarting frontend..."
sudo -u deploy docker compose -f docker-compose.prod.yml build frontend
sudo -u deploy docker compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "6️⃣ Testing connections..."
sleep 5

echo "--- Testing backend API ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx wget -qO- http://app:3002/api/health && echo " ✅ Backend API OK" || echo "❌ Backend API failed"

echo ""
echo "--- Testing frontend access ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx wget -qO- http://frontend:3000 | head -2 && echo " ✅ Frontend OK" || echo "❌ Frontend failed"

echo ""
echo "7️⃣ Final container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

EOF

echo ""
echo "🌐 Testing external connectivity..."
curl -s https://phgcorporation.com/api/health && echo " ✅ External API working" || echo "❌ External API not working"

echo ""
echo "✅ Frontend-backend connection fix completed!"
echo ""
echo "🔍 Next steps:"
echo "1. Test website at https://phgcorporation.com"
echo "2. Check browser console for any remaining errors"
echo "3. Test login/API features" 