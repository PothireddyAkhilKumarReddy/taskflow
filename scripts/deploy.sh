#!/bin/bash

# Deployment script for TaskFlow

set -e

echo "🚀 Starting TaskFlow deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t taskflow-app:latest .

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start new containers
echo "▶️ Starting new containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deployment successful! TaskFlow is running at http://localhost:3000"
else
    echo "❌ Health check failed. Please check the logs:"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
