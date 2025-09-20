#!/bin/bash

# Complete TaskFlow Setup Script
# This script sets up the entire TaskFlow environment with Jenkins, Docker, and pgAdmin

echo "🚀 Setting up TaskFlow with Jenkins, Docker & pgAdmin..."
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend environment file..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env (please update with your values)"
fi

if [ ! -f ".env.prod" ]; then
    echo "📝 Creating production environment file..."
    cp env.prod.example .env.prod
    echo "✅ Created .env.prod (please update with your values)"
fi

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "❌ Backend API is not ready"
fi

# Check Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
fi

# Check pgAdmin
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ pgAdmin is ready"
else
    echo "❌ pgAdmin is not ready"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🌐 Access URLs:"
echo "  Frontend:    http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  pgAdmin:     http://localhost:8080"
echo ""
echo "🔐 Default Credentials:"
echo "  pgAdmin Email:    admin@taskflow.com"
echo "  pgAdmin Password: admin123"
echo ""
echo "📊 Database Connection:"
echo "  Host:     postgres (or localhost)"
echo "  Port:     5432"
echo "  Database: taskflow"
echo "  Username: postgres"
echo "  Password: password"
echo ""
echo "📋 Next Steps:"
echo "  1. Update environment files with your values"
echo "  2. Set up Jenkins pipeline (see README-JENKINS-DOCKER-PGADMIN.md)"
echo "  3. Configure production environment"
echo ""
echo "📚 Documentation: README-JENKINS-DOCKER-PGADMIN.md"
