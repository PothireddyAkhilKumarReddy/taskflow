# TaskFlow - Jenkins, Docker & pgAdmin Setup Guide

This guide will help you set up the TaskFlow task management system using Jenkins for CI/CD, Docker for containerization, and pgAdmin for database administration.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Jenkins CI    │    │   Docker Hub    │    │   Production    │
│                 │───▶│   Registry      │───▶│   Environment   │
│ - Build & Test  │    │                 │    │                 │
│ - Deploy        │    │ - Frontend      │    │ - Frontend      │
│ - Health Check  │    │ - Backend       │    │ - Backend       │
└─────────────────┘    └─────────────────┘    │ - PostgreSQL    │
                                              │ - pgAdmin       │
                                              │ - Nginx         │
                                              └─────────────────┘
```

## 📋 Prerequisites

- Docker and Docker Compose installed
- Jenkins server with Docker plugin
- Docker Hub account (for image registry)
- Git repository access

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repository-url>
cd complete_task_management_system
```

### 2. Environment Configuration

Copy the environment files and update the values:

```bash
# For development
cp backend/env.example backend/.env

# For production
cp env.prod.example .env.prod

# For staging
cp env.staging.example .env.staging
```

### 3. Start the Application

```bash
# Start all services including pgAdmin
docker-compose up -d

# Run setup script (Windows)
scripts\setup-pgadmin.bat

# Run setup script (Linux/Mac)
chmod +x scripts/setup-pgadmin.sh
./scripts/setup-pgadmin.sh
```

## 🔧 Services Overview

### Application Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React application |
| Backend | 5000 | Node.js API server |
| PostgreSQL | 5432 | Database server |
| pgAdmin | 8080 | Database administration |
| Nginx | 80 | Reverse proxy |

### Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:8080
- **API Health**: http://localhost:5000/health

## 🗄️ Database Setup

### PostgreSQL Configuration

- **Host**: postgres (container name) / localhost (external)
- **Port**: 5432
- **Database**: taskflow
- **Username**: postgres
- **Password**: password (development) / [from .env] (production)

### pgAdmin Access

- **URL**: http://localhost:8080
- **Email**: admin@taskflow.com
- **Password**: admin123 (development) / [from .env] (production)

### Database Connection in pgAdmin

1. Open pgAdmin at http://localhost:8080
2. Login with the credentials above
3. The TaskFlow database connection is pre-configured
4. If not, add a new server with these details:
   - **Name**: TaskFlow Database
   - **Host**: postgres
   - **Port**: 5432
   - **Database**: taskflow
   - **Username**: postgres
   - **Password**: password

## 🔄 Jenkins CI/CD Setup

### 1. Jenkins Configuration

#### Required Plugins
- Docker Pipeline
- Docker
- Git
- Credentials Binding

#### Credentials Setup
Add these credentials in Jenkins:

1. **Docker Registry Credentials**
   - ID: `docker-registry-credentials`
   - Username: Your Docker Hub username
   - Password: Your Docker Hub password/token

2. **Database Password**
   - ID: `db-password`
   - Secret: Your database password

3. **JWT Secret**
   - ID: `jwt-secret`
   - Secret: Your JWT secret key

4. **pgAdmin Password**
   - ID: `pgadmin-password`
   - Secret: Your pgAdmin password

### 2. Pipeline Configuration

#### Option 1: Use Existing Jenkinsfile
The current `Jenkinsfile` includes basic CI/CD with Docker builds and deployments.

#### Option 2: Use Enhanced Jenkinsfile
Use `Jenkinsfile.pgadmin` for enhanced features including:
- pgAdmin health checks
- Database migration automation
- Comprehensive notifications

### 3. Pipeline Stages

1. **Checkout**: Clone the repository
2. **Install Dependencies**: Install npm packages
3. **Lint and Type Check**: Code quality checks
4. **Build Application**: Build the React frontend
5. **Build Docker Images**: Build and push frontend/backend images
6. **Database Migration**: Run database migrations
7. **Deploy**: Deploy to staging/production
8. **Health Checks**: Verify all services are running
9. **Database Health Check**: Verify database connectivity
10. **pgAdmin Health Check**: Verify pgAdmin accessibility

## 🐳 Docker Configuration

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Production Environment

```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Update production
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Staging Environment

```bash
# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d
```

## 🔍 Monitoring and Health Checks

### Application Health Checks

- **Frontend**: `curl http://localhost:3000`
- **Backend**: `curl http://localhost:5000/health`
- **pgAdmin**: `curl http://localhost:8080/misc/ping`

### Database Health Checks

```bash
# Check PostgreSQL connectivity
docker-compose exec postgres pg_isready -U postgres

# Test database query
docker-compose exec postgres psql -U postgres -d taskflow -c "SELECT 1;"
```

### Jenkins Health Check Commands

The Jenkins pipeline includes automated health checks for:
- Application services
- Database connectivity
- pgAdmin accessibility

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :8080
netstat -tulpn | grep :5432
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### 3. pgAdmin Access Issues
```bash
# Check pgAdmin logs
docker-compose logs pgadmin

# Restart pgAdmin
docker-compose restart pgadmin
```

#### 4. Docker Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Log Locations

- **Application Logs**: `docker-compose logs [service-name]`
- **Jenkins Logs**: Jenkins web interface → Build → Console Output
- **Database Logs**: `docker-compose logs postgres`
- **pgAdmin Logs**: `docker-compose logs pgadmin`

## 🔐 Security Considerations

### Production Security

1. **Change Default Passwords**
   - Update database passwords
   - Update pgAdmin credentials
   - Use strong JWT secrets

2. **Environment Variables**
   - Never commit `.env` files
   - Use Jenkins credentials for sensitive data
   - Rotate secrets regularly

3. **Network Security**
   - Use HTTPS in production
   - Restrict database access
   - Implement proper firewall rules

4. **pgAdmin Security**
   - Use strong passwords
   - Enable server mode in production
   - Restrict access to admin users only

## 📚 Additional Resources

### Useful Commands

```bash
# View all running containers
docker ps

# View container resource usage
docker stats

# Access container shell
docker-compose exec [service-name] sh

# Backup database
docker-compose exec postgres pg_dump -U postgres taskflow > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres taskflow < backup.sql
```

### File Structure

```
complete_task_management_system/
├── backend/                 # Backend API
├── frontend/               # React frontend
├── pgadmin/               # pgAdmin configuration
├── scripts/               # Setup and utility scripts
├── docker-compose.yml     # Development environment
├── docker-compose.prod.yml # Production environment
├── docker-compose.staging.yml # Staging environment
├── Jenkinsfile           # Basic CI/CD pipeline
├── Jenkinsfile.pgadmin   # Enhanced CI/CD pipeline
└── README.md            # This documentation
```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker and Jenkins logs
3. Verify all environment variables are set correctly
4. Ensure all required ports are available
5. Check Docker and Jenkins plugin versions

For additional help, refer to:
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
