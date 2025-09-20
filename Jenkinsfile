pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'taskflow-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY = 'docker.io' // Docker Hub
        DOCKER_USERNAME = 'akhil1426' // Replace with your Docker Hub username
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
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint and Type Check') {
            steps {
                script {
                    sh 'npm run lint'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_USERNAME}/${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
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
                    sh """
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
                    sh """
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
                    sh '''
                        sleep 30
                        curl -f http://localhost:3000 || exit 1
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
