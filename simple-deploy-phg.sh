#!/bin/bash
# PHG Corporation Simple Deploy - No Interactive
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="phgcorporation.com"
SSL_EMAIL="letrandangkhoadl@gmail.com"
GIT_REPO="https://github.com/khoa08122002/mediaverse-dropship-nexus.git"

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check root
[[ $EUID -ne 0 ]] && error "Cần chạy với quyền root: sudo bash $0"

log "🚀 Bắt đầu deployment PHG Corporation..."
log "Domain: $DOMAIN"
log "SSL Email: $SSL_EMAIL"

# Step 1: Update system
log "📦 Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt update -y && apt upgrade -y

# Step 2: Install dependencies
log "🛠️ Installing dependencies..."
apt install -y curl wget vim git software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release \
    ufw fail2ban certbot python3-certbot-nginx

# Step 3: Install Node.js
log "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs

# Step 4: Install Docker
log "🐳 Installing Docker..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update -y
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl start docker && systemctl enable docker

# Test Docker
docker --version || error "Docker installation failed"
log "✅ Docker installed successfully"

# Step 5: Install Nginx
log "🌐 Installing Nginx..."
apt install -y nginx
systemctl start nginx && systemctl enable nginx && systemctl stop nginx

# Step 6: Setup firewall
log "🔒 Setting up firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Step 7: Create deploy user
log "👤 Creating deploy user..."
if ! id -u deploy >/dev/null 2>&1; then
    useradd -m -s /bin/bash deploy
fi
usermod -aG docker deploy
usermod -aG sudo deploy

# Create directories
mkdir -p /home/deploy/{.ssh,apps,backups}
chown -R deploy:deploy /home/deploy
chmod 700 /home/deploy/.ssh

# Step 8: Deploy application as deploy user
log "🚀 Deploying application..."
sudo -u deploy bash << 'DEPLOY_SCRIPT'
cd /home/deploy

# Clone repo
if [ -d "app" ]; then
    rm -rf app
fi
git clone https://github.com/khoa08122002/mediaverse-dropship-nexus.git app
cd app

# Setup environment
cp env.production.template .env

# Generate passwords
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
JWT_SECRET=$(openssl rand -base64 48)
REDIS_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-12)

# Update .env
sed -i "s/CHANGE_THIS_STRONG_PASSWORD/$DB_PASSWORD/g" .env
sed -i "s/CHANGE_THIS_TO_RANDOM_64_CHARACTER_STRING_FOR_PRODUCTION/$JWT_SECRET/g" .env
sed -i "s/CHANGE_THIS_REDIS_PASSWORD/$REDIS_PASSWORD/g" .env

echo "✅ Environment configured"
DEPLOY_SCRIPT

# Step 9: Setup SSL
log "🔐 Setting up SSL certificates..."
systemctl stop nginx 2>/dev/null || true

# Generate SSL
certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --email $SSL_EMAIL \
    --agree-tos \
    --non-interactive \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    log "✅ SSL certificates generated"
else
    warning "SSL generation failed - will try HTTP first"
fi

# Step 10: Copy SSL and start services
log "🐳 Starting Docker services..."
sudo -u deploy bash << 'START_SERVICES'
cd /home/deploy/app

# Copy SSL certificates if they exist
if [ -d "/etc/letsencrypt/live/phgcorporation.com" ]; then
    sudo mkdir -p nginx/ssl
    sudo cp /etc/letsencrypt/live/phgcorporation.com/fullchain.pem nginx/ssl/ 2>/dev/null || true
    sudo cp /etc/letsencrypt/live/phgcorporation.com/privkey.pem nginx/ssl/ 2>/dev/null || true
    sudo chown -R deploy:deploy nginx/ssl/ 2>/dev/null || true
fi

# Start services
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d postgres redis

# Wait for DB
echo "⏳ Waiting for database..."
sleep 20

# Run migrations
docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy

# Seed database
docker-compose -f docker-compose.prod.yml run --rm app node simple-seed.js

# Start all services
docker-compose -f docker-compose.prod.yml up -d

echo "🎉 Services started!"
START_SERVICES

# Step 11: Create swap
log "💾 Creating swap file..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

# Step 12: Final verification
log "🔍 Verifying deployment..."
sleep 10

cd /home/deploy/app
sudo -u deploy docker-compose -f docker-compose.prod.yml ps

# Test local API first
if curl -f -s "http://localhost:3002/api/health" > /dev/null; then
    log "✅ API health check passed (local)"
else
    warning "⚠️ API health check failed (local)"
fi

# Final info
echo ""
log "🎉 Deployment completed!"
echo ""
echo "📋 Information:"
echo "  - Website: https://$DOMAIN"
echo "  - API: https://$DOMAIN/api/health"
echo "  - Server IP: $(curl -s ifconfig.me 2>/dev/null || echo 'unknown')"
echo ""
echo "🔑 Login credentials:"
echo "  - Admin: admin@phg.com / admin123"
echo "  - HR: hr@phg.com / hr123"
echo "  - User: user@phg.com / user123"
echo ""
echo "🛠️ Management (SSH as deploy user):"
echo "  ssh deploy@$(curl -s ifconfig.me 2>/dev/null || echo '[server-ip]')"
echo "  cd /home/deploy/app"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
log "🚀 Ready at https://$DOMAIN" 