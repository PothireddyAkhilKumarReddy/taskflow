@echo off
REM Complete TaskFlow Setup Script for Windows
REM This script sets up the entire TaskFlow environment with Jenkins, Docker, and pgAdmin

echo 🚀 Setting up TaskFlow with Jenkins, Docker ^& pgAdmin...
echo ==================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create environment files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend environment file...
    copy "backend\env.example" "backend\.env"
    echo ✅ Created backend\.env (please update with your values)
)

if not exist ".env.prod" (
    echo 📝 Creating production environment file...
    copy "env.prod.example" ".env.prod"
    echo ✅ Created .env.prod (please update with your values)
)

REM Build and start services
echo 🐳 Building and starting Docker services...
docker-compose up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...

REM Check PostgreSQL
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is ready
) else (
    echo ❌ PostgreSQL is not ready
)

REM Check Backend
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API is ready
) else (
    echo ❌ Backend API is not ready
)

REM Check Frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is ready
) else (
    echo ❌ Backend API is not ready
)

REM Check pgAdmin
curl -f http://localhost:8080 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ pgAdmin is ready
) else (
    echo ❌ pgAdmin is not ready
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 🌐 Access URLs:
echo   Frontend:    http://localhost:3000
echo   Backend API: http://localhost:5000
echo   pgAdmin:     http://localhost:8080
echo.
echo 🔐 Default Credentials:
echo   pgAdmin Email:    admin@taskflow.com
echo   pgAdmin Password: admin123
echo.
echo 📊 Database Connection:
echo   Host:     postgres (or localhost)
echo   Port:     5432
echo   Database: taskflow
echo   Username: postgres
echo   Password: password
echo.
echo 📋 Next Steps:
echo   1. Update environment files with your values
echo   2. Set up Jenkins pipeline (see README-JENKINS-DOCKER-PGADMIN.md)
echo   3. Configure production environment
echo.
echo 📚 Documentation: README-JENKINS-DOCKER-PGADMIN.md
pause
