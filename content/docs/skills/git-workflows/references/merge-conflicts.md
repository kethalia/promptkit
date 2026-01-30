---
title: "Merge Conflicts"
---
# Merge Conflicts

Guide to resolving and preventing Git merge conflicts.

## Understanding Conflicts

### When Conflicts Occur

- Same lines modified in both branches
- File deleted in one branch, modified in another
- File renamed differently in both branches

### Conflict Markers

```
<<<<<<< HEAD
Your changes (current branch)
=======
Their changes (incoming branch)
>>>>>>> feature-branch
```

## Resolving Conflicts

### Basic Workflow

```bash
# 1. Start merge
git merge feature-branch
# CONFLICT message appears

# 2. See conflicted files
git status

# 3. Open and resolve each file
# Edit files to resolve conflicts

# 4. Mark as resolved
git add <resolved-file>

# 5. Complete merge
git commit
# or
git merge --continue
```

### Abort Merge

```bash
# Cancel merge and return to previous state
git merge --abort
```

## Resolution Strategies

### Keep Ours (Current Branch)

```bash
# Keep our version for specific file
git checkout --ours path/to/file
git add path/to/file

# Keep our version for all conflicts
git checkout --ours .
git add .
```

### Keep Theirs (Incoming Branch)

```bash
# Keep their version for specific file
git checkout --theirs path/to/file
git add path/to/file

# Keep their version for all conflicts
git checkout --theirs .
git add .
```

### Manual Resolution

```javascript
// Before (with conflict markers)
<<<<<<< HEAD
const API_URL = 'https://api.example.com';
=======
const API_URL = 'https://staging-api.example.com';
>>>>>>> feature-branch

// After (resolved - choose one or combine)
const API_URL = process.env.API_URL || 'https://api.example.com';
```

### Using Merge Tool

```bash
# Open visual merge tool
git mergetool

# Configure merge tool (VS Code)
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# Configure merge tool (vim)
git config --global merge.tool vimdiff
```

## Rebase Conflicts

### During Rebase

```bash
git rebase main
# CONFLICT appears

# Resolve conflict in files, then:
git add <resolved-files>
git rebase --continue

# Or abort
git rebase --abort

# Or skip this commit
git rebase --skip
```

### Interactive Rebase Conflicts

```bash
git rebase -i HEAD~3
# Edit commits, conflicts may occur

# Resolve each conflict:
git add <files>
git rebase --continue
```

## Common Conflict Scenarios

### Both Modified Same Lines

```
<<<<<<< HEAD
function getUserName(user) {
  return user.firstName + ' ' + user.lastName;
}
=======
function getUserName(user) {
  return `${user.firstName} ${user.lastName}`;
}
>>>>>>> feature-branch

// Resolution: Choose the better implementation
function getUserName(user) {
  return `${user.firstName} ${user.lastName}`;
}
```

### Both Added Different Content

```
// file.js
import { useState } from 'react';
<<<<<<< HEAD
import { useAuth } from './hooks/useAuth';
=======
import { useUser } from './hooks/useUser';
>>>>>>> feature-branch

// Resolution: Keep both if needed
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
```

### Deleted vs Modified

```bash
# File deleted in one branch, modified in another
CONFLICT (modify/delete): file.txt deleted in HEAD and modified in feature.

# To keep the file:
git add file.txt

# To delete the file:
git rm file.txt
```

### Package.json/Lock File Conflicts

```bash
# Resolve package.json manually, then regenerate lock file
# Edit package.json to resolve conflicts
git add package.json

# Regenerate lock file
rm package-lock.json
npm install
git add package-lock.json

# Or for yarn
rm yarn.lock
yarn install
git add yarn.lock
```

### Binary Files

```bash
# Binary files can't be merged automatically
CONFLICT (content): Merge conflict in image.png

# Keep ours
git checkout --ours image.png

# Or keep theirs
git checkout --theirs image.png

git add image.png
```

## Prevention Strategies

### 1. Pull Frequently

```bash
# Update your branch regularly
git checkout feature-branch
git fetch origin
git rebase origin/main
# Or
git merge origin/main
```

### 2. Keep Branches Short-Lived

- Merge frequently (at least daily for trunk-based)
- Smaller PRs = fewer conflicts

### 3. Communicate with Team

- Coordinate on shared files
- Don't refactor and add features simultaneously

### 4. Use Feature Flags

```javascript
// Merge incomplete work without conflicts
if (featureFlags.newFeature) {
  // New implementation
} else {
  // Old implementation
}
```

### 5. Modular Code

- Separate concerns into different files
- Avoid large files that everyone edits

## VS Code Conflict Resolution

### Inline Options

VS Code shows inline options above conflict:
- **Accept Current Change** - Keep HEAD
- **Accept Incoming Change** - Keep theirs
- **Accept Both Changes** - Keep both
- **Compare Changes** - Side-by-side diff

### Source Control Panel

1. Open Source Control panel (Ctrl+Shift+G)
2. Click on conflicted file
3. Use merge editor (3-way view)
4. Stage resolved files

## Advanced: Rerere

Git can remember conflict resolutions:

```bash
# Enable rerere (reuse recorded resolution)
git config --global rerere.enabled true

# Now when you resolve a conflict, Git remembers
# Next time the same conflict occurs, Git auto-resolves it

# View recorded resolutions
ls .git/rr-cache/

# Forget a resolution
git rerere forget path/to/file
```

## Conflict Resolution Checklist

### When You Hit a Conflict

1. [ ] Don't panic
2. [ ] Read the conflict markers carefully
3. [ ] Understand both changes
4. [ ] Decide on correct resolution
5. [ ] Test the resolved code
6. [ ] Stage and commit

### After Resolution

- [ ] Code compiles/runs
- [ ] Tests pass
- [ ] Functionality works as expected
- [ ] No conflict markers left in code

## Quick Reference

| Situation | Command |
|-----------|---------|
| See conflicted files | `git status` |
| Keep our version | `git checkout --ours file` |
| Keep their version | `git checkout --theirs file` |
| Open merge tool | `git mergetool` |
| Abort merge | `git merge --abort` |
| Continue after resolving | `git merge --continue` |
| Abort rebase | `git rebase --abort` |
| Continue rebase | `git rebase --continue` |
