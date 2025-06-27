#!/bin/bash

# Fix CORS Domain Script
# This script updates the backend CORS configuration to use the correct domain

echo "🔧 Fixing CORS domain configuration..."

# VPS connection details
VPS_IP="198.38.91.102"
VPS_USER="root"
APP_DIR="/home/deploy/app"

# Check if we're on local machine or VPS
if [ "$(hostname)" != "phgcorporation" ]; then
    echo "📤 Uploading fixed files to VPS..."
    
    # Upload the fixed backend main.ts
    scp src/backend/main.ts ${VPS_USER}@${VPS_IP}:${APP_DIR}/src/backend/main.ts
    
    # Upload the fixed environment.ts
    scp src/utils/environment.ts ${VPS_USER}@${VPS_IP}:${APP_DIR}/src/utils/environment.ts
    
    echo "✅ Files uploaded successfully"
    
    # Connect to VPS and rebuild
    ssh ${VPS_USER}@${VPS_IP} << 'EOF'
        cd /home/deploy/app
        
        echo "🔄 Rebuilding backend with new CORS configuration..."
        docker compose -f docker-compose.prod.yml down app
        docker compose -f docker-compose.prod.yml build app --no-cache
        docker compose -f docker-compose.prod.yml up -d app
        
        echo "⏳ Waiting for backend to start..."
        sleep 10
        
        echo "🔄 Rebuilding frontend with new environment..."
        docker compose -f docker-compose.prod.yml down frontend
        docker compose -f docker-compose.prod.yml build frontend --no-cache
        docker compose -f docker-compose.prod.yml up -d frontend
        
        echo "⏳ Waiting for frontend to start..."
        sleep 15
        
        echo "🔄 Restarting nginx..."
        docker compose -f docker-compose.prod.yml restart nginx
        
        echo "✅ All services restarted"
        
        echo "🧪 Testing CORS configuration..."
        curl -s -I -H "Origin: https://phgcorporation.com" https://phgcorporation.com/api/health | grep -i "access-control" || echo "❌ CORS headers not found"
        
        echo "🧪 Testing login API..."
        curl -s -X POST https://phgcorporation.com/api/auth/login \
            -H "Content-Type: application/json" \
            -H "Origin: https://phgcorporation.com" \
            -d '{"email": "admin@phg.com", "password": "password"}' | grep -o '"accessToken"' && echo " ✅ Login API working" || echo "❌ Login API failed"
        
        echo "📊 Container status:"
        docker compose -f docker-compose.prod.yml ps
EOF

else
    echo "🔄 Running on VPS - rebuilding containers..."
    
    # We're on the VPS
    cd ${APP_DIR}
    
    echo "🔄 Rebuilding backend with new CORS configuration..."
    docker compose -f docker-compose.prod.yml down app
    docker compose -f docker-compose.prod.yml build app --no-cache
    docker compose -f docker-compose.prod.yml up -d app
    
    echo "⏳ Waiting for backend to start..."
    sleep 10
    
    echo "🔄 Rebuilding frontend with new environment..."
    docker compose -f docker-compose.prod.yml down frontend
    docker compose -f docker-compose.prod.yml build frontend --no-cache
    docker compose -f docker-compose.prod.yml up -d frontend
    
    echo "⏳ Waiting for frontend to start..."
    sleep 15
    
    echo "🔄 Restarting nginx..."
    docker compose -f docker-compose.prod.yml restart nginx
    
    echo "✅ All services restarted"
    
    echo "🧪 Testing CORS configuration..."
    curl -s -I -H "Origin: https://phgcorporation.com" https://phgcorporation.com/api/health | grep -i "access-control" || echo "❌ CORS headers not found"
    
    echo "🧪 Testing login API..."
    curl -s -X POST https://phgcorporation.com/api/auth/login \
        -H "Content-Type: application/json" \
        -H "Origin: https://phgcorporation.com" \
        -d '{"email": "admin@phg.com", "password": "password"}' | grep -o '"accessToken"' && echo " ✅ Login API working" || echo "❌ Login API failed"
    
    echo "📊 Container status:"
    docker compose -f docker-compose.prod.yml ps
fi

echo "🎉 CORS domain fix complete!"
echo "Try logging in at: https://phgcorporation.com" 