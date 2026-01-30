# Performance Optimization

Fix React performance issues including re-renders, memoization, and bundle optimization.

---

## Context

Before optimizing, gather:
- Components or pages with reported performance issues
- React DevTools Profiler recordings if available
- Bundle analysis output (webpack-bundle-analyzer, @next/bundle-analyzer)
- Current usage of memo, useMemo, useCallback
- Any performance metrics or user complaints

## Instructions

1. **Identify Unnecessary Re-renders**
   - Check parent components that cause child re-renders
   - Look for new object/array literals in JSX props
   - Identify inline function definitions passed as props
   - Find context providers that re-render too broadly
   - Check for state updates that trigger cascading renders
   - Use React DevTools Profiler to trace render causes

2. **Review memo, useMemo, useCallback Usage**
   - **React.memo**: Verify it wraps components receiving stable props
   - **useMemo**: Check computation cost justifies memoization
   - **useCallback**: Verify callback is passed to memoized children
   - Identify memoization that adds overhead without benefit
   - Find missing memoization on expensive operations
   - Remove unnecessary memoization on primitive values

3. **Check Dependency Arrays for Correctness**
   - Verify useEffect dependencies match all referenced values
   - Check for objects/arrays in dependencies (should be memoized)
   - Identify functions that should be wrapped in useCallback
   - Find missing dependencies causing stale values
   - Look for over-specified dependencies causing excess runs

4. **Identify Expensive Computations in Render**
   - Find array .filter()/.map()/.sort() without memoization
   - Identify complex calculations in component body
   - Look for JSON.parse/stringify in render path
   - Check for date/number formatting in loops
   - Find regex operations on every render
   - Locate large object/array creations in render

5. **Review Bundle Size Impact**
   - Check for large dependencies that could be replaced
   - Identify duplicate packages in bundle
   - Find full library imports vs specific imports (lodash, moment)
   - Look for dev dependencies included in production
   - Check for unused exports that could be tree-shaken
   - Review image and asset sizes

6. **Suggest Code Splitting Opportunities**
   - Find routes that should be lazy loaded
   - Identify heavy components below the fold
   - Look for modal/dialog content to lazy load
   - Check for conditional features that could be split
   - Review dynamic imports usage
   - Identify admin/authenticated-only sections

7. **Propose React.lazy/Suspense Usage**
   - Identify components suitable for lazy loading
   - Design Suspense boundary placement
   - Plan loading fallback UI (skeletons, spinners)
   - Handle error boundaries for lazy components
   - Consider prefetching for critical paths

## Output Format

```markdown
## Performance Analysis: [Component/Page]

### Re-render Issues
| Location | Cause | Impact | Fix |
|----------|-------|--------|-----|
| [file:line] | [cause] | High/Med/Low | [solution] |

### Memoization Audit
#### Missing (Should Add)
- [ ] `useMemo` for [calculation] at [location]
- [ ] `useCallback` for [handler] at [location]
- [ ] `React.memo` for [Component]

#### Unnecessary (Should Remove)
- [ ] [location]: [reason adds overhead]

### Dependency Array Issues
| Hook | Location | Issue | Correct Dependencies |
|------|----------|-------|---------------------|
| useEffect | [file:line] | Missing: X | [a, b, c] |
| useMemo | [file:line] | Unnecessary: Y | [a, b] |

### Expensive Render Operations
| Operation | Location | Frequency | Solution |
|-----------|----------|-----------|----------|
| [op] | [file:line] | per render/mount | [fix] |

### Bundle Size Analysis
- **Current Size**: [X KB]
- **Potential Savings**: [Y KB]
- **Opportunities**:
  1. [Package] → [Alternative]: saves ~X KB
  2. [Specific import]: saves ~X KB

### Code Splitting Plan
| Component/Route | Method | Estimated Savings |
|-----------------|--------|-------------------|
| [name] | React.lazy | ~X KB |
| [name] | Next.js dynamic | ~X KB |

### Suspense Implementation
```tsx
// Suggested implementation
<Suspense fallback={<Skeleton />}>
  <LazyComponent />
</Suspense>
```

### Priority Fixes (by impact)
1. **High**: [Fix] - Expected improvement: [X]
2. **Medium**: [Fix] - Expected improvement: [X]
3. **Low**: [Fix] - Expected improvement: [X]
```

## Interactive Decisions

Ask the user before proceeding when:
- Memoization adds complexity but benefit is unclear
- Lazy loading will add loading states requiring UX decisions
- Dependency replacement requires migration effort
- Architecture changes affect multiple files
- Performance measurement is needed before optimization
- Bundle splitting affects critical rendering path
