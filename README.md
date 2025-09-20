# TaskFlow - Task Management System

A comprehensive task management system built with React, Convex, and modern web technologies. Features include user authentication, project management, task tracking, and real-time collaboration.

## 🚀 Features

- **User Authentication**: Secure sign-in/sign-up with Convex Auth
- **Task Management**: Create, edit, delete, and track tasks
- **Project Organization**: Group tasks into projects
- **Real-time Updates**: Live collaboration with Convex real-time database
- **Priority & Status Tracking**: Organize tasks by priority and status
- **Due Date Management**: Set and track task deadlines
- **Comments System**: Collaborate on tasks with comments
- **Dashboard Analytics**: View task statistics and progress
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and functions)
- **Authentication**: Convex Auth
- **Build Tool**: Vite
- **Deployment**: Docker, Jenkins CI/CD
- **Styling**: Tailwind CSS with custom components

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)
- Jenkins (for CI/CD pipeline)

## 🏃‍♂️ Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Convex**
   ```bash
   npx convex dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   Navigate to `http://localhost:3000`

### Production Deployment

1. **Use the deployment script**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

## 🏗️ Project Structure

```
taskflow/
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── tasks.ts           # Task-related functions
│   ├── projects.ts        # Project-related functions
│   ├── comments.ts        # Comment functions
│   └── auth.ts            # Authentication setup
├── src/
│   ├── components/        # React components
│   │   ├── TaskDashboard.tsx
│   │   ├── TaskList.tsx
│   │   ├── ProjectList.tsx
│   │   ├── TaskForm.tsx
│   │   └── ProjectForm.tsx
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── scripts/              # Deployment and utility scripts
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image definition
├── Jenkinsfile          # Jenkins CI/CD pipeline
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
CONVEX_DEPLOYMENT=your-deployment-name
VITE_CONVEX_URL=your-convex-url
```

### Docker Configuration

The application includes multiple Docker Compose configurations:

- `docker-compose.yml` - Local development
- `docker-compose.staging.yml` - Staging environment  
- `docker-compose.prod.yml` - Production environment

### Jenkins Pipeline

The Jenkins pipeline includes:

- Code checkout
- Dependency installation
- Linting and type checking
- Application build
- Docker image creation
- Automated deployment to staging/production
- Health checks

## 📊 Database Schema

### Tables

- **users**: User authentication and profile data
- **projects**: Project information and metadata
- **tasks**: Task details, status, and assignments
- **comments**: Task comments and collaboration

### Key Features

- Real-time synchronization across all clients
- Optimistic updates for better UX
- Automatic conflict resolution
- Built-in authentication and authorization

## 🚀 Deployment Options

### 1. Manual Deployment

```bash
npm run build
docker build -t taskflow .
docker run -p 3000:3000 taskflow
```

### 2. Docker Compose

```bash
docker-compose up -d
```

### 3. Jenkins CI/CD

Push to your repository and Jenkins will automatically:
- Run tests and linting
- Build the application
- Create Docker images
- Deploy to staging/production
- Perform health checks

## 🔒 Security Features

- Secure authentication with Convex Auth
- Row-level security for data access
- Input validation and sanitization
- HTTPS support in production
- Docker security best practices

## 📈 Monitoring & Maintenance

### Health Checks

The application includes health check endpoints for monitoring:

```bash
curl http://localhost:3000/health
```

### Backup & Recovery

Use the backup script to create regular backups:

```bash
./scripts/backup.sh
```

### Logs

View application logs:

```bash
docker-compose logs -f taskflow-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

## 🔄 Updates & Roadmap

### Current Version: 1.0.0

### Planned Features:
- [ ] Email notifications
- [ ] File attachments
- [ ] Advanced filtering and search
- [ ] Team collaboration features
- [ ] Mobile app
- [ ] API integrations
- [ ] Advanced analytics and reporting

---

Built with ❤️ using React, Convex, and modern web technologies.
