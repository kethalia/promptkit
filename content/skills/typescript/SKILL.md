---
name: typescript
description: TypeScript development workflows for AI coding assistants. Use when reviewing type safety, fixing TypeScript errors, or migrating JavaScript to TypeScript. Triggers include "TypeScript", "type error", "fix types", "add types", "migrate to TypeScript", "type safety", "TS error", or when working with .ts/.tsx files with type issues. Covers type safety review, error fixing, and JS to TS migration.
---

# TypeScript Skill

Specialized workflows for TypeScript development. This skill covers:
1. **Type Safety Review** - Audit code for type safety issues
2. **Fix TypeScript Errors** - Diagnose and fix TS errors
3. **Migrate to TypeScript** - Convert JavaScript to TypeScript

## Quick Reference

| Scenario | Trigger | Reference |
|----------|---------|-----------|
| Type Safety | "review types", "type safety audit" | See [type-safety-review.md](references/type-safety-review.md) |
| Fix Errors | TS error codes, "fix type error" | See [fix-type-errors.md](references/fix-type-errors.md) |
| Migration | "migrate to TS", "add types" | See [migrate-to-typescript.md](references/migrate-to-typescript.md) |

## TypeScript Fundamentals

### Type System Hierarchy

```
unknown (top type)
    │
    ├── any (escape hatch - avoid)
    │
    ├── object
    │   ├── Array<T>
    │   ├── Function
    │   └── { ... } (object types)
    │
    ├── primitives
    │   ├── string
    │   ├── number
    │   ├── boolean
    │   ├── symbol
    │   └── bigint
    │
    ├── null
    ├── undefined
    │
    └── never (bottom type)
```

### Essential Types

```typescript
// Primitives
const name: string = 'John';
const age: number = 30;
const active: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['a', 'b'];

// Objects
interface User {
  id: number;
  name: string;
  email?: string;  // Optional
  readonly createdAt: Date;  // Immutable
}

// Functions
type Callback = (value: string) => void;
type AsyncFn = (id: number) => Promise<User>;

// Union & Intersection
type Status = 'pending' | 'active' | 'done';
type AdminUser = User & { role: 'admin' };

// Generics
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

### Type vs Interface

```typescript
// Interface - extendable, for objects
interface User {
  name: string;
}
interface Admin extends User {
  role: string;
}

// Type - more flexible, for unions/primitives/computed
type ID = string | number;
type Status = 'active' | 'inactive';
type Keys = keyof User;

// General guidance:
// - Use interface for objects that may be extended
// - Use type for unions, primitives, computed types
// - Be consistent within a codebase
```

## Common Patterns

### Discriminated Unions

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult(result: Result<User>) {
  if (result.success) {
    console.log(result.data);  // TypeScript knows data exists
  } else {
    console.log(result.error); // TypeScript knows error exists
  }
}
```

### Type Guards

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// in guard
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'name' in obj;
}

// Custom type guard
function isAdmin(user: User): user is AdminUser {
  return 'role' in user && user.role === 'admin';
}
```

### Utility Types

```typescript
// Partial - all properties optional
type PartialUser = Partial<User>;

// Required - all properties required
type RequiredUser = Required<User>;

// Pick - select properties
type UserName = Pick<User, 'name' | 'email'>;

// Omit - exclude properties
type UserWithoutId = Omit<User, 'id'>;

// Record - object with specific keys
type UserMap = Record<string, User>;

// ReturnType - extract function return type
type ApiResponse = ReturnType<typeof fetchUser>;

// Parameters - extract function parameters
type FetchParams = Parameters<typeof fetchUser>;
```

## Strict Mode Settings

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,                    // Enable all strict checks
    "noImplicitAny": true,             // Error on implicit any
    "strictNullChecks": true,          // Null/undefined are distinct
    "strictFunctionTypes": true,       // Strict function type checking
    "strictPropertyInitialization": true, // Class properties must be initialized
    "noImplicitReturns": true,         // All code paths must return
    "noFallthroughCasesInSwitch": true, // No fallthrough in switch
    "noUncheckedIndexedAccess": true   // Array access may be undefined
  }
}
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| `any` | Disables type checking | Use `unknown` or specific type |
| `as` casting | Bypasses type system | Use type guards |
| `!` non-null assertion | Hides potential nulls | Handle null explicitly |
| `@ts-ignore` | Silences errors | Fix the actual issue |
| Implicit returns | Unclear types | Explicit return types |

## Quick Fixes

| Error Pattern | Quick Fix |
|---------------|-----------|
| `Type 'X' is not assignable to type 'Y'` | Check types match, use union/assertion |
| `Property 'X' does not exist` | Add to interface, use optional chaining |
| `Object is possibly 'undefined'` | Add null check or optional chaining |
| `Argument of type 'X' is not assignable` | Match parameter type or use generic |
| `Cannot find module 'X'` | Install @types/X or create declaration |

## Output Format

When reviewing/fixing TypeScript:

```markdown
## TypeScript Review: [Component/File]

### Type Safety Score: X/10

### Issues Found
🔴 **Critical:** [any usage, unsafe casts]
🟠 **Major:** [missing types, implicit any]
🟡 **Minor:** [could be more specific]

### Fixes Applied
```typescript
// Before
[problematic code]

// After
[fixed code with proper types]
```

### Recommendations
1. [Specific improvement]
2. [Specific improvement]
```
