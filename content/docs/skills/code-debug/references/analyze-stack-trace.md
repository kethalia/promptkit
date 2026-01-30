---
title: "Analyze Stack Trace"
---
# Analyze Stack Trace

Guide to reading and interpreting stack traces across different languages.

## What is a Stack Trace?

A stack trace shows the sequence of function calls that led to an error:

```
Error: Something went wrong
    at functionC (file.js:30:5)    ← Error occurred here
    at functionB (file.js:20:3)    ← Called by this
    at functionA (file.js:10:3)    ← Called by this
    at main (file.js:5:1)          ← Entry point
```

**Reading direction:** Top = where error occurred, Bottom = where it started

## Stack Trace Anatomy

### Common Elements

```
[Error Type]: [Error Message]
    at [Function Name] ([File Path]:[Line]:[Column])
```

| Element | Meaning |
|---------|---------|
| Error Type | The class/type of error |
| Error Message | Description of what went wrong |
| Function Name | The function that was executing |
| File Path | Source file location |
| Line | Line number in source |
| Column | Character position on line |

## Language-Specific Formats

### JavaScript/Node.js

```javascript
TypeError: Cannot read property 'name' of undefined
    at getUserName (/app/src/utils/user.js:15:20)
    at processUser (/app/src/services/user-service.js:42:10)
    at /app/src/routes/users.js:18:5
    at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
    at next (node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (node_modules/express/lib/router/route.js:112:3)
```

**Key features:**
- Anonymous functions show as `at /path:line:col`
- node_modules = library code (usually skip)
- `[as alias]` shows internal names

### Python

```python
Traceback (most recent call last):
  File "/app/main.py", line 10, in <module>
    result = process_data(data)
  File "/app/services/processor.py", line 25, in process_data
    return transform(item)
  File "/app/utils/transform.py", line 15, in transform
    return item['name'].upper()
KeyError: 'name'
```

**Key features:**
- Bottom = where error occurred (opposite of JS!)
- `<module>` = top-level code
- Shows the actual code line

### Java

```java
java.lang.NullPointerException: Cannot invoke method on null object
    at com.example.UserService.getName(UserService.java:45)
    at com.example.UserController.getUser(UserController.java:30)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:897)
    ... 23 more
```

**Key features:**
- Full class paths
- `... N more` = truncated frames
- `Native Method` = JVM internals

### Go

```go
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x4a2b3c]

goroutine 1 [running]:
main.processUser(0x0)
        /app/main.go:25 +0x1c
main.main()
        /app/main.go:15 +0x45
exit status 2
```

**Key features:**
- Shows goroutine ID
- `+0x1c` = offset in function
- May show memory addresses

### Rust

```rust
thread 'main' panicked at 'called `Option::unwrap()` on a `None` value', src/main.rs:15:10
stack backtrace:
   0: std::panicking::begin_panic_handler
   1: core::panicking::panic_fmt
   2: core::panicking::panic
   3: core::option::Option<T>::unwrap
   4: myapp::process_user
             at ./src/main.rs:15:10
   5: myapp::main
             at ./src/main.rs:8:5
```

**Key features:**
- Numbered frames
- Shows both std library and user code
- `at ./path:line:col` for source locations

### C#/.NET

```csharp
System.NullReferenceException: Object reference not set to an instance of an object.
   at MyApp.Services.UserService.GetName() in C:\src\Services\UserService.cs:line 45
   at MyApp.Controllers.UserController.Get(Int32 id) in C:\src\Controllers\UserController.cs:line 30
   at lambda_method(Closure, Object, Object[])
   at Microsoft.AspNetCore.Mvc.Infrastructure.ActionMethodExecutor
```

**Key features:**
- Full namespace paths
- `in path:line N` format
- Lambda methods may be anonymous

## Reading Strategy

### Step 1: Find Your Code

Skip framework/library frames:

```
✗ node_modules/...
✗ java.lang/sun.reflect/...
✗ std::/core::/...
✓ /app/src/... (YOUR CODE)
✓ src/main/java/com/yourcompany/...
```

### Step 2: Find the Error Origin

Look for the first frame in YOUR code:

```javascript
TypeError: Cannot read property 'name' of undefined
    at getUserName (/app/src/utils/user.js:15:20)     ← START HERE
    at processUser (/app/src/services/user-service.js:42:10)
    at Layer.handle (node_modules/express/...)         ← SKIP
```

### Step 3: Understand the Call Chain

Read the story of how you got there:

```
main() called
  → userController.get() called
    → userService.process() called
      → utils.getName() called
        → ERROR: property 'name' of undefined
```

### Step 4: Identify the Problematic Value

From the error and location:

```javascript
// At user.js:15
const name = user.name;  // 'user' is undefined
              ↑
              This is undefined
```

## Common Stack Trace Patterns

### Null/Undefined Chain

```
at getName (user.js:15)       ← user.name failed
at processUser (service.js:30) ← user came from here
at getUser (api.js:20)        ← returned null/undefined
```

**Investigation:** Trace the null value back to its source.

### Async Stack Loss

```javascript
// Stack only shows async boundary
Error: Failed to fetch
    at fetch (internal)
    at async getUserData (api.js:10)
```

**Solution:** Enable async stack traces:
```javascript
// Node.js
Error.stackTraceLimit = 50;

// Chrome DevTools
Settings → Enable async stack traces
```

### Recursive Stack Overflow

```
at factorial (math.js:5)
at factorial (math.js:5)
at factorial (math.js:5)
... (repeated many times)
RangeError: Maximum call stack size exceeded
```

**Investigation:** Check recursion base case.

### Circular Dependency

```python
ImportError: cannot import name 'X' from 'module_a'
  File "module_a.py", line 1, in <module>
    from module_b import Y
  File "module_b.py", line 1, in <module>
    from module_a import X   ← Circular!
```

**Investigation:** Restructure imports or use lazy imports.

## Stack Trace Analysis Template

```markdown
## Stack Trace Analysis

### Error
- **Type:** [Error class/type]
- **Message:** [Error message]

### Location
- **File:** [filename]
- **Line:** [line number]
- **Function:** [function name]

### Call Chain
1. [Entry point]
2. [Intermediate call]
3. [Intermediate call]
4. [Error location] ← Error here

### Root Cause
[What caused the error]

### Fix
[How to fix it]
```

## Tools for Better Stack Traces

### JavaScript/Node.js

```bash
# Better async traces
node --async-stack-traces app.js

# Source maps for transpiled code
node --enable-source-maps app.js
```

### Python

```python
# Rich tracebacks
import traceback
traceback.print_exc()

# Better formatting
from rich.traceback import install
install(show_locals=True)
```

### Java

```bash
# Full stack traces (no truncation)
-XX:-OmitStackTraceInFastThrow
```

## Checklist for Stack Trace Analysis

- [ ] Identified the error type and message
- [ ] Found the first frame in my code
- [ ] Understood the call chain
- [ ] Identified the problematic value/operation
- [ ] Traced the value to its source
- [ ] Identified the root cause
- [ ] Can explain the fix needed
