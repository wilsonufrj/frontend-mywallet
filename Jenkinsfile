pipeline {
    agent any // Using 'any' for now, can be configured to use a specific Docker agent if needed

    stages {
        stage('Checkout') {
            steps {
                // Get some code from a GitHub repository
                git 'https://github.com/lucasfontesgaspareto/mywallet.git' // Replace with your repository URL
                script {
                    // Print the current branch (optional)
                    def currentBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    echo "Current branch is: ${currentBranch}"
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Assuming Dockerfile is in the root of the repository
                    def imageName = "mywallet:${env.BUILD_NUMBER ?: 'latest'}"
                    sh "docker build -t ${imageName} ."
                    echo "Docker image built: ${imageName}"
                }
            }
        }
        // stage('Push Docker Image') {
        //     steps {
        //         script {
        //             // This stage is commented out as it requires Docker Hub credentials
        //             // def imageName = "mywallet:${env.BUILD_NUMBER ?: 'latest'}"
        //             // withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB_CREDENTIALS', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
        //             //     sh "docker login -u ${USERNAME} -p ${PASSWORD}"
        //             //     sh "docker tag ${imageName} yourdockerhubusername/${imageName}" // Replace 'yourdockerhubusername'
        //             //     sh "docker push yourdockerhubusername/${imageName}"
        //             //     echo "Docker image pushed: yourdockerhubusername/${imageName}"
        //             // }
        //         }
        //     }
        // }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Clean up workspace (optional)
            // cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
