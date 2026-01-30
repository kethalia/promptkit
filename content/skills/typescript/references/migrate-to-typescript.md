# Migrate to TypeScript

Guide to converting JavaScript projects to TypeScript.

## Migration Strategy

### Approach Options

| Approach | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Gradual** | Large codebase | Low risk, incremental | Takes longer |
| **All-at-once** | Small codebase | Fast, consistent | Higher risk |
| **New code only** | Ongoing development | Easy start | Mixed codebase |

### Recommended: Gradual Migration

```
Phase 1: Setup (Day 1)
├── Install TypeScript
├── Add tsconfig.json
├── Configure build
└── Rename entry point to .ts

Phase 2: Infrastructure (Week 1)
├── Add types for dependencies
├── Create shared type definitions
├── Convert utilities first
└── Enable allowJs

Phase 3: Core Code (Weeks 2-4)
├── Convert file by file
├── Start with leaf modules
├── Work toward entry points
└── Add strict checks gradually

Phase 4: Cleanup (Final)
├── Enable strict mode
├── Remove allowJs
├── Remove any types
└── Add CI type checking
```

## Step-by-Step Migration

### Step 1: Install TypeScript

```bash
# Install TypeScript
npm install --save-dev typescript

# Install types for Node.js
npm install --save-dev @types/node

# For React projects
npm install --save-dev @types/react @types/react-dom
```

### Step 2: Create tsconfig.json

```json
// Start with loose settings, tighten over time
{
  "compilerOptions": {
    // Basic options
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Allow JS files during migration
    "allowJs": true,
    "checkJs": false,
    
    // Output
    "outDir": "./dist",
    "rootDir": "./src",
    
    // Loose strict settings initially
    "strict": false,
    "noImplicitAny": false,
    
    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    
    // Skip errors in node_modules
    "skipLibCheck": true,
    
    // React (if applicable)
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 3: Install Type Definitions

```bash
# Find missing types
npx typesync

# Install common types
npm install --save-dev \
  @types/node \
  @types/jest \
  @types/lodash
  # ... etc

# For packages without types, create declarations
```

### Step 4: Create Type Declaration for Untyped Modules

```typescript
// src/types/untyped-modules.d.ts

// Simple declaration
declare module 'untyped-package';

// With basic types
declare module 'untyped-package' {
  export function doSomething(value: string): number;
  export const VERSION: string;
}

// For CSS/image imports
declare module '*.css';
declare module '*.png' {
  const src: string;
  export default src;
}
```

### Step 5: Convert Files (One at a Time)

#### Start with Utility Files

```javascript
// utils/format.js (before)
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
```

```typescript
// utils/format.ts (after)
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```

#### Then Convert Components

```javascript
// components/Button.jsx (before)
import React from 'react';

export function Button({ children, onClick, disabled, variant }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant || 'primary'}`}
    >
      {children}
    </button>
  );
}
```

```typescript
// components/Button.tsx (after)
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary' 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

### Step 6: Create Shared Type Definitions

```typescript
// src/types/index.ts

// Domain models
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export type UserRole = 'admin' | 'user' | 'guest';

// API types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Common utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
```

### Step 7: Gradually Enable Strict Mode

```json
// Phase 1: Start loose
{
  "compilerOptions": {
    "strict": false
  }
}

// Phase 2: Enable one at a time
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true  // Start here
  }
}

// Phase 3: Add more
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": true,  // Add this
    "strictFunctionTypes": true
  }
}

// Phase 4: Full strict mode
{
  "compilerOptions": {
    "strict": true  // Enables all strict checks
  }
}
```

## Common Migration Patterns

### Converting Callbacks

```javascript
// JavaScript
function fetchData(callback) {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => callback(null, data))
    .catch(err => callback(err, null));
}
```

```typescript
// TypeScript
interface Data {
  items: string[];
}

type Callback<T> = (error: Error | null, data: T | null) => void;

function fetchData(callback: Callback<Data>): void {
  fetch('/api/data')
    .then(res => res.json())
    .then((data: Data) => callback(null, data))
    .catch((err: Error) => callback(err, null));
}

// Better: Convert to Promise
async function fetchData(): Promise<Data> {
  const res = await fetch('/api/data');
  return res.json();
}
```

### Converting Classes

```javascript
// JavaScript
class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
  }

  async getUser(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const user = await fetch(`${this.apiUrl}/users/${id}`).then(r => r.json());
    this.cache.set(id, user);
    return user;
  }
}
```

```typescript
// TypeScript
interface User {
  id: string;
  name: string;
  email: string;
}

class UserService {
  private readonly apiUrl: string;
  private cache: Map<string, User>;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
  }

  async getUser(id: string): Promise<User> {
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    const user: User = await response.json();
    this.cache.set(id, user);
    return user;
  }
}
```

### Converting React Components (Class to Typed)

```javascript
// JavaScript class component
class Counter extends React.Component {
  state = { count: 0 };

  increment = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}
```

```typescript
// TypeScript (consider converting to function component)
interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(prev => prev + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## Migration Checklist

```markdown
### Preparation
- [ ] TypeScript installed
- [ ] tsconfig.json created
- [ ] Build scripts updated
- [ ] @types packages installed
- [ ] Declaration files for untyped modules

### File Conversion
- [ ] Utilities converted
- [ ] Shared types defined
- [ ] Components converted
- [ ] Services converted
- [ ] Entry points converted

### Strict Mode Progress
- [ ] noImplicitAny enabled
- [ ] strictNullChecks enabled
- [ ] strictFunctionTypes enabled
- [ ] strictPropertyInitialization enabled
- [ ] Full strict mode enabled

### Cleanup
- [ ] No more .js files (or allowJs disabled)
- [ ] No any types (or justified)
- [ ] No @ts-ignore comments
- [ ] CI type checking enabled
- [ ] Documentation updated
```

## Common Issues During Migration

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Install @types or create declaration |
| Implicit any errors | Add type annotations |
| Null check errors | Add optional chaining or guards |
| Generic type errors | Specify type parameters |
| Module interop issues | Enable esModuleInterop |
| JSX errors | Configure jsx option in tsconfig |

## Tools to Help

```bash
# Automatically convert some patterns
npx ts-migrate migrate ./src

# Find missing type definitions
npx typesync

# Analyze type coverage
npx type-coverage

# Generate types from JSON
npx quicktype data.json -o types.ts
```
