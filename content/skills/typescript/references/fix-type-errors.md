# Fix TypeScript Errors

Guide to diagnosing and fixing common TypeScript errors.

## Error Diagnosis Process

1. **Read the full error** - TS errors are verbose but informative
2. **Identify the error code** - TSxxxx codes help categorize
3. **Locate the source** - File and line number
4. **Understand the types** - What's expected vs actual
5. **Apply the fix** - Don't just cast away!

## Common Errors by Category

### Assignment Errors

#### TS2322: Type 'X' is not assignable to type 'Y'

```typescript
// Error: Type 'string' is not assignable to type 'number'
let count: number = "5";

// Fix 1: Correct the value
let count: number = 5;

// Fix 2: Correct the type
let count: string = "5";

// Fix 3: Parse/convert
let count: number = parseInt("5", 10);
```

**Complex case - object types:**
```typescript
interface User {
  name: string;
  age: number;
}

// Error: Property 'age' is missing
const user: User = { name: 'John' };

// Fix 1: Add missing property
const user: User = { name: 'John', age: 30 };

// Fix 2: Make property optional in interface
interface User {
  name: string;
  age?: number;  // Now optional
}

// Fix 3: Use Partial
const user: Partial<User> = { name: 'John' };
```

#### TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'

```typescript
function greet(name: string) {
  console.log(`Hello, ${name}`);
}

// Error: Argument of type 'number' is not assignable to parameter of type 'string'
greet(123);

// Fix 1: Pass correct type
greet("John");

// Fix 2: Update function to accept both
function greet(name: string | number) {
  console.log(`Hello, ${name}`);
}

// Fix 3: Convert the value
greet(String(123));
```

### Property Errors

#### TS2339: Property 'X' does not exist on type 'Y'

```typescript
interface User {
  name: string;
}

const user: User = { name: 'John' };

// Error: Property 'email' does not exist on type 'User'
console.log(user.email);

// Fix 1: Add property to interface
interface User {
  name: string;
  email?: string;
}

// Fix 2: Use type assertion (if you know it exists)
console.log((user as any).email);  // Not recommended

// Fix 3: Type guard for dynamic properties
if ('email' in user) {
  console.log(user.email);
}
```

#### TS2532: Object is possibly 'undefined'

```typescript
function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

const user = getUser('123');

// Error: Object is possibly 'undefined'
console.log(user.name);

// Fix 1: Optional chaining
console.log(user?.name);

// Fix 2: Null check
if (user) {
  console.log(user.name);
}

// Fix 3: Non-null assertion (use carefully)
console.log(user!.name);  // Only if you're certain

// Fix 4: Nullish coalescing
console.log(user?.name ?? 'Unknown');
```

#### TS2531: Object is possibly 'null'

```typescript
const element = document.getElementById('app');

// Error: Object is possibly 'null'
element.innerHTML = 'Hello';

// Fix 1: Null check
if (element) {
  element.innerHTML = 'Hello';
}

// Fix 2: Non-null assertion (if certain)
element!.innerHTML = 'Hello';

// Fix 3: Early return
if (!element) {
  throw new Error('Element not found');
}
element.innerHTML = 'Hello';
```

### Type Inference Errors

#### TS7006: Parameter 'X' implicitly has an 'any' type

```typescript
// Error: Parameter 'x' implicitly has an 'any' type
function double(x) {
  return x * 2;
}

// Fix: Add type annotation
function double(x: number): number {
  return x * 2;
}

// For callbacks
// Error
items.map(item => item.name);

// Fix 1: Type the parameter
items.map((item: Item) => item.name);

// Fix 2: Type the array (preferred)
const items: Item[] = [...];
items.map(item => item.name);  // item is inferred as Item
```

#### TS7053: Element implicitly has an 'any' type (index access)

```typescript
const obj = { a: 1, b: 2 };

// Error: Element implicitly has an 'any' type
const key = 'a';
console.log(obj[key]);

// Fix 1: Type the key
const key: keyof typeof obj = 'a';
console.log(obj[key]);

// Fix 2: Index signature
const obj: { [key: string]: number } = { a: 1, b: 2 };

// Fix 3: Record type
const obj: Record<string, number> = { a: 1, b: 2 };
```

