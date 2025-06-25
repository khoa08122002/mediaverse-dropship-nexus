#!/bin/bash

# Fix Nginx CSP Script for Spline Support
# This script updates nginx.conf on the server to allow Spline to work

set -e

SERVER_IP="198.38.91.102"
SERVER_USER="root"
APP_DIR="/home/deploy/app"

echo "🔧 Fixing Nginx CSP for Spline support..."

# Copy updated nginx.conf to server
echo "📤 Uploading updated nginx.conf..."
scp nginx/nginx.conf ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/nginx/

# Connect to server and restart nginx
echo "🔄 Restarting Nginx with updated CSP..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
cd /home/deploy/app

echo "Backing up current nginx config..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup || true

echo "Copying new nginx config to container..."
sudo -u deploy docker compose -f docker-compose.prod.yml cp nginx/nginx.conf nginx:/etc/nginx/nginx.conf

echo "Testing nginx configuration..."
sudo -u deploy docker compose -f docker-compose.prod.yml exec nginx nginx -t

echo "Restarting nginx container..."
sudo -u deploy docker compose -f docker-compose.prod.yml restart nginx

echo "Checking nginx status..."
sudo -u deploy docker compose -f docker-compose.prod.yml ps nginx

echo "✅ Nginx restart completed!"
EOF

echo "🌐 Testing website with new CSP..."
sleep 3
curl -s -I https://phgcorporation.com | grep -i "content-security-policy"

echo ""
echo "✅ CSP fix completed! Spline should now work properly."
echo "🌐 Please test the website at: https://phgcorporation.com"
echo ""
echo "📋 The new CSP allows:"
echo "  ✓ unsafe-eval for Spline functionality"
echo "  ✓ Spline CDN domains (https://prod.spline.design)"
echo "  ✓ WebSocket connections for Spline"
echo "  ✓ Image loading from various sources"
echo "  ✓ Font loading from CDNs" 