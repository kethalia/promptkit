# Component Review

Systematic approach to reviewing React components for quality and best practices.

## Component Review Checklist

### Structure & Organization

- [ ] Single responsibility (does one thing well)
- [ ] Reasonable size (< 200 lines preferred)
- [ ] Clear component name describing purpose
- [ ] Props interface is well-defined
- [ ] Proper file organization

### Props

- [ ] Props are typed (TypeScript) or documented (PropTypes)
- [ ] Required vs optional props are clear
- [ ] Default values provided where sensible
- [ ] Props are destructured appropriately
- [ ] No excessive prop drilling

### State Management

- [ ] Minimal state (derived values computed, not stored)
- [ ] State is at the right level
- [ ] No redundant state
- [ ] State updates are immutable
- [ ] Complex state uses useReducer

### Effects & Side Effects

- [ ] useEffect dependencies are correct
- [ ] Cleanup functions provided where needed
- [ ] No unnecessary effects
- [ ] Data fetching handled appropriately
- [ ] No infinite loops

### Rendering

- [ ] No unnecessary re-renders
- [ ] Keys are stable and unique in lists
- [ ] Conditional rendering is clean
- [ ] No inline object/array/function creation in JSX (when problematic)

### Accessibility

- [ ] Semantic HTML elements used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation works
- [ ] Focus management handled
- [ ] Alt text for images

## Common Component Issues

### Issue: Component Does Too Much

```tsx
// ❌ Bad - multiple responsibilities
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => { fetchUser(); }, []);
  useEffect(() => { fetchPosts(); }, []);
  useEffect(() => { fetchNotifications(); }, []);
  
  // 200+ lines of mixed concerns...
}

// ✅ Good - separated concerns
function UserDashboard() {
  return (
    <DashboardLayout>
      <UserProfile />
      <UserPosts />
      <Notifications />
    </DashboardLayout>
  );
}
```

### Issue: Props Drilling

```tsx
// ❌ Bad - passing through multiple levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>

// ✅ Good - use context for deep data
const UserContext = createContext<User | null>(null);

function App() {
  const [user] = useState<User>(userData);
  return (
    <UserContext.Provider value={user}>
      <Layout>
        <Sidebar>
          <UserMenu />
        </Sidebar>
      </Layout>
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  return <div>{user?.name}</div>;
}
```

### Issue: Derived State Stored

```tsx
// ❌ Bad - storing derived state
function ProductList({ products }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setFilteredProducts(
      products.filter(p => p.name.includes(searchTerm))
    );
  }, [products, searchTerm]);
  
  return <List items={filteredProducts} />;
}

// ✅ Good - compute derived values
function ProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = useMemo(
    () => products.filter(p => p.name.includes(searchTerm)),
    [products, searchTerm]
  );
  
  return <List items={filteredProducts} />;
}
```

### Issue: Missing Keys or Bad Keys

```tsx
// ❌ Bad - using index as key
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ❌ Bad - non-unique keys
{items.map(item => (
  <Item key={item.type} data={item} />  // type might not be unique
))}

// ✅ Good - stable unique key
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

### Issue: Inline Functions Causing Re-renders

```tsx
// ❌ Problematic - new function every render
function Parent() {
  return (
    <ExpensiveChild 
      onClick={() => doSomething()}  // New reference each render
      style={{ color: 'red' }}       // New object each render
    />
  );
}

// ✅ Better - stable references
function Parent() {
  const handleClick = useCallback(() => doSomething(), []);
  const style = useMemo(() => ({ color: 'red' }), []);
  
  return <ExpensiveChild onClick={handleClick} style={style} />;
}
```

### Issue: Uncontrolled to Controlled Switch

```tsx
// ❌ Bad - starts uncontrolled, becomes controlled
function Input({ value }) {
  return <input value={value} />;  // value starts as undefined
}

// ✅ Good - always controlled
function Input({ value = '' }) {
  return <input value={value} />;
}

// Or explicitly uncontrolled
function Input({ defaultValue }) {
  return <input defaultValue={defaultValue} />;
}
```

## Component Patterns

### Composition Over Props

```tsx
// ❌ Inflexible - everything through props
<Card 
  title="Hello"
  subtitle="World"
  image="/img.png"
  footer={<Button>Click</Button>}
/>

// ✅ Flexible - composition
<Card>
  <Card.Header>
    <Card.Title>Hello</Card.Title>
    <Card.Subtitle>World</Card.Subtitle>
  </Card.Header>
  <Card.Image src="/img.png" />
  <Card.Footer>
    <Button>Click</Button>
  </Card.Footer>
</Card>
```

### Render Props / Children as Function

```tsx
// Flexible data exposure
function DataFetcher({ url, children }) {
  const { data, loading, error } = useFetch(url);
  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading }) => 
    loading ? <Spinner /> : <UserList users={data} />
  }
</DataFetcher>
```

### Forwarding Refs

```tsx
// For components that wrap DOM elements
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  )
);
```

## Review Template

```markdown
## Component Review: [ComponentName]

### Overview
- **Purpose:** [What this component does]
- **Type:** [Presentational/Container/Layout]
- **Lines:** [Approximate size]

### Props Analysis
| Prop | Type | Required | Notes |
|------|------|----------|-------|
| name | string | Yes | |
| onClick | function | No | Could use better typing |

### Issues Found

#### 🔴 Critical
- [Issue description and location]

#### 🟠 Major  
- [Issue description and location]

#### 🟡 Minor
- [Issue description and location]

### Recommendations
1. [Specific actionable improvement]
2. [Specific actionable improvement]

### Suggested Refactor
```tsx
[Improved code]
```
```
