pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout Repositories') {
            parallel {
                stage('Checkout Backend') {
                    steps {
                        dir('backend') {
                            git url: 'https://github.com/your-repo/backend.git', branch: 'main'
                        }
                    }
                }
                stage('Checkout Frontend') {
                    steps {
                        dir('frontend') {
                            git url: 'https://github.com/your-repo/frontend.git', branch: 'main'
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build Projects') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Test Projects') {
            parallel {
                stage('Test Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Test Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Adjust these commands based on your deployment strategy
                    sh 'docker-compose down'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            deleteDir()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
