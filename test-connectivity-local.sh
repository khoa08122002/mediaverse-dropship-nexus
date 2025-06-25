#!/bin/bash

# Local Container Connectivity Test Script
# Run this directly on the server

echo "🔍 Testing container connectivity..."

echo "📊 Checking container status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Checking Docker network..."
sudo -u deploy docker network ls | grep app
sudo -u deploy docker network inspect $(sudo -u deploy docker compose -f docker-compose.prod.yml ps --format "table {{.Service}}" | grep -v SERVICE | head -1 | xargs -I {} sudo -u deploy docker compose -f docker-compose.prod.yml ps --format "table {{.Networks}}" | grep -v NETWORKS | head -1)

echo ""
echo "🔗 Testing network connectivity..."

echo "=== Testing app → postgres connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "ping -c 1 postgres" || echo "❌ Cannot ping postgres"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "nc -zv postgres 5432" || echo "❌ Cannot connect to postgres:5432"

echo ""
echo "=== Testing app → redis connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "ping -c 1 redis" || echo "❌ Cannot ping redis"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "nc -zv redis 6379" || echo "❌ Cannot connect to redis:6379"

echo ""
echo "=== Testing frontend → app connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T frontend sh -c "ping -c 1 app" || echo "❌ Cannot ping app"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T frontend sh -c "curl -s http://app:3002/api/health || echo 'API not responding'"

echo ""
echo "=== Testing nginx → app connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T nginx sh -c "nc -zv app 3002" || echo "❌ Cannot connect to app:3002"

echo ""
echo "=== Testing nginx → frontend connection ==="
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T nginx sh -c "nc -zv frontend 3000" || echo "❌ Cannot connect to frontend:3000"

echo ""
echo "📝 Checking environment variables..."
echo "--- App container environment ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app printenv | grep -E "(DATABASE_URL|NODE_ENV|PORT)"

echo ""
echo "--- Frontend container environment ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T frontend printenv | grep -E "(VITE_|NODE_ENV)"

echo ""
echo "🔍 Testing actual API endpoints..."
echo "--- Internal API test (app container) ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "curl -s http://localhost:3002/api/health || echo 'Internal API not responding'"

echo ""
echo "--- Backend → Database test ---"
sudo -u deploy docker compose -f docker-compose.prod.yml exec -T app sh -c "node -e \"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Database connected successfully');
  return prisma.\$disconnect();
}).catch(err => {
  console.log('❌ Database connection failed:', err.message);
});
\" || echo 'Database test script failed'"

echo ""
echo "🌐 External connectivity test..."
curl -s https://phgcorporation.com/api/health && echo " ✅ External API working" || echo "❌ External API not working"

echo ""
echo "✅ Container connectivity test completed!" 