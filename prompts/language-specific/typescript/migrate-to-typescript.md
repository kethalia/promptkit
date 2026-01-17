# Migrate JavaScript to TypeScript

Convert JavaScript files to TypeScript with proper types and an incremental migration plan.

---

## Context

Before migrating, gather:
1. The JavaScript file(s) to migrate
2. Existing `tsconfig.json` or note that one needs to be created
3. Package dependencies to check for `@types/*` availability
4. Module system in use (CommonJS `require`/`module.exports` vs ESM `import`/`export`)
5. Any existing JSDoc comments that hint at types
6. Test files that exercise the code (helps infer types)

## Instructions

1. **Analyze JavaScript file(s) to migrate**
   - Read through the entire file to understand its purpose
   - Identify all exports (functions, classes, constants, default export)
   - Note dynamic patterns (computed properties, `arguments`, `this` binding)
   - List all imports/requires and their sources
   - Check for existing JSDoc type annotations

2. **Identify implicit types from usage**
   - Examine function parameters by how they're used in the body
   - Check return values and what callers do with them
   - Analyze variable assignments, reassignments, and mutations
   - Review conditionals for type narrowing hints (`typeof`, `instanceof`, `in`)
   - Look at array methods to infer element types
   - Check object property access patterns

3. **Propose interface/type definitions**
   - Create interfaces for object shapes (parameters, return values, state)
   - Define type aliases for unions, intersections, or complex types
   - Use descriptive names reflecting domain concepts
   - Consider extracting shared types to a `types.ts` file
   - Add JSDoc descriptions to exported interfaces

4. **Handle common migration challenges**

   **CommonJS to ESM**:
   ```javascript
   // Before (CommonJS)
   const fs = require('fs');
   const { join } = require('path');
   module.exports = { myFunc };
   module.exports.helper = helper;
   
   // After (ESM)
   import fs from 'fs';
   import { join } from 'path';
   export { myFunc };
   export { helper };
   ```

   **Dynamic requires**:
   ```javascript
   // Before
   const module = require(dynamicPath);
   
   // After - use dynamic import
   const module = await import(dynamicPath);
   ```

   **`this` in functions**:
   ```typescript
   // Add explicit this parameter
   function handler(this: HTMLElement, event: Event) { }
   ```

   **Arguments object**:
   ```typescript
   // Replace with rest parameters
   function legacy(...args: string[]) { }
   ```

5. **Create incremental migration plan**
   - Start with leaf modules (no internal dependencies)
   - Enable `allowJs: true` for mixed codebase
   - Use `checkJs: true` to catch issues in unconverted files
   - Prioritize: shared utilities → core logic → entry points
   - Consider `.ts` extension for new files, keep `.js` until converted

6. **Suggest tsconfig settings**
   - Recommend starter configuration based on project type
   - Essential settings for migration:
     ```json
     {
       "compilerOptions": {
         "allowJs": true,
         "checkJs": true,
         "strict": false,
         "noEmit": true,
         "esModuleInterop": true,
         "skipLibCheck": true,
         "resolveJsonModule": true
       },
       "include": ["src/**/*"]
     }
     ```
   - Path to strict mode:
     1. Start with `strict: false`
     2. Enable `noImplicitAny` first
     3. Add `strictNullChecks`
     4. Finally enable `strict: true`

7. **Handle untyped dependencies**
   - Search for `@types/[package]` on npm
   - Create minimal `.d.ts` for packages without types:
     ```typescript
     // types/untyped-package.d.ts
     declare module 'untyped-package' {
       export function doSomething(input: string): void;
     }
     ```
   - Use `any` temporarily with `// TODO: add proper types`

## Output Format

```markdown
## Migration Plan: [original-filename.js] → [new-filename.ts]

### File Analysis
- **Purpose**: [Brief description]
- **Exports**: [List of exports]
- **Dependencies**: [Internal and external]
- **Complexity**: [Low/Medium/High]

### Inferred Types
```typescript
interface [Name] {
  [property]: [type];
}

type [Name] = [definition];
```

### Module System Changes
| Before (JS) | After (TS) |
|-------------|------------|
| `require('x')` | `import x from 'x'` |
| `module.exports` | `export default` |

### Dependencies Status
| Package | Types Available | Action |
|---------|-----------------|--------|
| lodash | @types/lodash | `npm i -D @types/lodash` |
| custom-lib | None | Create `custom-lib.d.ts` |

### Migration Notes
- [Assumptions made about types]
- [Edge cases that need runtime validation]
- [Breaking changes to be aware of]

### Converted File
```typescript
// Full converted TypeScript file
```

### Incremental Migration Order
1. `utils/helpers.js` - No dependencies
2. `services/api.js` - Depends on helpers
3. `index.js` - Entry point, migrate last

### Recommended tsconfig.json
```json
{
  // Configuration for this project
}
```
```

## Interactive Decisions

1. **Ambiguous parameter types**: "Parameter `data` is used as both array and object. Should I:
   a) Create a union type `DataArray | DataObject`
   b) Use function overloads
   c) Use generic with constraint
   d) Keep as `unknown` with runtime checks"

2. **Module format**: "Project uses CommonJS. Should I:
   a) Convert to ESM (recommended for new projects)
   b) Keep CommonJS with TypeScript types
   c) Use hybrid approach with `esModuleInterop`"

3. **Strictness level**: "For initial migration, should I:
   a) Use permissive settings (`strict: false`) and tighten later
   b) Start strict and fix all issues now
   c) Enable strict settings incrementally"

4. **Shared types location**: "Found types used across files. Should I:
   a) Create `src/types/index.ts` for shared types
   b) Co-locate types with their primary usage
   c) Create per-domain type files (`user.types.ts`, `api.types.ts`)"

5. **Missing type definitions**: "Package `[name]` has no types. Should I:
   a) Create comprehensive local declarations
   b) Create minimal declarations for used APIs only
   c) Use `any` temporarily and track as tech debt"
