---
name: git-workflows
description: Git workflow patterns for development teams. Use when setting up branching strategies, writing commits, creating PRs, or resolving merge conflicts. Triggers include "git", "branch", "commit", "pull request", "PR", "merge conflict", "rebase", "GitFlow", "trunk-based", or when managing version control. Covers branching strategies, commit conventions, PR best practices, and conflict resolution.
---

# Git Workflows Skill

Comprehensive Git workflow patterns for development teams. This skill covers:
1. **Branching Strategies** - GitFlow, trunk-based, GitHub Flow
2. **Commit Conventions** - Conventional commits, good messages
3. **Pull Requests** - Templates, review process, best practices
4. **Merge Conflicts** - Resolution strategies and prevention

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Choose branching strategy | See [branching-strategies.md](references/branching-strategies.md) |
| Write good commits | See [commit-conventions.md](references/commit-conventions.md) |
| Create/review PRs | See [pull-requests.md](references/pull-requests.md) |
| Resolve conflicts | See [merge-conflicts.md](references/merge-conflicts.md) |

## Essential Commands

```bash
# Branches
git branch                     # List local branches
git branch -a                  # List all branches
git checkout -b feature/name   # Create and switch
git branch -d feature/name     # Delete local branch
git push origin --delete branch  # Delete remote branch

# Commits
git add -p                     # Interactive staging
git commit -m "message"        # Commit
git commit --amend             # Amend last commit

# Sync
git fetch origin               # Fetch remote changes
git pull --rebase origin main  # Pull with rebase
git push origin branch         # Push to remote

# Merge/Rebase
git merge feature-branch       # Merge
git rebase main                # Rebase onto main
git rebase -i HEAD~3           # Interactive rebase

# Undo
git reset --soft HEAD~1        # Undo commit, keep changes
git reset --hard HEAD~1        # Undo commit, discard changes
git revert <commit>            # Create undo commit
```

## Branch Naming

```
feature/  - New features         feature/user-authentication
fix/      - Bug fixes            fix/login-validation
hotfix/   - Production fixes     hotfix/security-patch
refactor/ - Code refactoring     refactor/api-cleanup
docs/     - Documentation        docs/api-reference
test/     - Testing              test/unit-coverage
chore/    - Maintenance          chore/update-deps
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add password reset functionality

fix(api): handle null response from payment service

docs(readme): update installation instructions
```

## Workflow Summary

### GitHub Flow (Simple)

```
main ──●──●──●──●──●──●──●──●──
         \         /
feature   ●──●──●──●  (PR + merge)
```

1. Create branch from `main`
2. Make commits
3. Open PR
4. Review & merge to `main`
5. Deploy

### Trunk-Based (Fast)

```
main ──●──●──●──●──●──●──●──●──
        \   /   \   /
short    ●─●     ●─●  (small, frequent merges)
```

1. Branch from `main`
2. Small changes (< 1 day)
3. Merge frequently
4. Feature flags for incomplete work

## PR Checklist

- [ ] Branch is up to date with main
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Self-reviewed changes
- [ ] Clear description
- [ ] Linked to issue (if applicable)

## Output Format

When setting up Git workflows:

```markdown
## Git Workflow: [Strategy Name]

### Branch Structure
- `main` - Production
- [other branches]

### Process
1. [Step 1]
2. [Step 2]

### Templates
[PR template, commit examples]
```
