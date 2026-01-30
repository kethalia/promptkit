---
title: "Review Current Changes"
---
# Review Current Changes

Quick workflow for reviewing staged or unstaged changes before committing.

## Purpose

Pre-commit review catches issues before they enter the codebase:
- Prevent accidental commits (debug code, secrets, incomplete work)
- Ensure changes are cohesive and ready
- Self-review before requesting peer review

## Getting Your Changes

```bash
# Staged changes only (what will be committed)
git diff --staged

# All changes (staged + unstaged)
git diff HEAD

# Changes in specific file
git diff --staged path/to/file.js

# Changes with more context
git diff --staged -U10  # 10 lines of context

# Changed files list
git diff --staged --name-only
```

## Quick Review Checklist

### 🚨 Immediate Red Flags

Check first - these should never be committed:

- [ ] **No secrets** - API keys, passwords, tokens
- [ ] **No debug code** - console.log, print statements, debugger
- [ ] **No commented-out code** - Remove or restore, don't leave commented
- [ ] **No TODOs without tickets** - Either fix or create tracking issue
- [ ] **No unintended files** - Check for accidental inclusions

### ✅ Change Quality

- [ ] **Focused changes** - Does everything relate to one purpose?
- [ ] **Complete changes** - Nothing half-done or missing?
- [ ] **Correct changes** - Logic looks right at a glance?

### 📝 Commit Readiness

- [ ] **Tests pass** - Run relevant tests
- [ ] **Linting passes** - No style violations
- [ ] **Builds successfully** - No compilation errors

## Review Process

### Step 1: File Overview

First, understand what's changing:

```bash
git diff --staged --stat
```

Ask yourself:
- Are these the files I expected to change?
- Any unexpected files in the list?
- Is the scope appropriate for one commit?

### Step 2: Scan for Red Flags

Quickly grep for common issues:

```bash
# Check for debug statements
git diff --staged | grep -E "(console\.(log|debug|error)|print\(|debugger|TODO|FIXME|XXX)"

# Check for potential secrets (basic)
git diff --staged | grep -iE "(password|secret|api.?key|token|credential)"

# Check for large additions that might need splitting
git diff --staged --stat | tail -1
```

### Step 3: Detailed Review

Go through each file's changes:

**For each hunk, ask:**
1. What is this change doing?
2. Is this change correct?
3. Is this change complete?
4. Is this change necessary?

### Step 4: Test Verification

Before committing:

```bash
# Run relevant tests
npm test                    # Node.js
pytest                      # Python
go test ./...              # Go
cargo test                 # Rust

# Run linting
npm run lint               # ESLint
ruff check .              # Python
go vet ./...              # Go
```

## Common Issues to Catch

### Code Quality

```
🔴 Hardcoded values that should be config
🔴 Missing error handling
🔴 Duplicate code that could be shared
🟠 Overly complex logic
🟠 Missing input validation
🟡 Inconsistent naming
🟡 Missing comments on complex sections
```

### Security

```
🔴 Exposed credentials or secrets
🔴 SQL injection vulnerabilities
🔴 Unsanitized user input
🟠 Overly permissive access
🟠 Missing authentication checks
```

### Performance

```
🟠 N+1 query patterns
🟠 Missing indexes on new queries
🟠 Unbounded loops or queries
🟡 Inefficient algorithms for data size
```

## Output Template

When reviewing your own changes:

```markdown
## Pre-Commit Review

### Changes Summary
- [Brief description of what changed]

### Files Modified
- `path/to/file.js` - [what changed]
- `path/to/other.js` - [what changed]

### Checklist
- [x] No secrets or credentials
- [x] No debug code
- [x] Tests pass
- [x] Linting passes
- [ ] Documentation updated (if needed)

### Ready to Commit?
- [ ] Yes, good to go
- [ ] No, need to fix: [issues]
```

## Commit Message Guidance

After review passes, write a good commit message:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Example:**
```
feat(auth): add password reset functionality

- Add forgot password endpoint
- Add email sending service
- Add password reset token generation

Closes #123
```

## Integration Tips

### Pre-commit Hook

Add automatic checks with a pre-commit hook:

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Check for debug statements
if git diff --cached | grep -E "console\.(log|debug)" > /dev/null; then
    echo "⚠️  Warning: Found console.log statements"
    echo "Remove them or use --no-verify to bypass"
    exit 1
fi

# Run tests
npm test || exit 1

# Run linter
npm run lint || exit 1
```

### Alias for Quick Review

```bash
# Add to ~/.gitconfig or ~/.bashrc
alias review='git diff --staged | less'
alias review-stat='git diff --staged --stat'
```
