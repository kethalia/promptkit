# Cleanup Unused Code

Workflow for safely identifying and removing dead code from a codebase.

## Why Remove Dead Code?

- **Reduces confusion** - Developers don't waste time understanding unused code
- **Reduces bugs** - Less code = less surface area for bugs
- **Improves performance** - Smaller bundles, faster builds
- **Easier maintenance** - Less code to update during changes

## Types of Dead Code

| Type | Description | Detection Method |
|------|-------------|------------------|
| Unreachable | Code that can never execute | Static analysis |
| Unused exports | Exported but never imported | Dependency analysis |
| Unused variables | Declared but never used | Linter |
| Unused functions | Defined but never called | Call graph analysis |
| Unused files | Files never imported | Import analysis |
| Dead branches | Conditions that are always true/false | Static analysis |
| Commented code | Old code left in comments | Manual review |
| Deprecated code | Marked deprecated, no longer used | Search + analysis |

## Safe Removal Process

### Step 1: Identify Candidates

**Automated detection:**

```bash
# JavaScript - find unused exports
npx ts-prune

# JavaScript - find unused files
npx unimported

# JavaScript - dead code detection
npx knip

# Python - find unused code
vulture src/

# Python - find unused imports
autoflake --check src/

# General - find unused variables (linters)
eslint --rule 'no-unused-vars: error'
pylint --disable=all --enable=unused-variable
```

**Manual indicators:**
- Code with old dates in git blame
- Functions with no callers
- Commented-out blocks
- TODO/FIXME marked for removal

### Step 2: Verify It's Actually Unused

**Don't trust tools blindly!** Check for:

- Dynamic imports: `require(variable)`, `import()`
- Reflection: `getattr()`, `Object[key]`
- Framework magic: decorators, dependency injection
- External consumers: API endpoints, library users
- Conditional compilation: feature flags, environments
- Tests: code may only be used in tests

**Verification checklist:**

```markdown
- [ ] Search codebase for references
- [ ] Check for dynamic usage
- [ ] Check for external consumers
- [ ] Check git history (was it ever used?)
- [ ] Check if it's a public API
- [ ] Ask team if anyone knows its purpose
```

### Step 3: Assess Risk

| Risk Level | Characteristics | Approach |
|------------|-----------------|----------|
| Low | Private function, well-tested area | Remove directly |
| Medium | Exported function, some tests | Remove with monitoring |
| High | Public API, unclear usage | Deprecate first, then remove |

### Step 4: Remove Safely

**Low risk removal:**
```bash
# Delete and commit
git rm unused-file.js
git commit -m "chore: remove unused file"
```

**Medium risk removal:**
```javascript
// 1. Add deprecation warning
/** @deprecated Will be removed in v2.0 */
function oldFunction() {
  console.warn('oldFunction is deprecated');
  // ...
}

// 2. After observation period, remove
```

**High risk removal:**
```javascript
// 1. Deprecate with notice
/** 
 * @deprecated since v1.5, will be removed in v2.0
 * Use newFunction() instead
 */
function oldFunction() {
  console.warn('oldFunction is deprecated. Use newFunction instead.');
  return newFunction();
}

// 2. Monitor usage in production
// 3. Remove after migration period
```

## Common Dead Code Patterns

### Pattern 1: Unused Imports

```javascript
// Before
import { used, unused } from './utils';  // 'unused' never used
import * as helpers from './helpers';    // Only helpers.one used

// After
import { used } from './utils';
import { one } from './helpers';
```

**Detection:**
```bash
eslint --rule 'no-unused-vars: error'
```

### Pattern 2: Unreachable Code

```javascript
// After return
function example() {
  return result;
  console.log('never runs');  // Dead
}

// Impossible condition
if (false) {
  // Dead code
}

// After throw
function validate() {
  throw new Error('Invalid');
  return false;  // Dead
}
```

**Detection:**
```bash
eslint --rule 'no-unreachable: error'
```

### Pattern 3: Unused Functions

```javascript
// Defined but never called
function helperThatWasReplacedLongAgo() {
  // 100 lines of code nobody calls
}

// Only called from other dead code
function onlyCalledByDeadCode() {
  // ...
}
```

**Detection:**
```bash
npx ts-prune       # TypeScript
npx knip           # JavaScript
vulture src/       # Python
```

### Pattern 4: Dead Feature Flags

```javascript
// Feature flag that's always true now
if (FEATURE_NEW_CHECKOUT) {  // Always true for 2 years
  newCheckout();
} else {
  oldCheckout();  // Dead
}
```

**Action:** Remove flag and dead branch.

### Pattern 5: Commented Code

```javascript
function processOrder(order) {
  // Old implementation - keeping just in case
  // const total = items.reduce((sum, i) => sum + i.price, 0);
  // if (total > 100) { applyDiscount(); }
  
  return newProcessOrder(order);
}
```

**Action:** Delete commented code. Git history preserves it if needed.

### Pattern 6: Orphaned Files

```
src/
├── components/
│   ├── Button.jsx        ✓ Used
│   ├── OldHeader.jsx     ✗ Not imported anywhere
│   └── Card.jsx          ✓ Used
```

**Detection:**
```bash
npx unimported
```

### Pattern 7: Unused Dependencies

```json
// package.json
{
  "dependencies": {
    "used-package": "^1.0.0",
    "installed-but-never-imported": "^2.0.0"  // Dead
  }
}
```

**Detection:**
```bash
npx depcheck
```

## Cleanup Workflow

### Phase 1: Automated Cleanup

```bash
# 1. Remove unused imports
npx eslint --fix --rule 'no-unused-vars: error' src/

# 2. Remove unused dependencies
npx depcheck
npm uninstall unused-package

# 3. Run tests
npm test
```

### Phase 2: Tool-Assisted Review

```bash
# Generate dead code report
npx knip > dead-code-report.txt

# Review each item
# Verify it's actually unused
# Remove if safe
```

### Phase 3: Manual Review

Look for:
- Old TODO comments mentioning removal
- Code with very old git blame dates
- Functions with unclear purposes
- Suspiciously complex unused code

## Cleanup Report Template

```markdown
## Dead Code Cleanup Report

### Summary
- Files analyzed: X
- Dead code items found: X
- Items removed: X
- Items kept (justified): X

### Removed Items

| Item | Type | Location | Confidence |
|------|------|----------|------------|
| `oldHelper` | Function | utils.js:45 | High |
| `unused.js` | File | src/unused.js | High |
| `lodash` | Dependency | package.json | Medium |

### Kept Items (False Positives)

| Item | Reason |
|------|--------|
| `dynamicUtil` | Used via dynamic import |
| `publicAPI` | External consumers |

### Recommendations
- [ ] Add lint rule to prevent unused imports
- [ ] Set up regular dead code audits
- [ ] Review feature flags quarterly
```

## Prevention

### Linting Rules

```javascript
// .eslintrc
{
  "rules": {
    "no-unused-vars": "error",
    "no-unreachable": "error",
    "no-unused-expressions": "error"
  }
}
```

### CI Checks

```yaml
# GitHub Action
- name: Check for dead code
  run: |
    npx knip --no-exit-code > knip-report.txt
    if [ -s knip-report.txt ]; then
      echo "::warning::Dead code detected"
      cat knip-report.txt
    fi
```

### Regular Audits

Schedule quarterly reviews:
1. Run dead code detection tools
2. Review flagged items
3. Remove confirmed dead code
4. Update documentation
