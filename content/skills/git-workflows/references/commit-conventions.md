# Commit Conventions

Guide to writing clear, consistent commit messages.

## Conventional Commits

Standard format adopted by many projects.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user registration` |
| `fix` | Bug fix | `fix: resolve login timeout` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting (no code change) | `style: fix indentation` |
| `refactor` | Code restructuring | `refactor: extract validation logic` |
| `test` | Adding tests | `test: add user service tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf: optimize image loading` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `build` | Build system | `build: update webpack config` |
| `revert` | Revert commit | `revert: undo feature X` |

### Scope (Optional)

Area of codebase affected:

```
feat(auth): add OAuth2 support
fix(api): handle null response
docs(readme): add installation steps
test(user): add registration tests
```

### Subject Rules

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at end
- Max 50 characters

```bash
# ✅ Good
feat: add password reset flow
fix: prevent duplicate form submission

# ❌ Bad
feat: Added password reset flow.      # Past tense, period
fix: Prevents duplicate submissions   # Third person
```

### Body (Optional)

Explain **what** and **why**, not how:

```
fix(auth): prevent session timeout during checkout

Users were being logged out mid-checkout due to the 15-minute
session timeout. Extended timeout to 30 minutes for checkout
flow and added session refresh on user activity.

Closes #234
```

### Footer

```
# Breaking change
feat(api)!: change authentication endpoint

BREAKING CHANGE: /auth/login now requires email instead of username

# Reference issues
fix: resolve payment processing error

Fixes #123
Closes #456
Refs #789
```

## Examples

### Feature

```
feat(cart): add quantity selector to cart items

Allow users to update item quantities directly in cart
without removing and re-adding items.

- Add increment/decrement buttons
- Add direct input field
- Update totals on change

Closes #145
```

### Bug Fix

```
fix(checkout): prevent double charge on retry

Payment was being processed twice when users clicked
retry after a timeout error. Added idempotency key
to prevent duplicate charges.

Fixes #892
```

### Refactor

```
refactor(user): extract address validation

Move address validation logic from UserService to
dedicated AddressValidator class for reuse in
shipping and billing modules.
```

### Breaking Change

```
feat(api)!: require API version header

BREAKING CHANGE: All API requests must now include
X-API-Version header. Requests without version
will return 400 Bad Request.

Migration guide: docs/api-versioning.md
```

## Git Hooks

### Commitlint Setup

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'api',
      'auth',
      'ui',
      'db',
      'docs',
    ]],
  },
};
```

### Husky Setup

```bash
npm install --save-dev husky
npx husky init
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

## Commit Best Practices

### Make Atomic Commits

```bash
# ❌ Bad: Multiple unrelated changes
git add .
git commit -m "fix login and update styles and add tests"

# ✅ Good: Separate commits
git add src/auth/
git commit -m "fix(auth): resolve login timeout issue"

git add src/styles/
git commit -m "style(button): update primary button colors"

git add tests/
git commit -m "test(auth): add login integration tests"
```

### Interactive Staging

```bash
# Stage specific hunks
git add -p

# Choose what to stage:
# y - stage this hunk
# n - don't stage this hunk
# s - split into smaller hunks
# e - manually edit hunk
```

### Amend Last Commit

```bash
# Add forgotten files
git add forgotten-file.js
git commit --amend --no-edit

# Fix commit message
git commit --amend -m "fix: correct message"
```

### Interactive Rebase (Clean Up Before PR)

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# In editor:
pick abc1234 feat: add login page
squash def5678 fix: typo in login
squash ghi9012 fix: another typo

# Result: One clean commit
```

## Commit Message Templates

### Git Config Template

```bash
# Set template
git config --global commit.template ~/.gitmessage
```

```
# ~/.gitmessage
# <type>(<scope>): <subject>
# |<----  Using a Maximum Of 50 Characters  ---->|

# [optional body]
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# [optional footer(s)]
# - Fixes #issue
# - BREAKING CHANGE: description

# Type can be:
#   feat     - New feature
#   fix      - Bug fix
#   docs     - Documentation
#   style    - Formatting
#   refactor - Code restructure
#   test     - Tests
#   chore    - Maintenance
```

## Useful Commands

```bash
# View commit history (pretty)
git log --oneline --graph

# View commit details
git show <commit>

# Search commits by message
git log --grep="login"

# View file history
git log --follow -p -- path/to/file

# Blame (who changed what)
git blame path/to/file

# Find commit that introduced bug
git bisect start
git bisect bad
git bisect good <known-good-commit>
```

## Quick Reference

| What | Format |
|------|--------|
| New feature | `feat(scope): add feature` |
| Bug fix | `fix(scope): resolve issue` |
| Breaking change | `feat(scope)!: change with BREAKING CHANGE footer` |
| Documentation | `docs(scope): update docs` |
| Refactor | `refactor(scope): restructure code` |
| Tests | `test(scope): add tests` |
| Dependencies | `chore(deps): update package` |
