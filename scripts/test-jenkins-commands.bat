@echo off
REM Test script to verify Jenkins pipeline commands work locally on Windows
echo Testing Jenkins pipeline commands...

echo 1. Testing Docker Compose...
docker-compose up -d postgres
timeout /t 10 /nobreak

echo 2. Testing PostgreSQL connection...
docker-compose exec -T postgres pg_isready -U postgres
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is ready
) else (
    echo ❌ PostgreSQL connection failed
)

echo 3. Testing database query...
docker-compose exec -T postgres psql -U postgres -d taskflow -c "SELECT 1;"
if %errorlevel% equ 0 (
    echo ✅ Database query successful
) else (
    echo ❌ Database query failed
)

echo 4. Testing application health checks...
curl -f http://localhost:5000/health
if %errorlevel% equ 0 (
    echo ✅ Backend health check passed
) else (
    echo ❌ Backend health check failed
)

curl -f http://localhost:3000
if %errorlevel% equ 0 (
    echo ✅ Frontend health check passed
) else (
    echo ❌ Frontend health check failed
)

curl -f http://localhost:8080
if %errorlevel% equ 0 (
    echo ✅ pgAdmin health check passed
) else (
    echo ❌ pgAdmin health check failed
)

echo Test completed!
pause
