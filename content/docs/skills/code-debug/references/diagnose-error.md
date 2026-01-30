---
title: "Diagnose Error"
---
# Diagnose Error

Systematic approach to understanding and fixing error messages.

## Error Diagnosis Process

### Step 1: Read the Error Carefully

Errors typically contain:

```
[Error Type]: [Error Message]
    at [Location] ([File]:[Line]:[Column])
    at [Call Stack...]
```

**Extract:**
- Error type/name
- Error message
- File and line number
- Call stack

### Step 2: Understand the Error Type

#### JavaScript/TypeScript Errors

| Error Type | Meaning | Common Cause |
|------------|---------|--------------|
| `SyntaxError` | Invalid code syntax | Missing bracket, typo |
| `ReferenceError` | Undefined variable used | Typo, scope issue, missing import |
| `TypeError` | Wrong type operation | Null access, wrong method call |
| `RangeError` | Value out of range | Invalid array length, recursion |
| `URIError` | Invalid URI functions | Bad encodeURI input |

**TypeError Examples:**
```javascript
// "Cannot read property 'x' of undefined"
obj.x  // obj is undefined

// "x is not a function"
x()    // x is not callable

// "Cannot set property 'x' of null"
obj.x = 1  // obj is null
```

#### Python Errors

| Error Type | Meaning | Common Cause |
|------------|---------|--------------|
| `SyntaxError` | Invalid syntax | Indentation, missing colon |
| `NameError` | Undefined name | Typo, scope issue |
| `TypeError` | Wrong type | Wrong argument type |
| `ValueError` | Wrong value | Invalid conversion |
| `AttributeError` | Missing attribute | Wrong object type |
| `KeyError` | Missing dict key | Key doesn't exist |
| `IndexError` | Index out of range | List too short |
| `ImportError` | Import failed | Module not found |

**Common Python Errors:**
```python
# NameError: name 'x' is not defined
print(x)  # x never defined

# TypeError: unsupported operand type(s)
"hello" + 5  # Can't add str and int

# KeyError: 'missing'
d = {}
d['missing']  # Key doesn't exist

# AttributeError: 'NoneType' has no attribute 'x'
result = None
result.x  # Accessing attribute on None
```

#### Go Errors

| Error Pattern | Meaning | Common Cause |
|---------------|---------|--------------|
| `nil pointer dereference` | Accessing nil pointer | Uninitialized pointer |
| `index out of range` | Array bounds exceeded | Wrong index calculation |
| `invalid memory address` | Bad pointer | Dangling pointer |
| `deadlock` | All goroutines blocked | Channel/mutex issue |

#### Java Errors

| Error Type | Meaning | Common Cause |
|------------|---------|--------------|
| `NullPointerException` | Null dereference | Uninitialized object |
| `ArrayIndexOutOfBoundsException` | Bad array index | Off-by-one error |
| `ClassCastException` | Invalid cast | Wrong type assumption |
| `NumberFormatException` | Parse failure | Invalid number string |

### Step 3: Locate the Error

**Find the relevant line:**
1. Look at the first line of stack trace (usually your code)
2. Skip framework/library lines
3. Find the first line in YOUR codebase

**Example:**
```
Error: Cannot read property 'name' of undefined
    at getUserName (src/utils/user.js:15:20)     ← YOUR CODE - start here
    at processUsers (src/services/users.js:42:10) ← YOUR CODE
    at Router.handle (node_modules/express/...)   ← Framework - skip
```

### Step 4: Understand the Context

At the error line, determine:

1. **What operation failed?**
   - Property access? Method call? Arithmetic?

2. **What value caused it?**
   - What was undefined/null/wrong type?

3. **Where did that value come from?**
   - Parameter? Return value? Global state?

### Step 5: Trace the Root Cause

Work backwards:

```
Error at line 15: user.name is undefined
  ↓ Why is user undefined?
Line 14: const user = getUser(id)
  ↓ Why does getUser return undefined?
Line in getUser: return users.find(u => u.id === id)
  ↓ Why does find return undefined?
Because no user has that id
  ↓ Why?
The id is wrong type (string vs number)
  ↓ ROOT CAUSE
```

## Common Error Patterns & Fixes

### Pattern 1: Null/Undefined Access

**Error:**
```
TypeError: Cannot read property 'x' of undefined
```

**Diagnosis Questions:**
- What variable is undefined?
- Where should it be defined?
- Why is it undefined?

**Fixes:**
```javascript
// Option 1: Optional chaining
const name = user?.profile?.name;

// Option 2: Default value
const name = (user && user.name) || 'Unknown';

// Option 3: Guard clause
if (!user) {
  throw new Error('User is required');
}

// Option 4: Fix the source
// Ensure user is always defined before use
```

### Pattern 2: Async/Timing Issues

**Error:**
```
TypeError: Cannot read property 'data' of undefined
// or
Promise { <pending> }
```

**Diagnosis Questions:**
- Is this async code?
- Is await missing?
- Is the promise resolved before access?

**Fixes:**
```javascript
// Missing await
const result = await fetchData();  // Add await

// Using promise result before ready
async function getData() {
  const data = await fetch(url);
  return data.json();  // Also async!
}

// Race condition
await Promise.all([promise1, promise2]);  // Wait for all
```

### Pattern 3: Type Mismatch

**Error:**
```
TypeError: x.map is not a function
```

**Diagnosis Questions:**
- What type is x actually?
- What type was expected?
- Where did x get the wrong type?

**Fixes:**
```javascript
// Ensure it's an array
const items = Array.isArray(data) ? data : [data];
items.map(...)

// Check type first
if (typeof x === 'string') {
  x.split(',').map(...)
}

// Fix the source that provides wrong type
```

### Pattern 4: Import/Module Errors

**Error:**
```
Error: Cannot find module 'x'
// or
SyntaxError: Cannot use import statement outside a module
```

**Diagnosis Questions:**
- Is the module installed?
- Is the path correct?
- Is it ESM vs CommonJS issue?

**Fixes:**
```bash
# Module not installed
npm install missing-module

# Wrong path
import x from './utils/x'  # Check relative path

# ESM/CJS mismatch
# Add "type": "module" to package.json
# Or use .mjs extension
# Or use require() instead of import
```

### Pattern 5: Scope/Closure Issues

**Error:**
```
ReferenceError: x is not defined
```

**Diagnosis Questions:**
- Where is x defined?
- Is it in scope at the error location?
- Is there a timing issue (var hoisting)?

**Fixes:**
```javascript
// Variable out of scope
function outer() {
  const x = 1;
}
function other() {
  console.log(x);  // x not in scope
}

// Fix: pass as parameter or use shared scope
function other(x) {
  console.log(x);
}
```

## Error Diagnosis Template

```markdown
## Error Diagnosis

### Error Message
```
[Paste exact error]
```

### Error Type
[e.g., TypeError, NullPointerException]

### What It Means
[Plain English explanation]

### Location
- File: [filename]
- Line: [line number]
- Code: `[the failing code]`

### Root Cause
[Why this error is occurring]

### Fix

```text
// Before
[broken code]

// After
[fixed code]
```

### Prevention
- [How to avoid this in the future]
- [Related best practices]
```

## Debugging Checklist

When an error occurs:

- [ ] Read the complete error message
- [ ] Identify the error type
- [ ] Find the line number in YOUR code
- [ ] Understand what operation failed
- [ ] Identify what value caused the failure
- [ ] Trace where that value came from
- [ ] Identify the root cause
- [ ] Implement the fix
- [ ] Add prevention (validation, types, tests)
