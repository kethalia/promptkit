# Fix TypeScript Errors

Diagnose TypeScript compilation errors, explain them clearly, and propose type-safe fixes.

---

## Context

Before fixing errors, gather:
1. The full TypeScript error output (from `tsc`, IDE, or build tool)
2. The source file(s) where errors occur
3. Related type definitions and interfaces referenced in errors
4. The project's `tsconfig.json` settings (affects error behavior)

## Instructions

1. **Parse the error output**
   - Extract error code (e.g., `TS2322`, `TS2345`)
   - Note file path and line:column number
   - Capture the full error message including expected vs actual types
   - Group errors by file for organized analysis

2. **Explain each error in plain language**

   Common error translations:
   | Code | Message | Plain English |
   |------|---------|---------------|
   | TS2322 | Type 'X' is not assignable to type 'Y' | You're putting a value of type X where type Y is expected |
   | TS2345 | Argument of type 'X' is not assignable to parameter of type 'Y' | Function expects Y but you passed X |
   | TS2339 | Property 'X' does not exist on type 'Y' | Type Y doesn't have property X (typo? wrong type?) |
   | TS2532 | Object is possibly 'undefined' | This might be undefined - add a null check |
   | TS2531 | Object is possibly 'null' | This might be null - add a null check |
   | TS7006 | Parameter 'X' implicitly has an 'any' type | Add a type annotation to parameter X |
   | TS2741 | Property 'X' is missing in type 'Y' | Object is missing required property X |
   | TS2769 | No overload matches this call | None of the function's signatures match your arguments |
   | TS2304 | Cannot find name 'X' | X is not defined - import missing? typo? |
   | TS2551 | Property 'X' does not exist. Did you mean 'Y'? | Likely typo - Y exists and is similar |
   | TS2554 | Expected X arguments, but got Y | Wrong number of arguments passed |
   | TS2571 | Object is of type 'unknown' | Need to narrow the type before using it |

3. **Identify root cause vs cascade errors**
   - Many errors stem from a single root cause
   - Fixing one error often resolves multiple others
   - Root causes are typically:
     - Incorrect type definition
     - Missing import or type declaration
     - Wrong generic constraint
     - Null/undefined not handled
   - Cascade errors appear downstream from the root

4. **Propose fixes (multiple options when applicable)**

   For each error, evaluate solutions in this order:

   **Option A: Fix the type definition** (if the type is wrong)
   - Update interface/type to match actual usage
   - Add missing properties or make them optional
   - Widen or narrow types as appropriate

   **Option B: Fix the code** (if usage is wrong)
   - Add null checks or optional chaining
   - Use type guards to narrow types
   - Pass correct arguments or properties

   **Option C: Add type assertion** (last resort)
   - Only when you're certain the runtime type is correct
   - Prefer `as const` or specific types over `as any`
   - Document why the assertion is safe

5. **Consider type-safe solutions over type assertions**

   Instead of:
   ```typescript
   // Bad: hides the real problem
   const value = data as MyType;
   ```

   Prefer:
   ```typescript
   // Good: type guard with runtime check
   function isMyType(data: unknown): data is MyType {
     return typeof data === 'object' && data !== null && 'id' in data;
   }
   
   if (isMyType(data)) {
     const value = data; // safely typed as MyType
   }
   ```

   Instead of:
   ```typescript
   // Bad: non-null assertion
   const name = user!.name;
   ```

   Prefer:
   ```typescript
   // Good: explicit null check
   if (user) {
     const name = user.name;
   }
   // Or with fallback
   const name = user?.name ?? 'Anonymous';
   ```

6. **Verify fixes don't introduce new errors**
   - Run `tsc --noEmit` after each fix
   - Check that fix doesn't break other files
   - Ensure tests still pass

## Output Format

```markdown
## TypeScript Error Analysis

### Error Summary
- Total errors: X
- Unique root causes: Y
- Files affected: Z

### Root Cause Errors

#### Error 1: TS[code] at [file:line:col]

**Raw error**:
```
[Full error message from compiler]
```

**Plain English**: [Simple explanation of what went wrong]

**Root cause**: [Where the actual problem originates - may be different from error location]

**Cascade errors**: [List any errors that will be fixed by fixing this one]

**Fixes**:

**Option A: [Fix description]** (Recommended)
```typescript
// file.ts:line

// Before
[original code]

// After
[fixed code]
```
- Impact: [What this changes]
- Pros: [Benefits]
- Cons: [Tradeoffs, if any]

**Option B: [Alternative fix]**
```typescript
[alternative solution]
```
- When to use: [Circumstances where this is better]

---

### Cascade Errors (will be resolved by fixing root causes)

| Error | Location | Resolved by |
|-------|----------|-------------|
| TS2322 | api.ts:45 | Fixing Error 1 |
| TS2339 | api.ts:52 | Fixing Error 1 |

### Recommended Fix Order
1. **Error X** - Root cause, resolves Y other errors
2. **Error Z** - Independent issue
3. [etc.]

### Prevention Tips
- [Suggestions to avoid similar errors in future]
```

## Interactive Decisions

1. **Type definition vs code fix**: "Error at [location] - the type says X but code does Y. Should I:
   a) Update the type definition to match the code
   b) Fix the code to match the type
   c) Both are wrong - propose new approach"

2. **Strictness tradeoff**: "The strict fix requires changing [X files/functions]. Should I:
   a) Make all changes for full type safety
   b) Use targeted assertion with documented justification
   c) Disable the strict check for this file temporarily"

3. **Missing types**: "Error caused by untyped dependency `[package]`. Should I:
   a) Install `@types/[package]` if available
   b) Create local type declarations
   c) Use `any` with `// TODO` comment"

4. **Breaking changes**: "The correct fix changes the public API. Should I:
   a) Update all callers (list affected locations)
   b) Add overload to maintain backward compatibility
   c) Deprecate old signature and add new one"

5. **Null handling strategy**: "Multiple null-check errors. Should I:
   a) Add individual null checks at each location
   b) Add early return/throw at function entry
   c) Make the source type non-nullable if it's always defined"
