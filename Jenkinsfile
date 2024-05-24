pipeline {
    agent any

    stages {
        stage('Build and Test Backend') {
            steps {
                build job: 'backend-pipeline-job'
            }
        }
        stage('Build and Test Frontend') {
            steps {
                build job: 'frontend-pipeline-job'
            }
        }
    }
}
