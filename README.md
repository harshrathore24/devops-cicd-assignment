# Sample DevOps App — CI/CD Pipeline Assignment

A simple Node.js/Express app with a full CI/CD pipeline: GitHub → Jenkins (or GitHub Actions) →
Docker Hub/ECR → Kubernetes (EKS) or EC2, with Prometheus + Grafana monitoring.

## Project Structure
```
.
├── app/
│   ├── app.js
│   ├── app.test.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── hpa.yaml
├── monitoring/
│   ├── prometheus.yml
│   └── docker-compose-monitoring.yml
├── .github/workflows/ci-cd.yml
├── Jenkinsfile
└── README.md
```

---

## Step-by-Step Setup

### Step 1: Source Code Management
1. Create a new repo on GitHub (e.g. `devops-cicd-assignment`).
2. Push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: app + Dockerfile + CI/CD pipeline"
   git branch -M main
   git remote add origin https://github.com/<your-username>/devops-cicd-assignment.git
   git push -u origin main
   ```

### Step 2: Dockerize & Test Locally
```bash
cd app
docker build -t sample-devops-app .
docker run -p 3000:3000 sample-devops-app
curl http://localhost:3000/health
```

### Step 3: Push Image to a Registry
**Docker Hub:**
```bash
docker login
docker tag sample-devops-app <dockerhub-username>/sample-devops-app:latest
docker push <dockerhub-username>/sample-devops-app:latest
```

**AWS ECR (alternative):**
```bash
aws ecr create-repository --repository-name sample-devops-app
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag sample-devops-app <account-id>.dkr.ecr.<region>.amazonaws.com/sample-devops-app:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/sample-devops-app:latest
```

### Step 4: Configure Jenkins
1. Install Jenkins (EC2 instance or local Docker: `docker run -p 8080:8080 jenkins/jenkins:lts`).
2. Install plugins: **Docker Pipeline**, **Kubernetes CLI**, **SSH Agent**, **Git**.
3. Add credentials in Jenkins (Manage Jenkins → Credentials):
   - `dockerhub-credentials` — Docker Hub username/password
   - `kubeconfig-file` — Secret file, your EKS kubeconfig (or use `ec2-ssh-key` for EC2 deploy)
4. Create a new Pipeline job → point it to your GitHub repo → it will auto-detect the `Jenkinsfile`.
5. (Optional) Add a GitHub Webhook so Jenkins auto-triggers on every push:
   `Repo Settings → Webhooks → Add: http://<jenkins-url>/github-webhook/`

### Step 5: Deploy
**Option A — EC2:**
```bash
docker run -d -p 80:3000 --name sample-app <dockerhub-username>/sample-devops-app:latest
```

**Option B — Kubernetes (EKS):**
```bash
aws eks update-kubeconfig --name <cluster-name> --region <region>
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl get svc sample-app-service   # get the LoadBalancer external IP/URL
```

### Step 6: Monitoring
**Local quick test (docker-compose):**
```bash
cd monitoring
docker-compose -f docker-compose-monitoring.yml up -d
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001 (admin / admin123)
```

**On Kubernetes** (recommended for real cluster):
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```
This installs Prometheus + Grafana + Alertmanager with pre-built Kubernetes dashboards
(CPU, memory, pod health, restarts, etc.). The app's pod annotations
(`prometheus.io/scrape: "true"`) let Prometheus auto-discover and scrape `/metrics`.

---

## CI/CD Flow
```
Developer → git push → GitHub → Jenkins/GitHub Actions webhook
  → Checkout → Install & Test → Build Docker Image → Push to Registry
  → Deploy to EC2/EKS → Prometheus scrapes metrics → Grafana dashboards
```

## Deliverables Checklist
- [x] GitHub repository (push this project, then share the link)
- [x] Dockerfile (`app/Dockerfile`)
- [x] Jenkins pipeline script (`Jenkinsfile`) + GitHub Actions alternative (`.github/workflows/ci-cd.yml`)
- [ ] Running application URL (fill in after you deploy to EC2/EKS)
- [x] Deployment configuration (`k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/hpa.yaml`)

## Notes / Design Decisions
- Multi-stage, non-root Dockerfile for smaller image size and container hardening (DevSecOps).
- `/health` and `/ready` endpoints back Kubernetes liveness/readiness probes.
- `/metrics` endpoint exposes a basic Prometheus-format counter; pod annotations enable auto-scrape.
- HPA scales 2→6 replicas based on CPU/memory utilization.
- Both Jenkins and GitHub Actions pipelines are included so you can demo either depending on what's asked in the interview.
