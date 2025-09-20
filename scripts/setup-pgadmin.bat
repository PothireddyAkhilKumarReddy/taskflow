@echo off
REM pgAdmin Setup Script for Windows
REM This script sets up pgAdmin with the TaskFlow database connection

echo Setting up pgAdmin for TaskFlow...

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
:wait_postgres
docker-compose exec -T postgres pg_isready -U postgres
if %errorlevel% neq 0 (
    echo PostgreSQL is unavailable - sleeping
    timeout /t 2 /nobreak > nul
    goto wait_postgres
)

echo PostgreSQL is ready!

REM Wait for pgAdmin to be ready
echo Waiting for pgAdmin to be ready...
:wait_pgadmin
curl -f http://localhost:8080 > nul 2>&1
if %errorlevel% neq 0 (
    echo pgAdmin is unavailable - sleeping
    timeout /t 2 /nobreak > nul
    goto wait_pgadmin
)

echo pgAdmin is ready!
echo.
echo pgAdmin Setup Complete!
echo ================================
echo Access pgAdmin at: http://localhost:8080
echo Email: admin@taskflow.com
echo Password: admin123
echo.
echo Database Connection Details:
echo Host: postgres
echo Port: 5432
echo Database: taskflow
echo Username: postgres
echo Password: password
echo ================================
pause
