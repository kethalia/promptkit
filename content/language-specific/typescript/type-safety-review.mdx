# Type Safety Review

Analyze TypeScript code for type safety issues and propose improvements with examples.

---

## Context

Before reviewing, gather:
1. The TypeScript file(s) to review
2. The project's `tsconfig.json` to understand compiler strictness settings
3. Any custom type definition files (`.d.ts`) in the project
4. Related interfaces/types from imported modules

## Instructions

1. **Identify `any` usage**
   - Flag explicit `any` annotations in parameters, return types, and variables
   - Detect implicit `any` from missing type annotations
   - Check for `any` in generic type arguments
   - Distinguish between intentional `any` (with justification comments) and accidental

2. **Check `unknown` without narrowing**
   - Verify all `unknown` values are narrowed before property access
   - Ensure type guards or type predicates are used correctly
   - Flag direct operations on `unknown` without prior checks

3. **Review type assertions**
   - Find all `as Type` and `<Type>` casts
   - Flag dangerous patterns: `as any`, `as unknown as T` (double assertion)
   - Identify assertions that could be replaced with type guards
   - Check for non-null assertions (`!`) that skip null checks

4. **Check generic usage**
   - Verify generic constraints (`extends`) are appropriately restrictive
   - Identify missing generic parameters that default to `unknown` or `{}`
   - Check for generic types that could be more specific
   - Find opportunities to add generics for better reusability

5. **Validate null/undefined handling**
   - Find non-null assertions (`!`) and evaluate if they're safe
   - Check optional chaining (`?.`) is used where values may be nullish
   - Verify nullish coalescing (`??`) vs logical OR (`||`) usage
   - Ensure optional parameters and properties are handled correctly

6. **Review discriminated unions and type guards**
   - Validate discriminant properties have literal types
   - Check switch/if statements for exhaustive handling
   - Review custom type guard functions (`is` predicates) for correctness
   - Verify `in` operator narrows types appropriately

7. **Check strict mode compliance**
   - Test against `strict: true` requirements
   - Verify `strictNullChecks` compliance (no implicit null assumptions)
   - Check `strictFunctionTypes` for contravariant parameter types
   - Ensure `noImplicitAny` passes (all types explicit or inferable)

8. **Propose type improvements with examples**
   - Suggest literal types over broad primitives
   - Recommend `readonly` for immutable data
   - Propose branded/nominal types for IDs or special values
   - Show before/after code for each suggestion

## Output Format

```markdown
## Type Safety Report: [filename]

### Summary
- Total issues: X
- Critical: X | Warning: X | Suggestion: X

### Critical Issues

#### 1. [Issue Title]
- **Location**: `file.ts:line`
- **Category**: [any usage | unsafe assertion | missing narrowing | etc.]
- **Problem**: [Description of the type safety issue]
- **Current code**:
  ```typescript
  // problematic code
  ```
- **Recommended fix**:
  ```typescript
  // improved code with proper types
  ```

### Warnings
[Same format as critical issues]

### Suggestions
[Same format, for optional improvements]

### Strict Mode Checklist
- [ ] `noImplicitAny`: [Pass/Fail - details]
- [ ] `strictNullChecks`: [Pass/Fail - details]
- [ ] `strictFunctionTypes`: [Pass/Fail - details]
- [ ] `noImplicitThis`: [Pass/Fail - details]
- [ ] `strictBindCallApply`: [Pass/Fail - details]

### Type Improvements
| Current | Suggested | Benefit |
|---------|-----------|---------|
| `string` | `'pending' \| 'complete'` | Compile-time validation |
| `object` | `Record<string, User>` | Property access safety |
```

## Interactive Decisions

1. **When `any` is found**: "Found `any` at [location]. Should I:
   a) Infer a specific type based on usage patterns
   b) Introduce a generic type parameter
   c) Use `unknown` with type guards
   d) Keep `any` with a `// eslint-disable` and justification"

2. **When type assertions are found**: "Found `as [Type]` at [location]. Should I:
   a) Replace with a type guard function
   b) Add runtime validation before the assertion
   c) Fix the upstream type to make assertion unnecessary
   d) Keep assertion with documented justification"

3. **When strict mode reveals issues**: "Enabling `strictNullChecks` would flag X issues. Should I:
   a) Review and fix all issues for full compliance
   b) Fix critical paths only, add `// @ts-expect-error` elsewhere
   c) Keep current settings and document known gaps"

4. **When generics could help**: "This function could be generic. Should I:
   a) Add generic parameter for full type inference
   b) Keep concrete types for simplicity
   c) Create function overloads instead"
