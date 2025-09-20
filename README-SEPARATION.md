# TaskFlow - Separated Frontend and Backend

This document explains how to run TaskFlow with separated frontend and backend services.

## Architecture

- **Backend**: Convex functions and database (in `backend/` directory)
- **Frontend**: React application (in `frontend/` directory)
- **Proxy**: Nginx for routing and load balancing

## Development Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Convex CLI (`npm install -g convex`)

### Backend Setup
```bash
cd backend
npm install
npx convex dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Convex deployment URL
npm run dev
```

## Production Deployment

### Using Docker Compose
```bash
# Set environment variables
export CONVEX_DEPLOYMENT=your-deployment-name
export VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Deploy with separated services
docker-compose -f docker-compose.separated.yml up -d
```

### Manual Deployment

#### Backend Deployment
```bash
cd backend
npm install
npx convex deploy --prod
```

#### Frontend Deployment
```bash
cd frontend
npm install
npm run build
# Deploy dist/ folder to your hosting service
```

## Environment Variables

### Backend (.env)
```
CONVEX_DEPLOYMENT=your-deployment-name
```

### Frontend (.env.local)
```
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## API Endpoints

The backend exposes the following Convex functions:

### Authentication
- `auth.loggedInUser` - Get current user info

### Tasks
- `tasks.getUserTasks` - Get user's tasks
- `tasks.createTask` - Create new task
- `tasks.updateTask` - Update existing task
- `tasks.deleteTask` - Delete task
- `tasks.getTaskStats` - Get task statistics

### Projects
- `projects.getUserProjects` - Get user's projects
- `projects.createProject` - Create new project
- `projects.updateProject` - Update existing project
- `projects.deleteProject` - Delete project

### Comments
- `comments.getTaskComments` - Get task comments
- `comments.addComment` - Add comment to task
- `comments.deleteComment` - Delete comment

## Security Features

- Rate limiting on API endpoints
- CORS protection
- Authentication required for all operations
- Input validation on all mutations
- SQL injection protection (Convex handles this)

## Monitoring and Logging

- Nginx access logs
- Application logs via console
- Health check endpoint at `/health`
- Convex dashboard for backend monitoring

## Scaling

### Frontend Scaling
- Use CDN for static assets
- Multiple frontend replicas behind load balancer
- Enable gzip compression

### Backend Scaling
- Convex automatically scales
- Monitor function execution times
- Use indexes for efficient queries

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check VITE_CONVEX_URL in frontend environment
2. **Authentication Issues**: Verify Convex deployment is properly configured
3. **Build Failures**: Ensure all dependencies are installed
4. **Connection Issues**: Check network connectivity between services

### Logs
```bash
# Frontend logs
docker-compose logs taskflow-frontend

# Backend logs (Convex dashboard)
# Visit https://dashboard.convex.dev

# Nginx logs
docker-compose logs nginx
```
