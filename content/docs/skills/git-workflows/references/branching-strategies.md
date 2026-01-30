---
title: "Branching Strategies"
---
# Branching Strategies

Guide to choosing and implementing Git branching strategies.

## Strategy Comparison

| Strategy | Best For | Complexity | Release Cadence |
|----------|----------|------------|-----------------|
| **GitHub Flow** | Small teams, continuous deployment | Low | Continuous |
| **Trunk-Based** | Experienced teams, CI/CD | Low | Continuous |
| **GitFlow** | Scheduled releases, multiple versions | High | Scheduled |
| **GitLab Flow** | Environment-based deployments | Medium | Environment-based |

## GitHub Flow

Simple, effective for most teams.

### Structure

```
main ──●──●──●──●──●──●──●──●──●──●──
         \         /     \       /
feature   ●──●──●──●       ●──●──●
          (PR + merge)     (PR + merge)
```

### Branches

- `main` - Always deployable, protected
- `feature/*` - Short-lived feature branches

### Workflow

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/user-profile

# 2. Make changes and commit
git add .
git commit -m "feat: add user profile page"

# 3. Push and create PR
git push origin feature/user-profile
# Create PR on GitHub

# 4. After review, merge via GitHub PR
# Delete branch after merge

# 5. Deploy main
```

### Rules

- `main` is always deployable
- Branch from `main`, merge to `main`
- Use PRs for all changes
- Deploy immediately after merge

## Trunk-Based Development

Fast-moving teams with strong CI/CD.

### Structure

```
main ──●──●──●──●──●──●──●──●──●──●──
        \   /   \   /   \   /
short    ●─●     ●─●     ●─●
         (1 day max)
```

### Branches

- `main` (trunk) - Single source of truth
- Short-lived branches (< 1-2 days)

### Workflow

```bash
# 1. Create short-lived branch
git checkout main
git pull origin main
git checkout -b add-login-button

# 2. Make small, focused changes
git add .
git commit -m "feat: add login button"

# 3. Merge quickly (same day ideally)
git checkout main
git pull origin main
git merge add-login-button
git push origin main

# Or via quick PR
```

### Key Practices

- **Small commits** - Merge multiple times per day
- **Feature flags** - Hide incomplete features
- **Strong CI** - Comprehensive automated tests
- **No long-lived branches** - Max 1-2 days

### Feature Flags Example

```javascript
// Incomplete feature hidden behind flag
if (featureFlags.newCheckout) {
  return <NewCheckout />;
}
return <OldCheckout />;
```

## GitFlow

For scheduled releases and version maintenance.

### Structure

```
main     ──●────────────●────────────●──
            \          / \          /
release      ●──●──●──●   ●──●──●──●
              \      /
develop  ──●──●──●──●──●──●──●──●──●──●──
            \    /   \    /
feature      ●──●     ●──●
```

### Branches

| Branch | Purpose | Branches From | Merges To |
|--------|---------|---------------|-----------|
| `main` | Production releases | - | - |
| `develop` | Integration | - | `release` |
| `feature/*` | New features | `develop` | `develop` |
| `release/*` | Release prep | `develop` | `main`, `develop` |
| `hotfix/*` | Production fixes | `main` | `main`, `develop` |

### Workflow

```bash
# Feature development
git checkout develop
git checkout -b feature/new-feature
# ... make changes ...
git checkout develop
git merge feature/new-feature

# Create release
git checkout develop
git checkout -b release/1.2.0
# ... version bump, final fixes ...
git checkout main
git merge release/1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"
git checkout develop
git merge release/1.2.0

# Hotfix
git checkout main
git checkout -b hotfix/critical-fix
# ... fix ...
git checkout main
git merge hotfix/critical-fix
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git checkout develop
git merge hotfix/critical-fix
```

### When to Use

- Scheduled release cycles (weekly, monthly)
- Need to maintain multiple versions
- Larger teams with dedicated QA phase
- Enterprise software

## GitLab Flow

Environment-based with upstream merges.

### Structure

```
production ──●─────────●─────────●──
              \       / \       /
staging   ──●──●──●──●───●──●──●──●──
             \     /      \     /
main     ──●──●──●──●──●──●──●──●──●──
            \    /      \    /
feature      ●──●        ●──●
```

### Workflow

```bash
# 1. Feature branch from main
git checkout -b feature/x

# 2. Merge to main via PR
# 3. Deploy to staging (auto or manual)
git checkout staging
git merge main

# 4. Deploy to production
git checkout production
git merge staging
```

## Branch Protection Rules

### GitHub Settings

```yaml
# .github/settings.yml (with probot/settings app)
branches:
  - name: main
    protection:
      required_pull_request_reviews:
        required_approving_review_count: 1
        dismiss_stale_reviews: true
      required_status_checks:
        strict: true
        contexts:
          - "ci/test"
          - "ci/lint"
      enforce_admins: false
      restrictions: null
```

### Manual Setup

1. Repository Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators (optional)

## Choosing a Strategy

### Use GitHub Flow If:
- Small team (< 10 developers)
- Deploying continuously
- Single production version
- Simple release process

### Use Trunk-Based If:
- Experienced team
- Strong CI/CD pipeline
- Comfortable with feature flags
- Want maximum velocity

### Use GitFlow If:
- Scheduled releases
- Multiple versions in production
- Separate QA/release process
- Enterprise environment

### Use GitLab Flow If:
- Multiple environments
- Need environment-specific branches
- Want simpler than GitFlow
- Using GitLab

## Quick Reference

| Action | GitHub Flow | Trunk-Based | GitFlow |
|--------|-------------|-------------|---------|
| New feature | Branch from `main` | Branch from `main` | Branch from `develop` |
| Merge to | `main` via PR | `main` directly | `develop` via PR |
| Release | Deploy `main` | Deploy `main` + flags | `release` branch |
| Hotfix | Branch from `main` | Fix in `main` | Branch from `main` |
