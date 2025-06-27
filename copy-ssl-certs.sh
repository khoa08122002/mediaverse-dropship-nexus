#!/bin/bash

echo "=== Copying SSL Certificates ==="

# Create nginx ssl directory
mkdir -p nginx/ssl

# Copy certificates
echo "Copying SSL certificates..."
cp /etc/letsencrypt/live/phgcorporation.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/phgcorporation.com/privkey.pem nginx/ssl/

# Set permissions
chmod 644 nginx/ssl/fullchain.pem
chmod 600 nginx/ssl/privkey.pem

echo "✓ SSL certificates copied"
echo "Certificates available at:"
ls -la nginx/ssl/

echo "Now restart the containers:"
echo "docker compose -f docker-compose.prod.yml down"
echo "docker compose -f docker-compose.prod.yml up -d" 