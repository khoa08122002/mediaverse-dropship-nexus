#!/bin/bash

# PHG Corporation VPS Production Deployment Script
# Run this script on your VPS to deploy the application

set -e

echo "🚀 PHG Corporation VPS Production Deployment"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root${NC}"
   exit 1
fi

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        print_warning "Please log out and log back in for Docker permissions to take effect"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    if ! command -v nginx &> /dev/null; then
        print_status "Installing Nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi
    
    if ! command -v certbot &> /dev/null; then
        print_status "Installing Certbot for SSL..."
        sudo apt install -y certbot python3-certbot-nginx
    fi
}

# Setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f env.production.template ]; then
            cp env.production.template .env
            print_warning "Created .env from template. Please edit .env with your production values:"
            echo "  - DOMAIN: Your domain name"
            echo "  - POSTGRES_PASSWORD: Strong database password"
            echo "  - JWT_SECRET: 64-character random string"
            echo "  - SSL_EMAIL: Your email for Let's Encrypt"
            echo ""
            read -p "Press Enter after editing .env to continue..."
        else
            print_error ".env file not found and no template available"
            exit 1
        fi
    fi
    
    # Source environment variables
    source .env
    
    # Validate required variables
    if [[ -z "$DOMAIN" || "$DOMAIN" == "your-domain.com" ]]; then
        print_error "Please set DOMAIN in .env file"
        exit 1
    fi
    
    if [[ -z "$SSL_EMAIL" || "$SSL_EMAIL" == "your-email@domain.com" ]]; then
        print_error "Please set SSL_EMAIL in .env file"
        exit 1
    fi
}

# Update nginx configuration with actual domain
update_nginx_config() {
    print_status "Updating Nginx configuration..."
    
    if [ -f nginx/nginx.conf ]; then
        sed -i "s/your-domain.com/$DOMAIN/g" nginx/nginx.conf
        sed -i "s/https:\/\/your-domain.com/https:\/\/$DOMAIN/g" nginx/nginx.conf
    else
        print_error "nginx/nginx.conf not found"
        exit 1
    fi
}

# Setup SSL certificates
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Stop nginx if running
    sudo systemctl stop nginx 2>/dev/null || true
    
    # Generate SSL certificates
    if [ ! -f nginx/ssl/fullchain.pem ]; then
        print_status "Generating SSL certificates with Let's Encrypt..."
        sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive
        
        # Copy certificates to nginx ssl directory
        sudo mkdir -p nginx/ssl
        sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
        sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/
        sudo chown -R $USER:$USER nginx/ssl/
    else
        print_status "SSL certificates already exist"
    fi
}

# Build and start application
deploy_application() {
    print_status "Building and deploying application..."
    
    # Stop any running containers
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Build images
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Start PostgreSQL first
    docker-compose -f docker-compose.prod.yml up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 15
    
    # Run database migrations
    print_status "Running database migrations..."
    docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
    
    # Seed database (optional)
    print_status "Seeding database..."
    docker-compose -f docker-compose.prod.yml run --rm app node simple-seed.js || print_warning "Seeding failed or skipped"
    
    # Start all services
    print_status "Starting all services..."
    docker-compose -f docker-compose.prod.yml up -d
}

# Setup monitoring and backups
setup_monitoring() {
    print_status "Setting up monitoring and backups..."
    
    # Create backup script
    cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Database backup completed: $BACKUP_DIR/db_backup_$DATE.sql"
EOF
    
    chmod +x backup-db.sh
    
    # Add to crontab for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * cd $(pwd) && ./backup-db.sh") | crontab -
}

# Setup firewall
setup_firewall() {
    print_status "Configuring firewall..."
    
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw reload
}

# Main execution
main() {
    check_requirements
    setup_environment
    update_nginx_config
    setup_ssl
    deploy_application
    setup_monitoring
    setup_firewall
    
    print_status "Deployment completed successfully!"
    echo ""
    echo "📋 Application Information:"
    echo "   - Application URL: https://$DOMAIN"
    echo "   - API Health Check: https://$DOMAIN/api/health"
    echo ""
    echo "🔧 Management Commands:"
    echo "   - View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "   - Restart: docker-compose -f docker-compose.prod.yml restart"
    echo "   - Stop: docker-compose -f docker-compose.prod.yml down"
    echo "   - Backup DB: ./backup-db.sh"
    echo ""
    echo "📊 Container Status:"
    docker-compose -f docker-compose.prod.yml ps
    
    print_status "🎉 Your application is now live at https://$DOMAIN"
}

# Run main function
main 