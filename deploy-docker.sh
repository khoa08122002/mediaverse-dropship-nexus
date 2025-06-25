#!/bin/bash

# PHG Corporation Docker Deployment Script
# This script helps you deploy the application using Docker

set -e

echo "🚀 PHG Corporation Docker Deployment"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose first."
    exit 1
fi

# Function to use docker compose (with or without hyphen)
docker_compose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from docker-env.example..."
    cp docker-env.example .env
    echo "⚠️  Please edit .env file and update your configuration:"
    echo "   - JWT_SECRET: Change to a secure random string"
    echo "   - DATABASE_URL: Configure your database"
    echo "   - CORS_ORIGIN: Set your frontend domain"
    echo ""
    read -p "Press Enter after editing .env file to continue..."
fi

# Build and start the application
echo "🔨 Building Docker images..."
docker_compose build

echo "⏳ Waiting for PostgreSQL to be ready..."
docker_compose up -d postgres
sleep 10

echo "🗄️  Running database migrations..."
docker_compose run --rm app npx prisma migrate deploy

echo "🌱 Seeding database (optional)..."
docker_compose run --rm app npm run prisma:seed || echo "⚠️  Seeding failed or skipped"

echo "🚀 Starting the application..."
docker_compose up -d

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Application Information:"
echo "   - Application URL: http://localhost:3002"
echo "   - Health Check: http://localhost:3002/api/health"
echo "   - API Documentation: http://localhost:3002/api/docs (development only)"
echo ""
echo "📊 Container Status:"
docker_compose ps

echo ""
echo "📝 Useful Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop application: docker-compose down"
echo "   - Restart application: docker-compose restart"
echo "   - Update application: docker-compose down && docker-compose build && docker-compose up -d"
echo ""
echo "🎉 Your application is now running with Docker!" 