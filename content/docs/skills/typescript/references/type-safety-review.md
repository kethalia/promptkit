---
title: "Type Safety Review"
---
# Type Safety Review

Systematic approach to auditing TypeScript code for type safety.

## Type Safety Audit Checklist

### Critical Issues (Must Fix)

- [ ] No `any` types (use `unknown` or specific types)
- [ ] No `@ts-ignore` or `@ts-nocheck`
- [ ] No unsafe type assertions (`as`)
- [ ] No non-null assertions (`!`) without justification
- [ ] Strict mode enabled in tsconfig

### Major Issues (Should Fix)

- [ ] All function parameters typed
- [ ] All function return types explicit
- [ ] No implicit `any` from missing types
- [ ] Null/undefined handled properly
- [ ] Generic types used where appropriate

### Minor Issues (Consider)

- [ ] Types could be more specific (narrow unions)
- [ ] Utility types used effectively
- [ ] Type aliases for complex types
- [ ] Consistent naming conventions

## Common Type Safety Issues

### Issue: Using `any`

```typescript
// ❌ Bad - any defeats type safety
function process(data: any) {
  return data.name.toUpperCase();
}

// ✅ Good - specific type
interface Data {
  name: string;
}
function process(data: Data) {
  return data.name.toUpperCase();
}

// ✅ Good - unknown with type guard
function process(data: unknown) {
  if (isData(data)) {
    return data.name.toUpperCase();
  }
  throw new Error('Invalid data');
}
```

### Issue: Unsafe Type Assertions

```typescript
// ❌ Bad - trusting assertion without validation
const user = JSON.parse(response) as User;

// ✅ Good - validate at runtime
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof (obj as any).name === 'string'
  );
}

const parsed = JSON.parse(response);
if (!isUser(parsed)) {
  throw new Error('Invalid user data');
}
const user = parsed; // Now safely typed as User
```

### Issue: Non-null Assertion Abuse

```typescript
// ❌ Bad - hiding potential null
function getUser(id: string) {
  return users.find(u => u.id === id)!;  // Dangerous!
}

// ✅ Good - handle null explicitly
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

// Or throw if truly unexpected
function getUser(id: string): User {
  const user = users.find(u => u.id === id);
  if (!user) {
    throw new Error(`User ${id} not found`);
  }
  return user;
}
```

### Issue: Missing Return Types

```typescript
// ❌ Bad - implicit return type
function fetchUser(id: string) {
  return api.get(`/users/${id}`);
}

// ✅ Good - explicit return type
function fetchUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

// ✅ Good - async function
async function fetchUser(id: string): Promise<User> {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

### Issue: Loose Object Types

```typescript
// ❌ Bad - too loose
function process(obj: object) {
  // Can't access any properties
}

// ❌ Bad - index signature allows anything
interface Data {
  [key: string]: any;
}

// ✅ Good - specific shape
interface Data {
  name: string;
  value: number;
}

// ✅ Good - Record for known value types
type Scores = Record<string, number>;
```

### Issue: Array Element Access

```typescript
// ❌ Bad - assumes element exists
const first = items[0].name;  // Error if empty array

// ✅ Good - with noUncheckedIndexedAccess
// tsconfig: "noUncheckedIndexedAccess": true
const first = items[0]?.name;  // string | undefined

// ✅ Good - explicit check
if (items.length > 0) {
  const first = items[0].name;
}
```

### Issue: Event Handler Types

```typescript
// ❌ Bad - any event
const handleClick = (e: any) => {
  console.log(e.target.value);
};

// ✅ Good - specific event type
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.textContent);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
```

## Type Safety Patterns

### Pattern: Branded Types

```typescript
// Prevent mixing up similar primitive types
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User { ... }

const userId = createUserId('123');
const orderId = createOrderId('456');

getUser(userId);  // ✅ OK
getUser(orderId); // ❌ Error: OrderId not assignable to UserId
```

### Pattern: Exhaustive Checks

```typescript
type Status = 'pending' | 'active' | 'done';

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting';
    case 'active':
      return 'In Progress';
    case 'done':
      return 'Complete';
    default:
      // Ensures all cases handled
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}
```

### Pattern: Const Assertions

```typescript
// ❌ Type is { status: string }
const config = { status: 'active' };

// ✅ Type is { readonly status: 'active' }
const config = { status: 'active' } as const;

// Useful for creating literal union types
const STATUSES = ['pending', 'active', 'done'] as const;
type Status = typeof STATUSES[number]; // 'pending' | 'active' | 'done'
```

### Pattern: Type-Safe API Responses

```typescript
// Define response types
interface ApiResponse<T> {
  data: T;
  status: number;
}

interface ApiError {
  message: string;
  code: string;
}

type Result<T> = 
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await api.get<User>(`/users/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: parseError(error) };
  }
}

// Usage with type narrowing
const result = await fetchUser('123');
if (result.ok) {
  console.log(result.data.name);  // User is typed
} else {
  console.error(result.error.message);  // Error is typed
}
```

## Review Template

```markdown
## Type Safety Review: [File/Component]

### Summary
- **Type Safety Score:** X/10
- **Critical Issues:** X
- **Strict Mode:** Yes/No

### Critical Issues

#### `any` Usage
| Location | Current | Recommended |
|----------|---------|-------------|
| line X | `any` | `User` or `unknown` |

#### Unsafe Assertions
| Location | Issue | Fix |
|----------|-------|-----|
| line X | `as User` | Add type guard |

### Recommended Changes

```typescript
// Before
[problematic code]

// After  
[improved code]
```

### Configuration Recommendations
- [ ] Enable strict mode
- [ ] Add noUncheckedIndexedAccess
- [ ] Add explicit return types rule
```

## Type Safety Checklist by Area

### Functions
- [ ] All parameters have explicit types
- [ ] Return type is explicit
- [ ] Overloads typed correctly
- [ ] Generic constraints used

### Objects
- [ ] Interface defined for shape
- [ ] Optional properties marked with `?`
- [ ] Readonly where appropriate
- [ ] No index signatures with `any`

### Arrays
- [ ] Element type specified
- [ ] Array access handles undefined
- [ ] Tuple types where appropriate

### Classes
- [ ] Properties initialized or `!` justified
- [ ] Access modifiers used
- [ ] Abstract members in abstract class
- [ ] Implements clause used

### Third-party
- [ ] @types packages installed
- [ ] Declaration files for untyped modules
- [ ] Generic parameters specified
