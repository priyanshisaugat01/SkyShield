# 🛡️ SkyShield

> Cloud-native DevSecOps compliance automation platform for aviation infrastructure.

![License](https://img.shields.io/badge/License-Apache%202.0-blue)
![AWS](https://img.shields.io/badge/AWS-EKS-orange)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-blue)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-success)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple)

---

# 📖 Project Overview

SkyShield is an enterprise-inspired DevSecOps platform built for aviation cloud infrastructure. It demonstrates how modern cloud applications can be secured, containerized, continuously validated, and deployed using AWS cloud services and Kubernetes.

The project integrates Infrastructure as Code (Terraform), container security scanning, secret detection, CI/CD automation, Docker, Amazon ECR, and Amazon EKS into one complete cloud-native deployment pipeline.

Unlike a traditional web application, SkyShield focuses on the **entire DevSecOps lifecycle**, from infrastructure provisioning to production deployment.

---

# 🎯 Vision

To make infrastructure security an automated, non-negotiable stage of every deployment pipeline by integrating security validation directly into CI/CD before applications reach production.

---

# 🚀 Live Deployment

SkyShield has been successfully deployed to **Amazon Elastic Kubernetes Service (Amazon EKS)**.

### Deployment Stack

- GitHub
- GitHub Actions
- Terraform
- Docker
- Amazon ECR
- Amazon EKS
- Kubernetes
- AWS Elastic Load Balancer
- Checkov
- Trivy
- GitLeaks

---

# 🌍 Live Application

The application is deployed on Amazon EKS and exposed through an AWS Elastic Load Balancer.

## Homepage

![Homepage](screenshots/homepage-eks.png)

---

# ⚙️ CI/CD Pipeline

SkyShield uses GitHub Actions to automate security validation and container deployment.

### Pipeline Stages

- Infrastructure Security Scan (Checkov)
- Secret Detection (GitLeaks)
- Container Vulnerability Scan (Trivy)
- Docker Image Build
- Push Docker Image to Amazon ECR
- Kubernetes Deployment on Amazon EKS

## GitHub Actions

![GitHub Actions](screenshots/github-actions.png)

---

# ☸️ Amazon EKS Deployment

The application is deployed as Kubernetes Pods inside an Amazon EKS cluster.

## Amazon EKS Cluster

![Amazon EKS](screenshots/eks-cluster.png)

---

# 🏗️ Architecture

```text
                 Developer
                     │
                 git push
                     │
                     ▼
              GitHub Repository
                     │
                     ▼
             GitHub Actions CI
                     │
     ┌───────────────┼────────────────┐
     │               │                │
     ▼               ▼                ▼
 Checkov         GitLeaks          Trivy
     │               │                │
     └───────────────┼────────────────┘
                     │
                     ▼
              Docker Build
                     │
                     ▼
              Amazon ECR
                     │
                     ▼
              Amazon EKS
                     │
             Kubernetes Deployment
                     │
               ReplicaSet
                     │
                 Running Pods
                     │
            Kubernetes Service
                     │
                     ▼
        AWS Elastic Load Balancer
                     │
                     ▼
                 End Users
```

---

# 🔄 DevSecOps Workflow

1. Developer pushes code to GitHub.
2. GitHub Actions automatically starts.
3. Terraform files are scanned using Checkov.
4. GitLeaks scans the repository for exposed secrets.
5. Trivy scans the Docker image for vulnerabilities.
6. Docker image is built.
7. Docker image is pushed to Amazon Elastic Container Registry.
8. Kubernetes pulls the latest image from Amazon ECR.
9. Amazon EKS deploys the application.
10. AWS Load Balancer exposes the application to the Internet.

---

# 🛠️ Tech Stack

## Cloud

- Amazon Web Services (AWS)
- IAM
- VPC
- EC2
- S3
- Amazon ECR
- Amazon EKS
- Elastic Load Balancer
- CloudWatch

## Infrastructure as Code

- Terraform

## Containers

- Docker
- Docker Hub

## Orchestration

- Kubernetes
- Amazon EKS

## CI/CD

- GitHub Actions

## Security

- Checkov
- Trivy
- GitLeaks

## Frontend

- HTML
- CSS
- JavaScript

---

# ✨ Features

- Infrastructure as Code using Terraform
- Cloud-native architecture
- Containerized application
- GitHub Actions CI/CD
- Infrastructure Security Scanning
- Secret Detection
- Container Vulnerability Scanning
- Amazon ECR integration
- Amazon EKS deployment
- Kubernetes orchestration
- AWS Load Balancer
- Enterprise-inspired DevSecOps workflow

---

# 📂 Project Structure

```text
SkyShield
│
├── .github/
│   └── workflows/
│
├── infra/
│   └── terraform/
│
├── k8s/
│
├── website/
│
├── screenshots/
│   ├── homepage-eks.png
│   ├── github-actions.png
│   └── eks-cluster.png
│
└── README.md
```

---

# 📚 Skills Demonstrated

- AWS Cloud
- Docker
- Kubernetes
- Amazon EKS
- Amazon ECR
- Terraform
- GitHub Actions
- Infrastructure as Code
- DevSecOps
- CI/CD
- Security Automation
- Cloud Deployment

---

# 🚀 Future Enhancements

- ArgoCD GitOps Deployment
- Helm Charts
- Prometheus Monitoring
- Grafana Dashboards
- AWS Secrets Manager
- Horizontal Pod Autoscaler
- Blue/Green Deployments
- Canary Deployments
- Terraform Remote State
- Multi-Environment Deployment

---

# 📸 Deployment Proof

✔ Successfully deployed on Amazon EKS

✔ Publicly accessible through AWS Elastic Load Balancer

✔ Docker images stored in Amazon ECR

✔ GitHub Actions CI pipeline implemented

✔ Infrastructure managed using Terraform

✔ Security integrated with Checkov, Trivy and GitLeaks

---

# 👩‍💻 Author

**Priyanshi Saugat**

Cloud | AWS | DevOps | Kubernetes | Terraform | Docker | DevSecOps

---

## ⭐ Support

If you found this project interesting, consider giving it a ⭐ on GitHub.
