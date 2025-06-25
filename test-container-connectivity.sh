#!/bin/bash

# Test Container Connectivity Script
# This script tests network connectivity between containers

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔍 Testing container connectivity on server..."

ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "📊 Checking container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Checking Docker network..."
sudo -u deploy docker network ls | grep app

echo ""
echo "🔗 Checking network connectivity..."
echo "=== Testing app → postgres connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "nc -zv postgres 5432 || echo 'Cannot connect to postgres'"

echo ""
echo "=== Testing app → redis connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "nc -zv redis 6379 || echo 'Cannot connect to redis'"

echo ""
echo "=== Testing frontend → app connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend sh -c "nc -zv app 3002 || echo 'Cannot connect to app'"

echo ""
echo "=== Testing nginx → app connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx sh -c "nc -zv app 3002 || echo 'Cannot connect to app'"

echo ""
echo "=== Testing nginx → frontend connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx sh -c "nc -zv frontend 3000 || echo 'Cannot connect to frontend'"

echo ""
echo "🗃️ Checking database connection from app..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "node -e 'console.log(\"Testing DB connection...\"); require(\"./dist/backend/main.js\")'" || echo "Database connection test failed"

echo ""
echo "📝 Checking environment variables in app container..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "echo 'DATABASE_URL:' \$DATABASE_URL"
sudo -u deploy docker compose -f docker-compose.prod.yml exec app sh -c "echo 'VITE_PROXY_TARGET:' \$VITE_PROXY_TARGET" || true

echo ""
echo "📝 Checking environment variables in frontend container..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend sh -c "echo 'VITE_API_URL:' \$VITE_API_URL"
sudo -u deploy docker compose -f docker-compose.prod.yml exec frontend sh -c "echo 'VITE_PROXY_TARGET:' \$VITE_PROXY_TARGET"

echo ""
echo "🔍 Checking container logs for errors..."
echo "=== App container logs (last 10 lines) ==="
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=10 app

echo ""
echo "=== Frontend container logs (last 10 lines) ==="
sudo -u deploy docker compose -f docker-compose.prod.yml logs --tail=10 frontend

echo ""
echo "✅ Container connectivity test completed!"
EOF

echo ""
echo "🌐 Testing external connectivity..."
echo "API Health Check:"
curl -s https://phgcorporation.com/api/health || echo "API not accessible"

echo ""
echo "Frontend Response:"
curl -s https://phgcorporation.com | head -5 || echo "Frontend not accessible" 