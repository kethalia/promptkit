---
title: "Code Comments"
---
# Code Comments

Guide to writing effective inline and block comments.

## Comment Philosophy

### When to Comment

**Do comment:**
- Complex algorithms and business logic
- Non-obvious decisions and trade-offs
- Workarounds and their reasons
- TODO items and technical debt
- Public APIs (always)

**Don't comment:**
- What code does (the code should say that)
- Obvious operations
- Every line of code
- Commented-out code (delete it)

### Code Should Be Self-Documenting First

```javascript
// ❌ Bad: Comment explains what code does
// Loop through users and check if active
for (let i = 0; i < users.length; i++) {
  if (users[i].status === 1) {
    // Add to active users
    activeUsers.push(users[i]);
  }
}

// ✅ Good: Code is self-explanatory
const activeUsers = users.filter(user => user.isActive);
```

## Comment Types

### Explanatory Comments (Why)

```javascript
// We use a binary search here because the list is always sorted
// and can contain millions of items. Linear search was too slow
// for our P95 latency requirements (<50ms).
const index = binarySearch(sortedItems, target);

// Intentionally not using async/await here to allow parallel
// execution of all fetch requests.
const promises = urls.map(url => fetch(url));
```

### Warning Comments

```python
# WARNING: This function modifies the input array in place.
# Pass a copy if you need to preserve the original.
def sort_in_place(items):
    items.sort()

# SECURITY: User input must be sanitized before reaching this point.
# This function assumes trusted input.
def execute_query(query):
    ...
```

### TODO Comments

```javascript
// TODO: Replace with proper caching mechanism
// Issue: #1234
// Owner: @username
const cachedValue = globalCache[key];

// FIXME: This breaks for negative numbers
// Temporary workaround until math library is updated
const result = Math.abs(value);

// HACK: Working around library bug in v2.3.1
// Remove when upgrading to v2.4+
const adjusted = value + 0.001;

// NOTE: This intentionally differs from the spec
// See design doc: https://docs.example.com/decision-123
```

### Section Comments

```python
# =============================================================================
# Configuration
# =============================================================================

DATABASE_URL = os.environ.get("DATABASE_URL")
CACHE_TTL = 3600

# =============================================================================
# Helper Functions
# =============================================================================

def format_date(dt):
    ...

# =============================================================================
# Main Logic
# =============================================================================

def process():
    ...
```

### Inline Comments

```javascript
const timeout = 5000;  // milliseconds

const mask = 0xFF;  // Last 8 bits

users.filter(u => u.age >= 18)  // Legal requirement
     .map(u => u.email);
```

## Language-Specific Patterns

### JavaScript/TypeScript

```typescript
// Single-line comment

/* 
 * Multi-line comment
 * for longer explanations
 */

/**
 * JSDoc comment for documentation
 * @param value - The input value
 */

// @ts-ignore - Suppress TypeScript error (avoid if possible)
// @ts-expect-error - Expect an error on next line

// eslint-disable-next-line no-console
console.log('Debug');

/* eslint-disable */
// ... code with disabled linting
/* eslint-enable */
```

### Python

```python
# Single-line comment

# Multi-line comment
# using multiple single-line
# comments

"""
Docstring for modules, classes, and functions.
Not technically a comment, but used for documentation.
"""

# type: ignore  # Suppress type checker warning

# noqa: E501  # Suppress specific flake8 warning

# pragma: no cover  # Exclude from coverage
```

### Go

```go
// Single-line comment

/*
Multi-line comment
for longer explanations
*/

// Package-level comment for godoc
// placed immediately before package declaration

//go:generate command  // Code generation directive

//go:build linux  // Build constraint

//nolint:errcheck  // Suppress linter warning
```

### Rust

```rust
// Single-line comment

/* Multi-line comment */

/// Documentation comment for next item
/// Supports **markdown**

//! Module-level documentation comment

#[allow(dead_code)]  // Suppress compiler warning

// SAFETY: Explanation of why unsafe code is sound
unsafe {
    // ...
}
```

## Anti-Patterns

### Redundant Comments

```javascript
// ❌ Bad: States the obvious
i++; // Increment i

// ❌ Bad: Repeats the code
// Set user name to "John"
user.name = "John";

// ❌ Bad: Outdated comment
// Calculate tax at 5%
const tax = price * 0.08;  // Actually 8%!
```

### Commented-Out Code

```javascript
// ❌ Bad: Dead code in comments
function calculate(x) {
  // Old implementation
  // const result = x * 2;
  // return result + 1;
  
  return x * 2 + 1;
}

// ✅ Good: Delete it, use version control
function calculate(x) {
  return x * 2 + 1;
}
```

### Over-Commenting

```javascript
// ❌ Bad: Every line commented
function addNumbers(a, b) {
  // Store the first number
  const first = a;
  // Store the second number
  const second = b;
  // Add the numbers together
  const sum = first + second;
  // Return the sum
  return sum;
}

// ✅ Good: Self-explanatory code
function addNumbers(a, b) {
  return a + b;
}
```

## Comment Maintenance

### Keep Comments Updated

```javascript
// ❌ Bad: Stale comment
// Retry up to 3 times
const MAX_RETRIES = 5;  // Comment says 3!

// ✅ Good: Use constants that document themselves
const MAX_RETRIES = 5;

// Or if comment needed:
const MAX_RETRIES = 5;  // Increased from 3 due to flaky network
```

### Link to External Resources

```javascript
// Implementation based on:
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(array) {
  ...
}

// Workaround for browser bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=12345
if (isChrome) {
  ...
}
```

## Comment Template

```javascript
/**
 * [Brief description of what this does]
 *
 * [Longer explanation if needed, including:]
 * - Why this approach was chosen
 * - Important caveats or limitations
 * - Performance characteristics
 *
 * [Reference links if applicable]
 *
 * @param {Type} param - [Description]
 * @returns {Type} [Description]
 * @throws {ErrorType} [When this happens]
 *
 * @example
 * [Working example]
 */
```

## Quick Reference

| Type | Use For | Example |
|------|---------|---------|
| `//` | Brief inline notes | `// milliseconds` |
| `/* */` | Longer explanations | Algorithm description |
| `/** */` | API documentation | Function docs |
| `TODO:` | Future work | `// TODO: Add caching` |
| `FIXME:` | Known bugs | `// FIXME: Race condition` |
| `HACK:` | Workarounds | `// HACK: Library bug` |
| `NOTE:` | Important info | `// NOTE: Intentional` |
| `WARNING:` | Danger zones | `// WARNING: Not thread-safe` |
