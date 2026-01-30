# GitHub Actions

Guide to building CI/CD pipelines with GitHub Actions.

## Workflow Structure

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:

env:
  NODE_VERSION: '20'

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Step name
        uses: action/name@version
        with:
          param: value
      - name: Run command
        run: echo "Hello"
```

## Triggers

### Push and PR

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
      - 'docs/**'
  
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### Schedule

```yaml
on:
  schedule:
    - cron: '0 0 * * *'    # Daily at midnight
    - cron: '0 */6 * * *'  # Every 6 hours
    - cron: '0 9 * * 1'    # Monday 9am
```

### Manual & Workflow Call

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      debug:
        description: 'Enable debug'
        type: boolean
        default: false

# Usage in steps
steps:
  - run: echo "Deploying to ${{ inputs.environment }}"
```

### Release

```yaml
on:
  release:
    types: [published, created]
```

## Jobs

### Basic Job

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

### Job Matrix

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20, 22]
        exclude:
          - os: macos-latest
            node: 18
      fail-fast: false
      max-parallel: 4
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Job Dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Job Outputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.value }}
    steps:
      - id: version
        run: echo "value=$(cat package.json | jq -r .version)" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

## Common Actions

### Checkout

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0        # Full history
    submodules: recursive # Include submodules
```

### Setup Languages

```yaml
# Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    registry-url: 'https://npm.pkg.github.com'

# Python
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'

# Go
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
    cache: true

# Rust
- uses: actions-rust-lang/setup-rust-toolchain@v1
  with:
    toolchain: stable
```

### Caching

```yaml
# Generic cache
- uses: actions/cache@v4
  with:
    path: |
      ~/.cache
      node_modules
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-

# Built-in caching (setup-node, setup-python, etc.)
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### Artifacts

```yaml
# Upload
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7

# Download
- uses: actions/download-artifact@v4
  with:
    name: build-output
    path: dist/
```

## Environment & Secrets

### Environment Variables

```yaml
env:
  CI: true
  NODE_ENV: production

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: postgres://localhost/test
    steps:
      - run: echo $NODE_ENV
        env:
          DEBUG: true
```

### Secrets

```yaml
steps:
  - run: ./deploy.sh
    env:
      API_KEY: ${{ secrets.API_KEY }}
      AWS_ACCESS_KEY: ${{ secrets.AWS_ACCESS_KEY_ID }}
```

### Environments

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy.sh ${{ vars.API_URL }}
        env:
          API_KEY: ${{ secrets.API_KEY }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    steps:
      - run: ./deploy.sh
```

## Conditionals

```yaml
steps:
  # Run on main branch only
  - run: ./deploy.sh
    if: github.ref == 'refs/heads/main'
  
  # Run on PR
  - run: npm run lint
    if: github.event_name == 'pull_request'
  
  # Run on success
  - run: echo "Success!"
    if: success()
  
  # Run on failure
  - run: ./notify-failure.sh
    if: failure()
  
  # Always run
  - run: ./cleanup.sh
    if: always()
  
  # Complex condition
  - run: ./deploy.sh
    if: |
      github.ref == 'refs/heads/main' &&
      github.event_name == 'push' &&
      !contains(github.event.head_commit.message, '[skip ci]')
```

## Services (Databases, etc.)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
    
    steps:
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
```

## Reusable Workflows

### Define Reusable Workflow

```yaml
# .github/workflows/deploy-reusable.yml
name: Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy_key:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.deploy_key }}
```

### Call Reusable Workflow

```yaml
# .github/workflows/main.yml
jobs:
  deploy-staging:
    uses: ./.github/workflows/deploy-reusable.yml
    with:
      environment: staging
    secrets:
      deploy_key: ${{ secrets.STAGING_DEPLOY_KEY }}

  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/deploy-reusable.yml
    with:
      environment: production
    secrets:
      deploy_key: ${{ secrets.PROD_DEPLOY_KEY }}
```

## Composite Actions

```yaml
# .github/actions/setup-project/action.yml
name: Setup Project
description: Setup Node.js and install dependencies

inputs:
  node-version:
    description: Node.js version
    default: '20'

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: 'npm'
    - run: npm ci
      shell: bash
    - run: npm run build
      shell: bash
```

```yaml
# Usage
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      node-version: '20'
```
