# Deployment Strategies

Guide to deploying applications with CI/CD pipelines.

## Deployment Strategies Overview

| Strategy | Description | Risk | Rollback |
|----------|-------------|------|----------|
| **Rolling** | Gradually replace instances | Low | Slow |
| **Blue-Green** | Switch between two environments | Low | Instant |
| **Canary** | Route % of traffic to new version | Very Low | Fast |
| **Recreate** | Stop old, start new | High | Slow |

## Basic Deployment Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: ./deploy.sh staging
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: ./deploy.sh production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## Platform-Specific Deployments

### Vercel

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### AWS (S3 + CloudFront)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - run: aws s3 sync dist/ s3://${{ vars.S3_BUCKET }} --delete
      
      - run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ vars.CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

### AWS ECS

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - uses: aws-actions/amazon-ecr-login@v2
        id: login-ecr
      
      - name: Build and push image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/myapp:$IMAGE_TAG .
          docker push $ECR_REGISTRY/myapp:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production \
            --service myapp \
            --force-new-deployment
```

### Kubernetes

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: azure/k8s-set-context@v3
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/myapp \
            myapp=myregistry/myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

### Docker Hub + VPS

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: myuser/myapp:${{ github.sha }},myuser/myapp:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull myuser/myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 3000:3000 myuser/myapp:latest
```

## Blue-Green Deployment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Determine target environment
        id: target
        run: |
          CURRENT=$(curl -s https://api.myapp.com/health | jq -r .environment)
          if [ "$CURRENT" = "blue" ]; then
            echo "target=green" >> $GITHUB_OUTPUT
          else
            echo "target=blue" >> $GITHUB_OUTPUT
          fi
      
      - name: Deploy to target environment
        run: ./deploy.sh ${{ steps.target.outputs.target }}
      
      - name: Run smoke tests
        run: ./smoke-test.sh ${{ steps.target.outputs.target }}
      
      - name: Switch traffic
        run: ./switch-traffic.sh ${{ steps.target.outputs.target }}
```

## Canary Deployment

```yaml
jobs:
  deploy-canary:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy canary (10% traffic)
        run: |
          kubectl set image deployment/myapp-canary myapp=myapp:${{ github.sha }}
          kubectl scale deployment/myapp-canary --replicas=1
      
      - name: Wait and monitor
        run: |
          sleep 300  # 5 minutes
          ERROR_RATE=$(curl -s prometheus/api/v1/query?query=error_rate | jq .data.result[0].value[1])
          if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
            echo "Error rate too high, rolling back"
            kubectl rollout undo deployment/myapp-canary
            exit 1
          fi
  
  deploy-full:
    needs: deploy-canary
    runs-on: ubuntu-latest
    steps:
      - name: Full rollout
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
          kubectl rollout status deployment/myapp
```

## Rollback

### Manual Rollback Workflow

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Rollback deployment
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ inputs.version }}
          kubectl rollout status deployment/myapp
```

### Automatic Rollback

```yaml
- name: Deploy with automatic rollback
  run: |
    kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
    
    if ! kubectl rollout status deployment/myapp --timeout=5m; then
      echo "Deployment failed, rolling back"
      kubectl rollout undo deployment/myapp
      exit 1
    fi
```

## Environment Protection

```yaml
# In workflow
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com

# Configure in GitHub:
# Settings > Environments > production
# - Required reviewers
# - Wait timer (e.g., 15 minutes)
# - Deployment branches (main only)
```

## Deployment Notifications

```yaml
- name: Notify Slack on success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    channel-id: 'deployments'
    slack-message: '✅ Deployed ${{ github.sha }} to production'
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_TOKEN }}

- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    channel-id: 'deployments'
    slack-message: '❌ Deployment failed for ${{ github.sha }}'
  env:
    SLACK_BOT_TOKEN: ${{ secrets.SLACK_TOKEN }}
```

## Database Migrations

```yaml
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run migrations
        run: |
          npm run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
  
  deploy:
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - name: Deploy application
        run: ./deploy.sh
```

## Deployment Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Database migrations ready
- [ ] Feature flags configured
- [ ] Rollback plan documented

### During Deployment
- [ ] Monitor error rates
- [ ] Watch application logs
- [ ] Check health endpoints
- [ ] Verify key functionality

### After Deployment
- [ ] Run smoke tests
- [ ] Monitor metrics for 15-30 min
- [ ] Update deployment documentation
- [ ] Notify stakeholders
