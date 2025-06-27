#!/bin/bash

echo "=== Fixing SSL Certificate Issue ==="

# Check if Let's Encrypt certificates exist
if [ -f "/etc/letsencrypt/live/phgcorporation.com/fullchain.pem" ]; then
    echo "✓ Let's Encrypt certificates found"
    
    # Create nginx ssl directory if it doesn't exist
    mkdir -p nginx/ssl
    
    # Copy certificates to nginx ssl directory
    echo "Copying SSL certificates..."
    cp /etc/letsencrypt/live/phgcorporation.com/fullchain.pem nginx/ssl/
    cp /etc/letsencrypt/live/phgcorporation.com/privkey.pem nginx/ssl/
    
    # Set proper permissions
    chmod 644 nginx/ssl/fullchain.pem
    chmod 600 nginx/ssl/privkey.pem
    
    echo "✓ SSL certificates copied successfully"
    
    # Restart docker containers
    echo "Restarting containers..."
    docker compose -f docker-compose.prod.yml down
    docker compose -f docker-compose.prod.yml up -d
    
    echo "✓ Containers restarted"
    
else
    echo "❌ Let's Encrypt certificates not found!"
    echo "Creating temporary HTTP-only nginx configuration..."
    
    # Create a temporary HTTP-only nginx config
    cat > nginx/nginx.conf.http << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Upstream backends
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server app:3002;
    }

    # HTTP server
    server {
        listen 80;
        server_name phgcorporation.com www.phgcorporation.com;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # CORS headers
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Accept, Authorization, Cache-Control, Content-Type, X-Requested-With" always;
            
            if ($request_method = 'OPTIONS') {
                return 204;
            }
        }

        # Auth endpoints with stricter rate limiting
        location ~ ^/api/(auth|login) {
            limit_req zone=login burst=5 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files for uploads
        location /uploads/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Cache static files
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Frontend application
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF
    
    # Backup original config and use HTTP-only
    cp nginx/nginx.conf nginx/nginx.conf.ssl.backup
    cp nginx/nginx.conf.http nginx/nginx.conf
    
    echo "✓ Temporary HTTP-only configuration created"
    echo "Restarting with HTTP-only configuration..."
    
    docker compose -f docker-compose.prod.yml down
    docker compose -f docker-compose.prod.yml up -d
    
    echo "✓ Containers restarted with HTTP configuration"
    echo "⚠️  WARNING: Site is now running on HTTP only!"
    echo "Please restore SSL certificates and run this script again."
fi

echo "=== SSL Certificate Fix Complete ===" 