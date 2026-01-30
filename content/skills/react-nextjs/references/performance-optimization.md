# Performance Optimization

Guide to optimizing React and Next.js application performance.

## React Performance

### Identifying Performance Issues

**React DevTools Profiler:**
1. Install React DevTools browser extension
2. Open Profiler tab
3. Record interactions
4. Identify slow renders

**Common symptoms:**
- Janky scrolling
- Slow input response
- High CPU usage
- Laggy animations

### Re-render Optimization

#### Understanding Re-renders

```tsx
// Component re-renders when:
// 1. State changes
// 2. Props change
// 3. Parent re-renders
// 4. Context value changes
```

#### React.memo

```tsx
// Memoize components that receive same props often
const ExpensiveList = memo(function ExpensiveList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
});

// With custom comparison
const UserCard = memo(
  function UserCard({ user }: Props) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
```

#### Stable References

```tsx
// ❌ Creates new object every render
<Child config={{ theme: 'dark' }} />

// ✅ Stable reference
const config = useMemo(() => ({ theme: 'dark' }), []);
<Child config={config} />

// ❌ Creates new function every render
<Child onClick={() => handleClick(id)} />

// ✅ Stable callback
const handleItemClick = useCallback(() => handleClick(id), [id]);
<Child onClick={handleItemClick} />
```

#### State Colocation

```tsx
// ❌ Bad - state too high, causes unnecessary re-renders
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div>
      <Header />  {/* Re-renders on every keystroke! */}
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <Results searchTerm={searchTerm} />
    </div>
  );
}

// ✅ Good - state colocated with consumers
function App() {
  return (
    <div>
      <Header />
      <SearchSection />  {/* Contains its own state */}
    </div>
  );
}

function SearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <Results searchTerm={searchTerm} />
    </>
  );
}
```

### Virtualization

For long lists, render only visible items:

```tsx
// Using react-window
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}

// Using @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              height: virtualRow.size,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Code Splitting

```tsx
// Lazy load components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based splitting (Next.js automatic)
// Each page is automatically code-split

// Named exports
const Modal = lazy(() => 
  import('./Modal').then(module => ({ default: module.Modal }))
);
```

### Debouncing & Throttling

```tsx
// Debounce search input
function SearchInput() {
  const [value, setValue] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      performSearch(term);
    }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <input
      value={value}
      onChange={e => {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}

// Throttle scroll handler
function ScrollTracker() {
  useEffect(() => {
    const handleScroll = throttle(() => {
      trackScrollPosition(window.scrollY);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
```

## Next.js Performance

### Image Optimization

```tsx
import Image from 'next/image';

// ✅ Optimized image
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // For above-fold images
  placeholder="blur"
  blurDataURL={blurUrl}
/>

// Responsive images
<Image
  src="/photo.jpg"
  alt="Photo"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/>
```

### Font Optimization

```tsx
// next/font automatically optimizes fonts
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',  // Prevent FOIT
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Server Components (App Router)

```tsx
// Server Components - no JS shipped to client
async function ProductList() {
  const products = await db.products.findMany();  // Direct DB access
  
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}

// Only use 'use client' when needed
'use client';
function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  // Interactive component - needs client
}
```

### Streaming & Suspense

```tsx
// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />  {/* Streams in when ready */}
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />  {/* Streams independently */}
      </Suspense>
    </main>
  );
}

// loading.tsx for route-level loading
export default function Loading() {
  return <DashboardSkeleton />;
}
```

### Caching Strategies

```tsx
// Fetch caching
async function getData() {
  // Cached by default in App Router
  const res = await fetch('https://api.example.com/data');
  
  // Revalidate every hour
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }
  });
  
  // No cache
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  });
}

// Route segment config
export const revalidate = 3600;  // Revalidate page every hour
export const dynamic = 'force-static';  // Force static generation
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

# Run analysis
ANALYZE=true npm run build
```

## Performance Checklist

```markdown
### React
- [ ] Using React.memo for expensive components
- [ ] Callbacks memoized with useCallback when passed to memoized children
- [ ] Complex computations memoized with useMemo
- [ ] State colocated appropriately
- [ ] Long lists virtualized
- [ ] Heavy components lazy loaded
- [ ] Input handlers debounced/throttled

### Next.js
- [ ] Using next/image for images
- [ ] Using next/font for fonts
- [ ] Server Components where possible
- [ ] Proper caching strategies
- [ ] Streaming with Suspense
- [ ] Bundle analyzed for large dependencies

### General
- [ ] No unnecessary re-renders (check Profiler)
- [ ] Critical CSS inlined
- [ ] Third-party scripts deferred
- [ ] Lighthouse score monitored
```

## Quick Wins

| Issue | Solution |
|-------|----------|
| Large bundle | Dynamic imports, tree shaking |
| Slow images | next/image, WebP, lazy loading |
| Layout shift | Size images, font display swap |
| Slow API | Caching, streaming, optimistic updates |
| Re-renders | memo, useCallback, state colocation |
| Long lists | Virtualization |
