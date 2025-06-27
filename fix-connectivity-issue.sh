#!/bin/bash

echo "🔧 Fixing Frontend-Backend-Database Connectivity Issues"
echo "====================================================="

# Stop all containers
echo "1. Stopping all containers..."
docker compose -f docker-compose.prod.yml down

# Start database first and wait
echo "2. Starting database..."
docker compose -f docker-compose.prod.yml up -d postgres redis
sleep 15

# Start backend and wait
echo "3. Starting backend..."
docker compose -f docker-compose.prod.yml up -d app
sleep 10

# Check backend health
echo "4. Checking backend health..."
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml exec app curl -f http://localhost:3002/api/health 2>/dev/null; then
        echo "✅ Backend is healthy"
        break
    fi
    echo "⏳ Waiting for backend... ($i/30)"
    sleep 2
done

# Start frontend
echo "5. Starting frontend..."
docker compose -f docker-compose.prod.yml up -d frontend
sleep 10

# Start nginx
echo "6. Starting nginx..."
docker compose -f docker-compose.prod.yml up -d nginx

# Final check
echo "7. Final connectivity check..."
sleep 5

echo ""
echo "📊 Container Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Testing connections..."

# Test backend health
echo "- Backend health: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/health 2>/dev/null || echo 'FAILED')"

# Test frontend
echo "- Frontend: $(curl -s -o /dev/null -w "%{http_code}" https://phgcorporation.com 2>/dev/null || echo 'FAILED')"

echo ""
echo "✅ Connectivity fix completed!"
echo ""
echo "🌐 Test your website: https://phgcorporation.com"
echo "🔧 API Health: https://phgcorporation.com/api/health"
echo ""
echo "📝 If issues persist, check logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f app"
echo "   docker compose -f docker-compose.prod.yml logs -f frontend" 