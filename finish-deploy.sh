#!/bin/bash
# PHG Corporation - Finish Deployment Script
# Fix Docker Compose commands and complete deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    error "docker-compose.prod.yml not found. Please cd to /home/deploy/app"
    exit 1
fi

log "🚀 Finishing PHG Corporation deployment..."

# Step 1: Build and start services
log "🐳 Building and starting Docker services..."

# Stop any existing containers
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build all services
log "Building images..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start database and redis first
log "Starting database and Redis..."
docker compose -f docker-compose.prod.yml up -d postgres redis

# Wait for database to be ready
log "⏳ Waiting for database to be ready..."
sleep 30

# Check database connection
log "🔍 Checking database connection..."
for i in {1..10}; do
    if docker compose -f docker-compose.prod.yml exec postgres pg_isready -U phg_user -d phg_corporation; then
        log "✅ Database is ready"
        break
    else
        warning "Database not ready yet, waiting... ($i/10)"
        sleep 5
    fi
done

# Run database migrations
log "📊 Running database migrations..."
docker compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy

# Seed database
log "🌱 Seeding database..."
docker compose -f docker-compose.prod.yml run --rm app node simple-seed.js

# Start all services
log "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait a bit for services to start
sleep 15

# Step 2: Verify deployment
log "🔍 Verifying deployment..."

# Show running containers
echo ""
info "Running containers:"
docker compose -f docker-compose.prod.yml ps

# Test API endpoints
echo ""
info "Testing API endpoints..."

# Test health endpoint
if curl -f -s "http://localhost:3002/api/health" > /dev/null; then
    log "✅ API health check passed"
else
    warning "⚠️ API health check failed"
fi

# Test database connection via API
if curl -f -s "http://localhost:3002/api/health" | grep -q "ok"; then
    log "✅ Database connection through API working"
else
    warning "⚠️ Database connection through API may have issues"
fi

# Step 3: Show deployment info
echo ""
log "🎉 Deployment completed!"
echo ""
echo "📋 Service Information:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:3002"
echo "  - API Health: http://localhost:3002/api/health"
echo ""

# Check SSL certificates
if [ -d "/etc/letsencrypt/live/phgcorporation.com" ]; then
    info "SSL certificates exist - HTTPS should work once DNS is correct"
else
    warning "No SSL certificates found - only HTTP available"
fi

# Check DNS
echo ""
info "DNS Status:"
CURRENT_IP=$(nslookup phgcorporation.com | grep "Address:" | tail -1 | awk '{print $2}')
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")

echo "  - Domain points to: $CURRENT_IP"
echo "  - VPS IP address: $VPS_IP"

if [ "$CURRENT_IP" != "$VPS_IP" ]; then
    warning "⚠️ DNS not pointing to this server!"
    echo ""
    echo "🔧 To fix DNS, update your domain provider:"
    echo "  A    phgcorporation.com     -> $VPS_IP"
    echo "  A    www.phgcorporation.com -> $VPS_IP"
    echo ""
fi

echo "🔑 Login credentials:"
echo "  - Admin: admin@phg.com / admin123"
echo "  - HR: hr@phg.com / hr123"
echo "  - User: user@phg.com / user123"
echo ""

echo "🛠️ Management commands:"
echo "  - View logs: docker compose -f docker-compose.prod.yml logs -f"
echo "  - Restart: docker compose -f docker-compose.prod.yml restart"
echo "  - Stop: docker compose -f docker-compose.prod.yml down"
echo "  - Update: ./update-app.sh"
echo ""

# Final status
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log "🚀 Application is running!"
    if [ "$CURRENT_IP" = "$VPS_IP" ]; then
        log "🌐 Access at: https://phgcorporation.com"
    else
        log "🌐 Access at: http://$VPS_IP:3000 (until DNS is fixed)"
    fi
else
    error "❌ Some services may not be running properly"
    echo "Run: docker compose -f docker-compose.prod.yml logs"
fi 