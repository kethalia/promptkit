---
title: "Hooks Best Practices"
---
# Hooks Best Practices

Guide to proper React hooks usage and common pitfalls.

## Rules of Hooks

### The Two Rules

1. **Only call hooks at the top level** - Not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Components or custom hooks

```tsx
// ❌ Bad - conditional hook
function Component({ isEnabled }) {
  if (isEnabled) {
    const [state, setState] = useState();  // Breaks rules!
  }
}

// ✅ Good - condition inside hook usage
function Component({ isEnabled }) {
  const [state, setState] = useState();
  
  useEffect(() => {
    if (isEnabled) {
      // Do something
    }
  }, [isEnabled]);
}
```

## useState

### Best Practices

```tsx
// Use functional updates when new state depends on old
const [count, setCount] = useState(0);
setCount(prev => prev + 1);  // ✅ Always gets latest value

// Lazy initialization for expensive computations
const [data, setData] = useState(() => expensiveComputation());

// Group related state
const [form, setForm] = useState({ name: '', email: '' });
// Update immutably
setForm(prev => ({ ...prev, name: 'New Name' }));
```

### Common Issues

```tsx
// ❌ Bad - object reference doesn't change
const [items, setItems] = useState([]);
items.push(newItem);  // Mutation!
setItems(items);      // Same reference, no re-render

// ✅ Good - new array reference
setItems(prev => [...prev, newItem]);

// ❌ Bad - stale closure
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setInterval(() => {
      setCount(count + 1);  // Always uses initial count (0)
    }, 1000);
  }, []);
}

// ✅ Good - functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);  // Always gets latest
  }, 1000);
  return () => clearInterval(id);
}, []);
```

## useEffect

### Dependency Array

```tsx
// No deps - runs every render (rarely wanted)
useEffect(() => {
  console.log('Every render');
});

// Empty deps - runs once on mount
useEffect(() => {
  console.log('Mount only');
}, []);

// With deps - runs when deps change
useEffect(() => {
  console.log('When userId changes');
}, [userId]);
```

### Common Issues

```tsx
// ❌ Bad - missing dependency
function Component({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []);  // Missing userId!
}

// ✅ Good - all dependencies included
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// ❌ Bad - object/array dependency causes infinite loop
useEffect(() => {
  doSomething(options);
}, [options]);  // New object reference every render!

// ✅ Good - stable reference or primitive deps
const options = useMemo(() => ({ sort: 'asc' }), []);
useEffect(() => {
  doSomething(options);
}, [options]);

// Or use primitives
useEffect(() => {
  doSomething({ sort: sortOrder });
}, [sortOrder]);
```

### Cleanup

```tsx
// ✅ Always cleanup subscriptions, timers, listeners
useEffect(() => {
  const subscription = api.subscribe(handleUpdate);
  
  return () => {
    subscription.unsubscribe();  // Cleanup!
  };
}, []);

useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### Data Fetching Pattern

```tsx
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;  // Prevent state update on unmounted component
    
    setLoading(true);
    setError(null);
    
    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
}
```

## useCallback

### When to Use

```tsx
// ✅ Use when passing to memoized children
const MemoizedChild = memo(({ onClick }) => <button onClick={onClick}>Click</button>);

function Parent() {
  // Without useCallback, MemoizedChild re-renders every time
  const handleClick = useCallback(() => {
    doSomething();
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}

// ✅ Use when callback is a useEffect dependency
const fetchData = useCallback(async () => {
  const result = await api.get(url);
  setData(result);
}, [url]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// ❌ Don't overuse - adds overhead
// Simple components without memo don't benefit
function SimpleComponent() {
  // This useCallback is unnecessary overhead
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <button onClick={handleClick}>Click</button>;
}
```

## useMemo

### When to Use

```tsx
// ✅ Expensive computations
const sortedItems = useMemo(
  () => items.sort((a, b) => a.name.localeCompare(b.name)),
  [items]
);

// ✅ Referential equality for objects/arrays as deps
const options = useMemo(() => ({
  sortBy: 'name',
  filterBy: category
}), [category]);

useEffect(() => {
  fetchWithOptions(options);
}, [options]);

// ✅ Preventing re-renders of children
const chartData = useMemo(() => processData(rawData), [rawData]);
return <ExpensiveChart data={chartData} />;

// ❌ Don't memoize cheap operations
const doubled = useMemo(() => count * 2, [count]);  // Overkill
const doubled = count * 2;  // Just compute it
```

## useRef

### Use Cases

```tsx
// DOM references
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focus = () => inputRef.current?.focus();
  
  return <input ref={inputRef} />;
}

// Mutable values that don't trigger re-render
function Timer() {
  const intervalRef = useRef<number>();
  
  const start = () => {
    intervalRef.current = setInterval(() => {
      // ...
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(intervalRef.current);
  };
}

// Previous value pattern
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}
```

## useContext

### Best Practices

```tsx
// Create typed context with default
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Custom hook for type-safe access
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggle = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Avoid Re-render Issues

```tsx
// ❌ Bad - new object every render
<MyContext.Provider value={{ user, setUser }}>

// ✅ Good - memoized value
const value = useMemo(() => ({ user, setUser }), [user]);
<MyContext.Provider value={value}>
```

## useReducer

### When to Use Over useState

```tsx
// ✅ Complex state logic
// ✅ Multiple sub-values
// ✅ Next state depends on previous
// ✅ State transitions need to be predictable

interface State {
  loading: boolean;
  error: Error | null;
  data: User | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User }
  | { type: 'FETCH_ERROR'; payload: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

function useUser(userId: string) {
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    error: null,
    data: null
  });
  
  useEffect(() => {
    dispatch({ type: 'FETCH_START' });
    fetchUser(userId)
      .then(user => dispatch({ type: 'FETCH_SUCCESS', payload: user }))
      .catch(error => dispatch({ type: 'FETCH_ERROR', payload: error }));
  }, [userId]);
  
  return state;
}
```

## Custom Hooks

### Patterns

```tsx
// Encapsulate reusable logic
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Compose hooks
function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [token, setToken] = useLocalStorage<string | null>('token', null);
  
  const login = useCallback(async (credentials: Credentials) => {
    const { user, token } = await api.login(credentials);
    setUser(user);
    setToken(token);
  }, [setUser, setToken]);
  
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, [setUser, setToken]);
  
  return { user, token, login, logout, isAuthenticated: !!user };
}
```

## Hooks Checklist

```markdown
### useState
- [ ] Using functional updates when depending on previous state
- [ ] State is immutably updated
- [ ] No derived state that should be computed

### useEffect  
- [ ] All dependencies listed
- [ ] Cleanup function provided for subscriptions/timers
- [ ] No stale closures
- [ ] Considered race conditions for async

### useCallback/useMemo
- [ ] Used only when necessary (memoized children, effect deps)
- [ ] Dependencies are correct
- [ ] Not overused for simple operations

### useRef
- [ ] Used for DOM refs or mutable values that don't need re-render
- [ ] Not used for state that should trigger re-render

### useContext
- [ ] Provider value is memoized
- [ ] Custom hook for type-safe access
- [ ] Error thrown if used outside provider
```
