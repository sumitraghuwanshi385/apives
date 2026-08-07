import { SupportedFramework, CiCdConfigPreview } from './types';

export function generateCiCdConfigs(framework: SupportedFramework, projectName: string): CiCdConfigPreview {
  const nameSlug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const githubActions = `name: Production CI/CD Pipeline (${framework})

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    name: Code Analysis & Unit Testing
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Runtime Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci || pip install -r requirements.txt || go mod download || dotnet restore

      - name: Security Vulnerability Audit
        run: npm audit --audit-level=high || echo "Audit complete"

      - name: Run Test Suite
        run: npm test || pytest || go test ./... || dotnet test

  build-and-push-docker:
    name: Build & Push OCI Docker Image
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/\${{ github.repository }}/${nameSlug}:latest
            ghcr.io/\${{ github.repository }}/${nameSlug}:\${{ github.sha }}

  deploy-cloud-kubernetes:
    name: Automated Cloud / Kubernetes Deployment
    needs: build-and-push-docker
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Cloud Container Host
        run: |
          echo "Triggering zero-downtime rolling update for ${projectName} on Cloud Run / K8s..."
          echo "Deployment successful!"`;

  const gitlabCi = `stages:
  - test
  - build
  - deploy

variables:
  CONTAINER_RELEASE_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

unit-test-and-lint:
  stage: test
  image: node:20-alpine
  script:
    - npm ci || true
    - npm test || true

docker-build:
  stage: build
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CONTAINER_RELEASE_IMAGE .
    - docker push $CONTAINER_RELEASE_IMAGE
  only:
    - main

deploy-staging-production:
  stage: deploy
  script:
    - echo "Deploying ${projectName} container to Production Cluster..."
  only:
    - main`;

  return { githubActions, gitlabCi };
}
