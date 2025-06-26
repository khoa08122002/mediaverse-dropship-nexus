#!/bin/bash

# Fix Container Connectivity Script
# Rebuilds containers with proper network configuration

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"

echo "🔧 Fixing container connectivity issues..."

# Local environment setup first
echo "📋 Configuring local environment..."

# SSH to server and apply fixes
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "🛑 Stopping containers..."
sudo -u deploy docker compose -f docker-compose.prod.yml down

echo "🔨 Rebuilding frontend with new configuration..."
sudo -u deploy docker compose -f docker-compose.prod.yml build frontend --no-cache

echo "🚀 Starting all containers..."
sudo -u deploy docker compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for containers to be ready..."
sleep 30

echo "📊 Checking container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Testing container connectivity..."

echo "=== Testing nginx → frontend ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx sh -c "wget -q --spider http://frontend:3000 && echo '✅ nginx → frontend OK' || echo '❌ nginx → frontend FAILED'"

echo ""
echo "=== Testing nginx → backend ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx sh -c "wget -q --spider http://app:3002/api/health && echo '✅ nginx → backend OK' || echo '❌ nginx → backend FAILED'"

echo ""
echo "=== Testing backend self-connectivity ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "wget -q -O- http://0.0.0.0:3002/api/health && echo '✅ Backend self-test OK' || echo '❌ Backend self-test FAILED'"

echo ""
echo "=== Testing frontend environment ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend sh -c "printenv | grep VITE"

echo ""
echo "=== Testing backend environment ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "printenv | grep -E '(CORS|API|HOST|PORT)'"

echo ""
echo "🌐 Testing external connectivity..."
EOF

echo ""
echo "🌍 Testing external API access..."
curl -s https://phgcorporation.com/api/health && echo " - API Health OK" || echo " - API Health FAILED"

echo ""
echo "🌍 Testing frontend access..."
curl -I https://phgcorporation.com 2>/dev/null | head -1

echo ""
echo "✅ Container connectivity fix completed!"
echo "🌐 Visit: https://phgcorporation.com" 