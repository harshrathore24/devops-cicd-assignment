pipeline {
    agent any

    environment {
        // Docker Hub / ECR repo details - update these to your own
        DOCKER_REGISTRY   = 'docker.io'                     // or '<aws_account_id>.dkr.ecr.<region>.amazonaws.com'
        IMAGE_NAME        = 'yourdockerhubuser/sample-devops-app'
        IMAGE_TAG         = "${env.BUILD_NUMBER}"
        DOCKERHUB_CREDS   = credentials('dockerhub-credentials')  // Jenkins credential ID
        // AWS/EKS deploy vars (only needed if deploying to K8s)
        KUBECONFIG_CRED   = credentials('kubeconfig-file')        // Jenkins "Secret file" credential ID
        EC2_SSH_CRED      = 'ec2-ssh-key'                          // Jenkins SSH credential ID (for EC2 deploy option)
        EC2_HOST          = 'ec2-user@<EC2_PUBLIC_IP>'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Install & Unit Test') {
            steps {
                dir('app') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('app') {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Scan Image (optional security check)') {
            steps {
                echo 'Run a vulnerability scan here, e.g. trivy image ${IMAGE_NAME}:${IMAGE_TAG}'
                // sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Push Image to Registry') {
            steps {
                sh "echo ${DOCKERHUB_CREDS_PSW} | docker login -u ${DOCKERHUB_CREDS_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                sh "docker push ${IMAGE_NAME}:latest"
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Choose ONE of the two deploy options below based on your target.

                    // ---------- OPTION 1: Deploy to EC2 via SSH ----------
                    // sshagent(credentials: [EC2_SSH_CRED]) {
                    //     sh """
                    //         ssh -o StrictHostKeyChecking=no ${EC2_HOST} '
                    //             docker pull ${IMAGE_NAME}:latest &&
                    //             docker stop sample-app || true &&
                    //             docker rm sample-app || true &&
                    //             docker run -d --name sample-app -p 80:3000 ${IMAGE_NAME}:latest
                    //         '
                    //     """
                    // }

                    // ---------- OPTION 2: Deploy to Kubernetes (EKS) ----------
                    withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                        sh """
                            kubectl set image deployment/sample-app-deployment \
                                sample-app=${IMAGE_NAME}:${IMAGE_TAG} --record
                            kubectl rollout status deployment/sample-app-deployment
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! App deployed.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
        always {
            sh 'docker logout || true'
        }
    }
}
