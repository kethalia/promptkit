---
name: react-nextjs
description: React and Next.js development workflows for AI coding assistants. Use when reviewing React components, optimizing performance, working with hooks, migrating to App Router, or extracting reusable code. Triggers include "review this component", "React best practices", "Next.js", "hooks review", "optimize React", "App Router migration", "extract constants", or when working with .jsx/.tsx files. Covers component review, hooks patterns, performance optimization, and Next.js App Router.
---

# React & Next.js Skill

Specialized workflows for React and Next.js development. This skill covers:
1. **Component Review** - React component best practices
2. **Hooks Best Practices** - Proper hook usage patterns
3. **Performance Optimization** - React/Next.js performance
4. **App Router Migration** - Pages Router → App Router
5. **Extract Constants/Utilities** - Code organization

## Quick Reference

| Scenario | Trigger | Reference |
|----------|---------|-----------|
| Component Review | "review component", JSX code | See [component-review.md](references/component-review.md) |
| Hooks | "hooks", useState/useEffect issues | See [hooks-best-practices.md](references/hooks-best-practices.md) |
| Performance | "optimize", "slow", "re-renders" | See [performance-optimization.md](references/performance-optimization.md) |
| App Router | "App Router", "migrate", Next.js 13+ | See [app-router-migration.md](references/app-router-migration.md) |
| Extract Code | "extract constants", "utilities" | See [extract-patterns.md](references/extract-patterns.md) |

## React Component Principles

### Component Design

```
Good Component:
├── Single responsibility
├── Props are the API
├── Minimal state
├── Composable
└── Testable
```

### Component Types

| Type | Use When | Example |
|------|----------|---------|
| Presentational | UI only, no logic | `<Button>`, `<Card>` |
| Container | Data fetching, state | `<UserList>`, `<Dashboard>` |
| Layout | Page structure | `<Header>`, `<Sidebar>` |
| HOC | Cross-cutting concerns | `withAuth()`, `withTheme()` |
| Hook | Reusable stateful logic | `useAuth()`, `useFetch()` |

### File Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Card/
│   ├── features/        # Feature-specific components
│   │   └── auth/
│   └── layouts/         # Layout components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── constants/           # Constants and config
├── types/               # TypeScript types
└── styles/              # Global styles
```

## Next.js Quick Reference

### App Router vs Pages Router

| Feature | Pages Router | App Router |
|---------|--------------|------------|
| Directory | `pages/` | `app/` |
| Routing | File-based | Folder-based |
| Layouts | `_app.js`, `_document.js` | `layout.tsx` |
| Data Fetching | `getServerSideProps` | `async` components |
| Loading | Manual | `loading.tsx` |
| Error | `_error.js` | `error.tsx` |
| Metadata | `<Head>` | `metadata` export |

### Server vs Client Components

```tsx
// Server Component (default in App Router)
// - Can use async/await
// - Can access backend directly
// - No hooks, no browser APIs
async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component
'use client';
// - Can use hooks
// - Can use browser APIs
// - Interactive
function ClientComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

## Common Patterns

### Conditional Rendering

```tsx
// ✅ Good patterns
{isLoading && <Spinner />}
{error ? <Error /> : <Content />}
{items.length > 0 && <List items={items} />}

// ❌ Avoid
{isLoading ? <Spinner /> : null}  // Use && instead
{condition && count}  // 0 will render, use condition && count > 0
```

### Props Patterns

```tsx
// Destructure with defaults
function Button({ 
  variant = 'primary',
  size = 'md',
  children,
  ...props 
}: ButtonProps) {
  return <button className={`btn-${variant} btn-${size}`} {...props}>{children}</button>;
}

// Compound components
<Select>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

### State Management Decision Tree

```
Need to share state?
├── No → useState
└── Yes
    ├── Parent-child only? → Lift state up
    ├── Deep prop drilling? → useContext
    ├── Complex state logic? → useReducer
    └── Global/persistent? → Zustand/Redux/Jotai
```

## Quick Fixes

### Common Issues

| Issue | Solution |
|-------|----------|
| Infinite re-renders | Check useEffect deps, memoize callbacks |
| Stale closure | Use functional updates, useRef |
| Props drilling | Context or composition |
| Flash of content | Suspense boundaries |
| Hydration mismatch | Check server/client rendering |

## Output Format

When reviewing React/Next.js code:

```markdown
## Component Review: [ComponentName]

### Summary
[Overall assessment]

### Issues Found
🔴 **Critical:** [Issue]
🟠 **Major:** [Issue]
🟡 **Minor:** [Issue]

### Recommendations
1. [Specific improvement]
2. [Specific improvement]

### Refactored Code
```tsx
[improved code]
```
```
