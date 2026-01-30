# Pull Requests

Guide to creating and reviewing effective pull requests.

## PR Best Practices

### Before Creating

- [ ] Branch is up to date with base branch
- [ ] All tests pass locally
- [ ] Code follows project style guide
- [ ] Self-reviewed all changes
- [ ] Removed debug code and console.logs
- [ ] Added/updated tests for changes

### Creating the PR

- [ ] Clear, descriptive title
- [ ] Detailed description
- [ ] Linked to related issue(s)
- [ ] Assigned reviewers
- [ ] Added appropriate labels
- [ ] Screenshots for UI changes

## PR Title Format

```
<type>: <description>

# Examples
feat: add user authentication
fix: resolve checkout timeout issue
docs: update API documentation
refactor: extract validation utilities
```

## PR Templates

### General PR Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
<!-- Brief description of changes -->

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Related Issues
<!-- Link to issues: Fixes #123, Closes #456 -->

## Changes Made
<!-- List main changes -->
- 
- 
- 

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Testing
<!-- Describe testing done -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have commented hard-to-understand areas
- [ ] I have updated documentation
- [ ] My changes generate no new warnings
- [ ] Tests pass locally
- [ ] Dependent changes have been merged
```

### Feature PR Template

```markdown
## Feature: [Feature Name]

### Summary
<!-- What does this feature do? Why is it needed? -->

### User Story
As a [type of user], I want [goal] so that [benefit].

### Implementation Details
<!-- Technical approach taken -->

### API Changes (if applicable)
<!-- New/modified endpoints, request/response examples -->

### Database Changes (if applicable)
<!-- New tables, migrations, schema changes -->

### Screenshots
<!-- UI screenshots or recordings -->

| Before | After |
|--------|-------|
| screenshot | screenshot |

### Testing Instructions
1. Step to test
2. Expected result

### Checklist
- [ ] Feature flag implemented (if needed)
- [ ] Documentation updated
- [ ] Tests added
- [ ] Accessibility considered
```

### Bug Fix PR Template

```markdown
## Bug Fix: [Brief Description]

### Problem
<!-- What was the bug? How did users experience it? -->

### Root Cause
<!-- What caused the bug? -->

### Solution
<!-- How does this PR fix it? -->

### Reproduction Steps (Before Fix)
1. Step
2. Step
3. Bug occurs

### Verification Steps (After Fix)
1. Step
2. Step
3. Bug no longer occurs

### Related Issues
Fixes #

### Regression Risk
<!-- Could this fix break anything else? -->

### Checklist
- [ ] Root cause identified
- [ ] Fix verified locally
- [ ] Regression test added
- [ ] No new warnings introduced
```

## Code Review Guidelines

### For Reviewers

**What to Look For:**

1. **Correctness**
   - Does the code do what it's supposed to?
   - Are edge cases handled?
   - Are there potential bugs?

2. **Design**
   - Is this the right approach?
   - Does it fit the architecture?
   - Is it maintainable?

3. **Readability**
   - Is the code clear?
   - Are names descriptive?
   - Is complexity manageable?

4. **Testing**
   - Are there sufficient tests?
   - Do tests cover edge cases?
   - Are tests readable?

5. **Security**
   - Input validation?
   - Authentication/authorization?
   - Sensitive data handling?

### Review Comments

```markdown
# Praise good code
👍 Nice refactor! This is much cleaner.

# Suggest improvements (not blocking)
💭 Consider using `const` here since it's not reassigned.

# Request changes (blocking)
🔴 This will throw if `user` is null. Please add a null check.

# Ask questions
❓ What's the reasoning behind this approach?

# Nitpick (optional, very minor)
🔧 Nit: Typo in comment - "recieve" → "receive"
```

### Comment Prefixes

| Prefix | Meaning |
|--------|---------|
| `blocking:` | Must be addressed before merge |
| `suggestion:` | Consider this improvement |
| `question:` | Need clarification |
| `nit:` | Very minor, optional |
| `praise:` | Positive feedback |

## PR Size Guidelines

### Ideal PR Size

- **Lines changed:** 200-400
- **Files changed:** < 10
- **Review time:** 15-30 minutes

### When PRs Are Too Large

```
❌ 2000+ lines, 50 files
   - Hard to review thoroughly
   - Higher chance of bugs
   - Difficult to revert
   - Merge conflicts more likely

✅ Split into smaller PRs:
   1. Database migrations
   2. Backend API changes
   3. Frontend implementation
   4. Tests
```

### Stacked PRs

```
PR 1: Add user model and migrations
  ↓
PR 2: Add user API endpoints (depends on PR 1)
  ↓
PR 3: Add user UI (depends on PR 2)
```

## GitHub CLI for PRs

```bash
# Create PR
gh pr create --title "feat: add login" --body "Description"

# Create PR interactively
gh pr create

# Create draft PR
gh pr create --draft

# List PRs
gh pr list
gh pr list --author @me

# View PR
gh pr view 123
gh pr view 123 --web  # Open in browser

# Check out PR locally
gh pr checkout 123

# Review PR
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please fix X"
gh pr review 123 --comment --body "Looks good overall"

# Merge PR
gh pr merge 123
gh pr merge 123 --squash
gh pr merge 123 --rebase

# Close PR
gh pr close 123
```

## Merge Strategies

### Merge Commit

```bash
git merge --no-ff feature-branch

# History:
#   *   Merge branch 'feature'
#   |\
#   | * commit 3
#   | * commit 2
#   | * commit 1
#   |/
#   * previous commit
```

**Use when:** Want to preserve branch history

### Squash Merge

```bash
git merge --squash feature-branch

# History:
#   * feat: add feature (all commits squashed)
#   * previous commit
```

**Use when:** Want clean linear history, branch has messy commits

### Rebase Merge

```bash
git rebase main
git checkout main
git merge feature-branch  # Fast-forward

# History:
#   * commit 3
#   * commit 2
#   * commit 1
#   * previous commit
```

**Use when:** Want linear history with individual commits preserved

## PR Checklist Summary

### Author Checklist
- [ ] Clear title and description
- [ ] Small, focused changes
- [ ] Tests pass
- [ ] Self-reviewed
- [ ] Documentation updated
- [ ] Screenshots for UI changes

### Reviewer Checklist
- [ ] Understand the context
- [ ] Check correctness
- [ ] Verify tests
- [ ] Consider edge cases
- [ ] Check for security issues
- [ ] Provide constructive feedback
