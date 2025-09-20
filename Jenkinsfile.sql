pipeline {
    agent any
    
    environment {
        FRONTEND_IMAGE = 'taskflow-frontend'
        BACKEND_IMAGE = 'taskflow-backend'
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY = 'docker.io' // Docker Hub
        DOCKER_USERNAME = 'akhil1426' // Replace with your Docker Hub username
        DB_PASSWORD = credentials('db-password') // Jenkins credential for database password
        JWT_SECRET = credentials('jwt-secret') // Jenkins credential for JWT secret
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm ci'
                    bat 'cd backend && npm ci'
                }
            }
        }
        
        stage('Lint and Type Check') {
            steps {
                script {
                    bat 'npm run lint'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    bat 'npm run build'
                }
            }
        }
        
        stage('Database Migration') {
            steps {
                script {
                    bat 'cd backend && npm run migrate'
                }
            }
        }
        
        stage('Build Frontend Docker Image') {
            steps {
                script {
                    def frontendImage = docker.build("${DOCKER_USERNAME}/${FRONTEND_IMAGE}:${DOCKER_TAG}")
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-credentials') {
                        frontendImage.push()
                        frontendImage.push('latest')
                    }
                }
            }
        }
        
        stage('Build Backend Docker Image') {
            steps {
                script {
                    def backendImage = docker.build("${DOCKER_USERNAME}/${BACKEND_IMAGE}:${DOCKER_TAG}", "./backend")
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-credentials') {
                        backendImage.push()
                        backendImage.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    bat """
                        docker-compose -f docker-compose.staging.yml down
                        docker-compose -f docker-compose.staging.yml pull
                        docker-compose -f docker-compose.staging.yml up -d
                    """
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Deploy to production?', ok: 'Deploy'
                    bat """
                        docker-compose -f docker-compose.prod.yml down
                        docker-compose -f docker-compose.prod.yml pull
                        docker-compose -f docker-compose.prod.yml up -d
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    bat '''
                        timeout 30
                        curl -f http://localhost:5000/health || exit 1
                        curl -f http://localhost:3000 || exit 1
                    '''
                }
            }
        }
        
        stage('Database Health Check') {
            steps {
                script {
                    bat '''
                        timeout 30
                        docker exec $(docker ps -q -f name=postgres) pg_isready -U postgres || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
            // Add notification logic here (Slack, email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification logic here
        }
    }
}
