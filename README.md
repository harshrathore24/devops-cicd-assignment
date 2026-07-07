# DevOps CI/CD Assignment

## Overview

This project demonstrates a complete DevOps CI/CD pipeline using GitHub, Jenkins, Docker, Docker Hub, Kubernetes (Minikube), and AWS EC2.

The pipeline automatically builds, tests, pushes Docker images to Docker Hub, and deploys the latest version to Kubernetes.

---

## Architecture

GitHub
   │
   ▼
Jenkins CI Pipeline
   │
   ├── Checkout Source Code
   ├── Build Docker Image
   ├── Run Automated Tests
   ├── Push Image to Docker Hub
   └── Trigger CD Pipeline
            │
            ▼
     Jenkins CD Pipeline
            │
            ├── Update Kubernetes Deployment
            ├── Apply Kubernetes Manifests
            └── Rolling Update
                     │
                     ▼
                Minikube Cluster

---

## Tech Stack

- Git & GitHub
- Jenkins
- Docker
- Docker Hub
- Kubernetes (Minikube)
- AWS EC2 (Ubuntu)
- Linux

---

## CI Pipeline

The CI pipeline performs the following steps:

1. Checkout source code from GitHub.
2. Login to Docker Hub.
3. Build Docker image.
4. Execute automated tests.
5. Push versioned image to Docker Hub.
6. Trigger CD pipeline.

---

## CD Pipeline

The CD pipeline performs:

1. Checkout latest source code.
2. Replace image placeholders in Kubernetes manifests.
3. Deploy application using kubectl.
4. Perform rolling update with latest Docker image.
5. Verify deployment status.

---

## Docker

Docker image is built automatically during the CI pipeline.

Images are tagged as:

```
dockerhub_username/devops-cicd-assignment:<BUILD_NUMBER>
dockerhub_username/devops-cicd-assignment:latest
```

---

## Kubernetes

Resources created:

- Deployment
- Service

Deployment uses Rolling Update strategy.

---

## Deployment

Application is deployed on:

- AWS EC2
- Kubernetes (Minikube)

---

## Repository Structure

```
.
├── app
├── k8s
│   ├── deployment.yaml
│   └── service.yaml
├── Jenkinsfile-CI
├── Jenkinsfile-CD
├── Dockerfile
└── README.md
```

---

## CI/CD Flow

Developer Push
      │
      ▼
 GitHub Repository
      │
      ▼
 Jenkins CI
      │
      ▼
 Docker Build
      │
      ▼
 Run Tests
      │
      ▼
 Docker Hub
      │
      ▼
 Jenkins CD
      │
      ▼
 Kubernetes Deployment
      │
      ▼
 Running Application

---

## Deliverables

- Source Code
- Dockerfile
- Jenkins CI Pipeline
- Jenkins CD Pipeline
- Kubernetes Manifests
- Docker Hub Image
- Running Application URL

---

## Author

Harsh Rathore