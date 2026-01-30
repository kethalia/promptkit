# Go Error Handling Review

Review Go code for proper error handling patterns, validation, and consistency.

---

## Context

Gather the following before starting the review:

1. List all `.go` files in the target package/directory
2. Search for error assignments (`err :=`, `err =`, `if err`)
3. Find custom error types and sentinel errors (`var Err`, `type.*Error`)
4. Check for `errors.Is`, `errors.As`, and `errors.Unwrap` usage
5. Identify error wrapping patterns (`fmt.Errorf`, `%w`)

## Instructions

1. **Validate errors are checked, not ignored**
   - Find assignments to blank identifier: `_, _ = fn()` where error is discarded
   - Look for `_ =` assignments that discard errors
   - Identify function calls where error return is completely ignored
   - Flag `defer` statements that ignore errors (e.g., `defer f.Close()`)
   - Check for error returns assigned but never checked

2. **Review error wrapping and unwrapping**
   - Verify `%w` verb is used in `fmt.Errorf` for wrapping (not `%v` or `%s`)
   - Check that wrapped errors add meaningful context
   - Ensure error chains don't lose important information
   - Look for double-wrapping that creates redundant messages
   - Verify `errors.Unwrap` is used appropriately

3. **Check for sentinel errors vs custom error types**
   - Find `var ErrFoo = errors.New()` declarations
   - Verify naming convention (`Err` prefix for sentinel errors)
   - Identify when custom error types should be used instead of sentinels
   - Check that custom error types implement `Error()` method
   - Verify custom error types implement `Unwrap()` when wrapping other errors

4. **Review error messages for context**
   - Verify messages are lowercase (per Go convention)
   - Check messages don't end with punctuation
   - Ensure messages provide actionable context (what operation failed)
   - Verify messages don't duplicate information from wrapped errors
   - Check that error messages identify the specific failure point

5. **Validate errors.Is/As usage**
   - Look for direct comparison (`err == ErrSomething`) that should use `errors.Is()`
   - Check for type assertions (`err.(*MyError)`) that should use `errors.As()`
   - Verify `errors.Is()` is used for sentinel error checking
   - Verify `errors.As()` is used for extracting typed errors
   - Ensure error checking works with wrapped errors

6. **Check for proper error propagation**
   - Verify errors bubble up to appropriate handling level
   - Check that errors aren't logged and then returned (double logging)
   - Ensure retry logic doesn't swallow errors
   - Verify HTTP handlers return appropriate status codes for errors
   - Check that errors reach the caller with sufficient context

7. **Identify error handling inconsistencies**
   - Compare error handling patterns across similar functions
   - Look for inconsistent error wrapping (some wrapped, some not)
   - Check for inconsistent error message formatting
   - Identify functions that panic vs return errors inconsistently
   - Find error handling that differs from package conventions

## Output Format

```markdown
## Error Handling Review: [package-name]

### Summary
- **Error Handling Score**: [1-5, where 5 is excellent]
- **Ignored Errors**: [count]
- **Wrapping Issues**: [count]
- **Is/As Violations**: [count]

### Ignored Errors

| Location | Code | Risk | Recommendation |
|----------|------|------|----------------|
| file:line | `_, _ = fn()` | High | Check error and handle |
| file:line | `defer f.Close()` | Medium | Use named return or log |

### Error Wrapping Issues

#### [Issue Title]
**Location**: `file.go:line`
**Current**:
```go
return fmt.Errorf("failed: %v", err)  // loses error chain
```
**Suggested**:
```go
return fmt.Errorf("failed to process request: %w", err)  // preserves chain
```
**Why**: Using `%w` allows callers to use `errors.Is()` and `errors.As()`

### Sentinel Errors vs Custom Types

| Name | Location | Type | Assessment |
|------|----------|------|------------|
| ErrNotFound | errors.go:10 | Sentinel | Appropriate |
| InvalidInputError | validation.go:5 | Custom | Good - contains field info |
| "invalid input" | handler.go:25 | String | Should be sentinel or typed |

### Error Message Quality

| Location | Current | Issue | Suggested |
|----------|---------|-------|-----------|
| file:line | "Failed to open file." | Capitalized, punctuation | "open config file" |
| file:line | "error" | No context | "parse user input" |

### errors.Is/As Violations

| Location | Current | Should Be |
|----------|---------|-----------|
| file:line | `err == ErrNotFound` | `errors.Is(err, ErrNotFound)` |
| file:line | `err.(*ValidationError)` | `errors.As(err, &validErr)` |

### Error Propagation Issues

#### [Issue]
**Location**: `file.go:line`
**Problem**: Error is logged and returned (causes double logging)
**Current**:
```go
log.Error("failed", err)
return err
```
**Fix**:
```go
return fmt.Errorf("operation X failed: %w", err)  // let caller decide logging
```

### Inconsistencies

| Pattern A | Pattern B | Locations | Recommendation |
|-----------|-----------|-----------|----------------|
| Returns error | Panics | a.go:10, b.go:20 | Standardize on returning errors |
| Wraps with context | Returns bare | c.go:5, c.go:15 | Always wrap with context |

### Recommendations
1. **Critical**: [Ignored errors in critical paths]
2. **High**: [Is/As violations that break error checking]
3. **Medium**: [Wrapping improvements]
4. **Low**: [Message formatting consistency]
```

## Interactive Decisions

Pause and ask the user when encountering:

1. **Intentionally ignored errors**: "Error from `[function]` at `[location]` is ignored. Is this intentional (e.g., best-effort cleanup) or should it be handled?"

2. **Error wrapping depth**: "Error at `[location]` is wrapped multiple times. Should I suggest reducing wrapping to avoid verbose messages?"

3. **Sentinel vs typed errors**: "Error `[name]` is a sentinel but callers need to extract `[information]`. Should I suggest converting to a typed error?"

4. **Panic appropriateness**: "Panic at `[location]` is used for `[condition]`. Should this return an error instead?"

5. **Error logging responsibility**: "Errors are logged at `[location A]` and also at `[location B]`. Which location should own logging?"

6. **Breaking changes**: "Improving error handling for `[function]` would change its signature. Should I include this suggestion?"

7. **Error documentation**: "Public function `[name]` can return errors but they're not documented. Should I suggest adding error documentation?"
