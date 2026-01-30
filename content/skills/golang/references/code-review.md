# Go Code Review

Systematic approach to reviewing Go code for quality and best practices.

## Code Review Checklist

### Error Handling

```go
// ❌ Bad - ignored error
result, _ := doSomething()

// ❌ Bad - generic error message
if err != nil {
    return errors.New("error occurred")
}

// ✅ Good - error handled with context
result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed to do something for %s: %w", id, err)
}
```

### Resource Management

```go
// ❌ Bad - resource leak
func readFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    return io.ReadAll(f)  // File never closed!
}

// ✅ Good - defer close
func readFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()
    return io.ReadAll(f)
}

// ✅ Better - check close error for writes
func writeFile(path string, data []byte) (err error) {
    f, err := os.Create(path)
    if err != nil {
        return err
    }
    defer func() {
        if cerr := f.Close(); err == nil {
            err = cerr
        }
    }()
    _, err = f.Write(data)
    return err
}
```

### Nil Checks

```go
// ❌ Bad - potential nil pointer dereference
func process(user *User) string {
    return user.Name  // Panic if user is nil
}

// ✅ Good - nil check
func process(user *User) string {
    if user == nil {
        return ""
    }
    return user.Name
}

// ✅ Good - document non-nil requirement
// process processes a user. user must not be nil.
func process(user *User) string {
    return user.Name
}
```

### Slice Operations

```go
// ❌ Bad - nil slice vs empty slice confusion
var items []string        // nil slice
items := []string{}       // empty slice
items := make([]string, 0) // empty slice

// ✅ Good - be intentional
// For JSON: use empty slice to get [] instead of null
items := make([]string, 0)

// For checking: both nil and empty are handled
if len(items) == 0 {
    // handles both nil and empty
}

// ❌ Bad - slice append may reallocate
func addItems(items []string) {
    items = append(items, "new")  // Original not modified!
}

// ✅ Good - return new slice
func addItems(items []string) []string {
    return append(items, "new")
}
```

### Map Operations

```go
// ❌ Bad - writing to nil map panics
var users map[string]*User
users["id"] = &User{}  // Panic!

// ✅ Good - initialize map
users := make(map[string]*User)
users["id"] = &User{}

// ❌ Bad - not checking map existence
user := users["id"]
user.Name = "test"  // Panic if not found!

// ✅ Good - comma ok idiom
if user, ok := users["id"]; ok {
    user.Name = "test"
}
```

### Interface Usage

```go
// ❌ Bad - too large interface
type DataStore interface {
    Get(id string) (*Data, error)
    List() ([]*Data, error)
    Create(d *Data) error
    Update(d *Data) error
    Delete(id string) error
    Backup() error
    Restore() error
    // ... many more
}

// ✅ Good - small, focused interfaces
type Reader interface {
    Get(id string) (*Data, error)
}

type Writer interface {
    Create(d *Data) error
    Update(d *Data) error
}

type ReadWriter interface {
    Reader
    Writer
}

// ❌ Bad - returning concrete type, accepting interface
func NewService(repo *PostgresRepo) *Service { }

// ✅ Good - accept interfaces, return structs
func NewService(repo Repository) *Service { }
```

### Concurrency Safety

```go
// ❌ Bad - data race
type Counter struct {
    count int
}

func (c *Counter) Increment() {
    c.count++  // Race condition!
}

// ✅ Good - mutex protection
type Counter struct {
    mu    sync.Mutex
    count int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

// ✅ Good - atomic for simple operations
type Counter struct {
    count atomic.Int64
}

func (c *Counter) Increment() {
    c.count.Add(1)
}
```

### Context Usage

```go
// ❌ Bad - context not propagated
func handler(w http.ResponseWriter, r *http.Request) {
    result := fetchData()  // No context!
}

// ✅ Good - context propagated
func handler(w http.ResponseWriter, r *http.Request) {
    result, err := fetchData(r.Context())
    if err != nil {
        // Handle context cancellation
        if errors.Is(err, context.Canceled) {
            return
        }
    }
}

// ❌ Bad - storing context in struct
type Service struct {
    ctx context.Context  // Don't do this!
}

// ✅ Good - pass context to methods
type Service struct{}

func (s *Service) Process(ctx context.Context, data *Data) error {
    // Use ctx
}
```

### Goroutine Lifecycle

```go
// ❌ Bad - goroutine leak
func startWorker() {
    go func() {
        for {
            process()  // Never terminates!
        }
    }()
}

// ✅ Good - controlled shutdown
func startWorker(ctx context.Context) {
    go func() {
        for {
            select {
            case <-ctx.Done():
                return
            default:
                process()
            }
        }
    }()
}

// ✅ Good - WaitGroup for cleanup
func processAll(items []Item) {
    var wg sync.WaitGroup
    for _, item := range items {
        wg.Add(1)
        go func(item Item) {
            defer wg.Done()
            process(item)
        }(item)
    }
    wg.Wait()
}
```

## Review Template

```markdown
## Go Code Review: [Package Name]

### Summary
- **Files Reviewed:** X
- **Lines of Code:** X
- **Test Coverage:** X%

### Critical Issues
- [ ] Error handling gaps
- [ ] Resource leaks
- [ ] Data races
- [ ] Goroutine leaks

### Code Quality
- [ ] Naming follows conventions
- [ ] Functions are focused
- [ ] Interfaces are small
- [ ] Error messages are descriptive

### Testing
- [ ] Tests exist for public API
- [ ] Edge cases covered
- [ ] Race detector passes
- [ ] Benchmarks for hot paths

### Documentation
- [ ] Package doc exists
- [ ] Exported functions documented
- [ ] Examples where helpful

### Specific Findings

#### File: [filename.go]
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|
| X | [description] | High/Med/Low | [suggestion] |

### Recommendations
1. [Specific improvement]
2. [Specific improvement]
```

## Common Review Findings

| Issue | Frequency | Fix |
|-------|-----------|-----|
| Ignored errors | Very High | Handle or explicitly ignore with `_ =` |
| Missing defer close | High | Add `defer f.Close()` |
| Data race | Medium | Add mutex or use atomic |
| Nil pointer | Medium | Add nil check |
| Goroutine leak | Medium | Use context for cancellation |
| Large interface | Medium | Split into smaller interfaces |
| Poor error message | High | Use `fmt.Errorf` with context |