### Generic Errors

#### TS2314: Generic type 'X' requires Y type argument(s)

```typescript
// Error: Generic type 'Array' requires 1 type argument(s)
const items: Array = [];

// Fix: Provide type argument
const items: Array<string> = [];
// Or shorthand
const items: string[] = [];
```

#### TS2344: Type 'X' does not satisfy the constraint 'Y'

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T) {
  console.log(item.length);
}

// Error: Type 'number' does not satisfy the constraint 'HasLength'
logLength(123);

// Fix 1: Pass valid type
logLength("hello");  // string has length
logLength([1, 2, 3]); // array has length

// Fix 2: Wrap in object with length
logLength({ value: 123, length: 3 });
```

### Module Errors

#### TS2307: Cannot find module 'X'

```typescript
// Error: Cannot find module './utils'
import { helper } from './utils';

// Fix 1: Check file exists and path is correct
import { helper } from './utils';  // Check: is it utils.ts?

// Fix 2: For npm packages, install types
npm install @types/lodash

// Fix 3: Create declaration file
// types/untyped-module.d.ts
declare module 'untyped-module' {
  export function doSomething(): void;
}
```

#### TS1259: Module 'X' can only be default-imported using the 'esModuleInterop' flag

```typescript
// Error with CommonJS module
import React from 'react';

// Fix 1: Enable esModuleInterop in tsconfig
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}

// Fix 2: Use namespace import
import * as React from 'react';
```

### JSX Errors

#### TS2786: 'X' cannot be used as a JSX component

```typescript
// Error: Its return type 'Element | undefined' is not a valid JSX element
function MaybeComponent({ show }: { show: boolean }) {
  if (!show) return;
  return <div>Hello</div>;
}

// Fix: Always return valid JSX
function MaybeComponent({ show }: { show: boolean }) {
  if (!show) return null;
  return <div>Hello</div>;
}
```

#### TS2769: No overload matches this call (React props)

```typescript
// Error: Type '{ colour: string }' is not assignable
<Button colour="red" />

// Fix: Check prop name spelling
<Button color="red" />

// Or update component props
interface ButtonProps {
  colour?: string;  // Add the prop
}
```

## Error Resolution Strategies

### Strategy 1: Narrow the Type

```typescript
function process(value: string | number) {
  // Error: Property 'toUpperCase' does not exist on type 'string | number'
  return value.toUpperCase();
  
  // Fix: Type guard
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toString();
}
```

### Strategy 2: Widen the Type

```typescript
interface ApiResponse {
  data: User;
}

// If API might return different data
interface ApiResponse {
  data: User | null;  // Widen to allow null
}
```

### Strategy 3: Use Type Assertion (Last Resort)

```typescript
// Only when you know better than TypeScript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// Double assertion for incompatible types (very rare, usually wrong)
const x = (value as unknown) as TargetType;
```

### Strategy 4: Add Type Guard

```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'email' in obj
  );
}

function process(data: unknown) {
  if (isUser(data)) {
    console.log(data.name);  // Now typed as User
  }
}
```

## Quick Reference Table

| Error Code | Meaning | Common Fix |
|------------|---------|------------|
| TS2322 | Type mismatch in assignment | Check types, add conversion |
| TS2339 | Property doesn't exist | Add to interface, use guard |
| TS2345 | Wrong argument type | Fix argument or parameter |
| TS2531/2532 | Possibly null/undefined | Add null check or `?.` |
| TS2307 | Module not found | Check path, install @types |
| TS7006 | Implicit any | Add type annotation |
| TS7053 | Implicit any from index | Add index signature |
| TS2314 | Missing generic argument | Add type parameter |

## When to Use Escape Hatches

| Escape Hatch | When Acceptable |
|--------------|-----------------|
| `as Type` | External data with runtime validation |
| `as unknown as Type` | Never (fix the types) |
| `!` non-null | DOM elements you control |
| `any` | Temporary during migration |
| `@ts-ignore` | Third-party type bugs only |
| `@ts-expect-error` | Tests for error conditions |
