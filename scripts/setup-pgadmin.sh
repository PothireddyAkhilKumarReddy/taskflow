#!/bin/bash

# pgAdmin Setup Script
# This script sets up pgAdmin with the TaskFlow database connection

echo "Setting up pgAdmin for TaskFlow..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Wait for pgAdmin to be ready
echo "Waiting for pgAdmin to be ready..."
until curl -f http://localhost:8080 > /dev/null 2>&1; do
  echo "pgAdmin is unavailable - sleeping"
  sleep 2
done

echo "pgAdmin is ready!"
echo ""
echo "pgAdmin Setup Complete!"
echo "================================"
echo "Access pgAdmin at: http://localhost:8080"
echo "Email: admin@taskflow.com"
echo "Password: admin123"
echo ""
echo "Database Connection Details:"
echo "Host: postgres"
echo "Port: 5432"
echo "Database: taskflow"
echo "Username: postgres"
echo "Password: password"
echo "================================"
