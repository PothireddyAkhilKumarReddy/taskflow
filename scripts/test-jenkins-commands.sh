#!/bin/bash

# Test script to verify Jenkins pipeline commands work locally
echo "Testing Jenkins pipeline commands..."

echo "1. Testing Docker Compose..."
docker-compose up -d postgres
sleep 10

echo "2. Testing PostgreSQL connection..."
docker-compose exec -T postgres pg_isready -U postgres
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL connection failed"
fi

echo "3. Testing database query..."
docker-compose exec -T postgres psql -U postgres -d taskflow -c "SELECT 1;"
if [ $? -eq 0 ]; then
    echo "✅ Database query successful"
else
    echo "❌ Database query failed"
fi

echo "4. Testing application health checks..."
curl -f http://localhost:5000/health
if [ $? -eq 0 ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

curl -f http://localhost:3000
if [ $? -eq 0 ]; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
fi

curl -f http://localhost:8080
if [ $? -eq 0 ]; then
    echo "✅ pgAdmin health check passed"
else
    echo "❌ pgAdmin health check failed"
fi

echo "Test completed!"
