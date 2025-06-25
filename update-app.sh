#!/bin/bash

# PHG Corporation Production Update Script
# Use this script to update your application on VPS

set -e

echo "🔄 PHG Corporation Production Update"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Create backup before update
create_backup() {
    print_status "Creating backup before update..."
    
    BACKUP_DIR="./backups"
    DATE=$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    
    # Database backup
    docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/pre_update_backup_$DATE.sql
    
    # Upload folder backup
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz uploads/ 2>/dev/null || true
    
    print_status "Backup created: $BACKUP_DIR/pre_update_backup_$DATE.sql"
}

# Update application
update_application() {
    print_status "Updating application..."
    
    # Pull latest code
    if [ -d .git ]; then
        git pull origin main
    else
        print_warning "Not a git repository. Make sure you have the latest code."
    fi
    
    # Rebuild and restart containers
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start database first
    docker-compose -f docker-compose.prod.yml up -d postgres redis
    sleep 10
    
    # Run migrations
    docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
    
    # Start all services
    docker-compose -f docker-compose.prod.yml up -d
    
    print_status "Application updated successfully!"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 30
    
    # Check if containers are running
    if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        print_status "Containers are running"
    else
        print_warning "Some containers may not be running properly"
    fi
    
    # Check API health endpoint
    if command -v curl &> /dev/null; then
        source .env
        if curl -f -s "https://$DOMAIN/api/health" > /dev/null; then
            print_status "API health check passed"
        else
            print_warning "API health check failed"
        fi
    fi
}

# Cleanup old images
cleanup() {
    print_status "Cleaning up old Docker images..."
    docker image prune -f
    docker volume prune -f
}

# Main execution
main() {
    if [ ! -f .env ]; then
        echo "❌ .env file not found. Please run deploy-vps.sh first."
        exit 1
    fi
    
    source .env
    
    create_backup
    update_application
    health_check
    cleanup
    
    echo ""
    echo "📋 Update Summary:"
    echo "   - Application URL: https://$DOMAIN"
    echo "   - Health Check: https://$DOMAIN/api/health"
    echo ""
    echo "📊 Current Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    print_status "🎉 Update completed successfully!"
}

main 