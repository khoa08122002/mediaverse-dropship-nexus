#!/bin/bash

# PHG Corporation Quick Deploy Script với thông tin đã cấu hình sẵn
# Domain: phgcorporation.com
# Email: letrandangkhoadl@gmail.com
# Repository: https://github.com/khoa08122002/mediaverse-dropship-nexus.git

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Pre-configured information
DOMAIN="phgcorporation.com"
SSL_EMAIL="letrandangkhoadl@gmail.com"
GIT_REPO="https://github.com/khoa08122002/mediaverse-dropship-nexus.git"

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}🚀 PHG Corporation Quick Deploy${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${GREEN}Domain: $DOMAIN${NC}"
    echo -e "${GREEN}SSL Email: $SSL_EMAIL${NC}"
    echo -e "${GREEN}Repository: $GIT_REPO${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Script này cần chạy với quyền root"
        echo "Chạy: sudo bash quick-deploy-phg.sh"
        exit 1
    fi
}

# Confirm deployment
confirm_deployment() {
    echo ""
    print_info "Script này sẽ:"
    echo "  ✓ Setup VPS hoàn toàn từ đầu"
    echo "  ✓ Cài đặt Docker, Nginx, SSL certificates"
    echo "  ✓ Deploy ứng dụng PHG Corporation"
    echo "  ✓ Cấu hình domain $DOMAIN"
    echo ""
    
    read -p "Bạn có muốn tiếp tục deployment? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
}

# Step 1: Setup VPS dependencies
setup_vps() {
    print_status "Step 1: Setting up VPS dependencies..."
    
    # Update system
    export DEBIAN_FRONTEND=noninteractive
    apt update -y && apt upgrade -y
    
    # Install basic tools
    apt install -y curl wget vim nano htop tree unzip zip git \
                   software-properties-common apt-transport-https \
                   ca-certificates gnupg lsb-release ufw fail2ban \
                   certbot python3-certbot-nginx
    
    # Install Node.js LTS
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt install -y nodejs
    
    # Install Docker với fix GPG key path
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update -y
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl start docker && systemctl enable docker
    
    # Test Docker
    docker --version
    
    # Install Nginx
    apt install -y nginx
    systemctl start nginx && systemctl enable nginx && systemctl stop nginx
    
    print_status "VPS dependencies installed successfully"
}

# Step 2: Create deploy user
create_deploy_user() {
    print_status "Step 2: Creating deployment user..."
    
    # Create user
    if ! id -u deploy >/dev/null 2>&1; then
        useradd -m -s /bin/bash deploy
    fi
    
    # Add to groups
    usermod -aG docker deploy
    usermod -aG sudo deploy
    
    # Create directories
    mkdir -p /home/deploy/.ssh
    mkdir -p /home/deploy/apps
    mkdir -p /home/deploy/backups
    chown -R deploy:deploy /home/deploy
    chmod 700 /home/deploy/.ssh
    
    print_status "User deploy created and configured"
}

# Step 3: Setup security and firewall
setup_security() {
    print_status "Step 3: Configuring security..."
    
    # UFW Firewall
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 22
    ufw allow 80
    ufw allow 443
    ufw --force enable
    
    # Fail2ban
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF
    
    systemctl start fail2ban && systemctl enable fail2ban
    
    # Swap file
    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo "/swapfile none swap sw 0 0" >> /etc/fstab
        # Optimize swap
        echo "vm.swappiness=10" >> /etc/sysctl.conf
        echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
    fi
    
    print_status "Security configured"
}

# Step 4: Deploy application
deploy_application() {
    print_status "Step 4: Deploying application..."
    
    # Switch to deploy user and deploy
    sudo -u deploy bash << EOF
cd /home/deploy

# Clone repository
if [ -d "app" ]; then
    rm -rf app
fi
git clone $GIT_REPO app
cd app

# Setup environment
cp env.production.template .env

# Generate strong passwords
DB_PASSWORD=\$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
JWT_SECRET=\$(openssl rand -base64 48)
REDIS_PASSWORD=\$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-12)

# Update .env file (domain và email đã được cấu hình sẵn)
sed -i "s/CHANGE_THIS_STRONG_PASSWORD/\$DB_PASSWORD/g" .env
sed -i "s/CHANGE_THIS_TO_RANDOM_64_CHARACTER_STRING_FOR_PRODUCTION/\$JWT_SECRET/g" .env
sed -i "s/CHANGE_THIS_REDIS_PASSWORD/\$REDIS_PASSWORD/g" .env

# Make scripts executable
chmod +x deploy-vps.sh
chmod +x update-app.sh

echo "Environment configured successfully"
EOF

    print_status "Application downloaded and configured"
}

# Step 5: Setup SSL and start services
start_services() {
    print_status "Step 5: Setting up SSL and starting services..."
    
    # Switch to deploy user for final deployment
    sudo -u deploy bash << EOF
cd /home/deploy/app

# Generate SSL certificates
sudo systemctl stop nginx 2>/dev/null || true
sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $SSL_EMAIL \
    --agree-tos \
    --non-interactive \
    --preferred-challenges http

# Copy certificates
sudo mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/
sudo chown -R deploy:deploy nginx/ssl/

# Start application
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d postgres redis

# Wait for database
sleep 15

# Run migrations and seed
docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml run --rm app node simple-seed.js

# Start all services
docker-compose -f docker-compose.prod.yml up -d

echo "Services started successfully"
EOF

    print_status "SSL configured and services started"
}

# Step 6: Verify deployment
verify_deployment() {
    print_status "Step 6: Verifying deployment..."
    
    sleep 30
    
    # Check containers
    cd /home/deploy/app
    sudo -u deploy docker-compose -f docker-compose.prod.yml ps
    
    # Test API
    if curl -f -s "https://$DOMAIN/api/health" > /dev/null; then
        print_status "API health check passed"
    else
        print_warning "API health check failed - có thể cần thời gian để khởi động"
    fi
    
    print_status "Deployment verification completed"
}

# Show final information
show_final_info() {
    echo ""
    print_status "🎉 PHG Corporation deployment hoàn thành!"
    echo ""
    echo "📋 Thông tin ứng dụng:"
    echo "  - Website: https://$DOMAIN"
    echo "  - API Health: https://$DOMAIN/api/health"
    echo "  - SSH: deploy@$(curl -s ifconfig.me 2>/dev/null || echo 'your-server-ip')"
    echo ""
    echo "🔑 Login credentials:"
    echo "  - Admin: admin@phg.com / admin123"
    echo "  - HR: hr@phg.com / hr123"
    echo "  - User: user@phg.com / user123"
    echo ""
    echo "🔧 Management commands (SSH vào server và chạy với user deploy):"
    echo "  - Update app: cd /home/deploy/app && ./update-app.sh"
    echo "  - View logs: cd /home/deploy/app && docker-compose -f docker-compose.prod.yml logs -f"
    echo "  - Restart: cd /home/deploy/app && docker-compose -f docker-compose.prod.yml restart"
    echo ""
    echo "⚠️  Quan trọng: Hãy chắc chắn domain $DOMAIN đã trỏ về IP của VPS này"
    echo ""
    print_status "🚀 Ứng dụng đã sẵn sàng tại https://$DOMAIN"
}

# Main execution
main() {
    print_header
    
    check_root
    confirm_deployment
    setup_vps
    create_deploy_user
    setup_security
    deploy_application
    start_services
    verify_deployment
    show_final_info
}

# Run main function
main "$@" 