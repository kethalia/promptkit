# Hooks Best Practices

Review React hooks usage for correctness, dependency arrays, and common pitfalls.

---

## Context

Before reviewing, gather:
- Component files using hooks
- Custom hooks in the codebase
- Any reported bugs related to stale data or infinite loops
- Current ESLint configuration (eslint-plugin-react-hooks)
- State management approach (Context, Redux, Zustand, etc.)

## Instructions

1. **Validate Rules of Hooks Compliance**
   - Verify hooks are called at top level only
   - Check hooks are not called conditionally
   - Ensure hooks are not called inside loops
   - Verify hooks are only called from React functions
   - Check custom hooks start with "use" prefix
   - Confirm no hooks called after early returns

2. **Review Dependency Arrays for Correctness**
   - Run exhaustive-deps check mentally or via linter
   - Identify missing dependencies that cause stale values
   - Find unnecessary dependencies causing excess runs
   - Check for objects/arrays that should be memoized
   - Verify function dependencies are wrapped in useCallback
   - Look for effects that should be split into multiple useEffects

3. **Identify Stale Closure Issues**
   - Find callbacks referencing state without dependencies
   - Check setInterval/setTimeout callbacks for stale values
   - Look for event listeners with stale closure captures
   - Verify async operations handle current values correctly
   - Check debounced/throttled functions capture current values
   - Identify refs that should be used instead of state

4. **Check Custom Hook Design**
   - Verify hook has single, clear responsibility
   - Check return value consistency (object vs array vs value)
   - Ensure proper TypeScript typing on parameters and return
   - Look for custom hooks that should be split
   - Verify hooks are properly documented
   - Check for reusable logic not yet extracted to hooks

5. **Review useEffect Cleanup**
   - Verify cleanup for subscriptions (WebSocket, EventSource)
   - Check cleanup for timers (setTimeout, setInterval)
   - Ensure cleanup for event listeners
   - Verify abort controllers for fetch requests
   - Check animation frame cleanup
   - Look for missing cleanup causing memory leaks

6. **Identify Hooks That Should Be Extracted**
   - Identify repeated hook patterns across components
   - Find complex useEffect logic that could be abstracted
   - Look for state + handlers that travel together
   - Identify form handling patterns to extract
   - Find data fetching patterns to standardize
   - Check for authentication/authorization logic to share

7. **Check for Common Pitfalls**
   - **Object dependencies**: Objects/arrays recreated each render
   - **Missing dependencies**: Values used but not in dep array
   - **Function dependencies**: Functions causing infinite loops
   - **Async in useEffect**: Not handling cleanup/race conditions
   - **State in cleanup**: Using stale state in cleanup function
   - **Derived state**: State that should be computed from props

## Output Format

```markdown
## Hooks Review: [Component/Hook Name]

### Rules of Hooks Violations
| Location | Violation | Fix |
|----------|-----------|-----|
| [file:line] | [description] | [solution] |

### Dependency Array Issues
| Hook | Location | Issue | Correct Dependencies |
|------|----------|-------|---------------------|
| useEffect | [file:line] | Missing: X | [a, b, c] |
| useMemo | [file:line] | Unnecessary: Y | [a, b] |
| useCallback | [file:line] | Object dep: Z | [memoized version] |

### Stale Closure Risks
| Location | Risk | Pattern | Fix |
|----------|------|---------|-----|
| [file:line] | High/Med/Low | [setTimeout/listener/etc] | [solution] |

### Custom Hooks Analysis
#### [hookName]
- **Purpose**: [description]
- **Issues**:
  - [ ] [issue]
- **Improvements**:
  - [ ] [suggestion]

### Missing Cleanup
| Effect Location | Resource | Required Cleanup |
|-----------------|----------|------------------|
| [file:line] | [subscription/timer/etc] | [cleanup code] |

### Extraction Opportunities
1. **use[Name]**
   - Combines: [state + effects being extracted]
   - Found in: [Component1, Component2, ...]
   - Reusability: High/Medium

### Common Pitfalls Found
| Pitfall | Location | Issue | Fix |
|---------|----------|-------|-----|
| Object deps | [file:line] | [object] recreated | useMemo or move outside |
| Missing deps | [file:line] | [value] not listed | Add to array |
| Async cleanup | [file:line] | No abort controller | Add AbortController |

### Fixes by Priority
1. **Critical** (bugs/memory leaks):
   - [Fix]
2. **Important** (stale data risks):
   - [Fix]
3. **Recommended** (best practices):
   - [Fix]
```

## Interactive Decisions

Ask the user before proceeding when:
- Fixing stale closure requires restructuring to useReducer or refs
- Hook extraction would create a new shared module
- Adding dependencies will change effect run frequency
- Error handling strategy needs to be chosen (local state, boundary, toast)
- Breaking changes might alter component behavior
- Complex refactoring is needed to fix properly
