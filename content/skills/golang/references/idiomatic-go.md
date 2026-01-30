# Idiomatic Go

Guide to writing clean, idiomatic Go code following community conventions.

## Naming Conventions

### General Rules

```go
// MixedCaps, not snake_case
var userCount int      // ✅
var user_count int     // ❌

// Acronyms: all caps
var httpClient *Client // ❌
var HTTPClient *Client // ✅
var xmlParser Parser   // ❌
var XMLParser Parser   // ✅
var userID string      // ✅
var userId string      // ❌

// Short names in small scopes
for i := 0; i < len(items); i++ { }  // ✅
for index := 0; index < len(items); index++ { }  // ❌ (verbose)

// Descriptive names for larger scopes
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request)
```

### Package Names

```go
// Short, lowercase, no underscores
package httputil    // ✅
package http_util   // ❌
package httpUtil    // ❌
package HTTPUtil    // ❌

// Avoid stuttering
package user
type User struct{}   // user.User ✅

package user
type UserStruct struct{}  // user.UserStruct ❌
```

### Interface Names

```go
// Single-method interfaces: method + "er"
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Stringer interface {
    String() string
}

type Closer interface {
    Close() error
}

// Multi-method: descriptive name
type ReadWriter interface {
    Reader
    Writer
}
```

### Getters and Setters

```go
// No "Get" prefix for getters
func (u *User) Name() string { return u.name }    // ✅
func (u *User) GetName() string { return u.name } // ❌

// "Set" prefix for setters
func (u *User) SetName(name string) { u.name = name }  // ✅
```

## Error Handling

### Error Patterns

```go
// Return errors, don't panic
func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }
    return data, nil
}

// Wrap errors with context
if err != nil {
    return fmt.Errorf("reading config from %s: %w", path, err)
}

// Define sentinel errors for expected conditions
var ErrNotFound = errors.New("not found")

// Check errors with errors.Is and errors.As
if errors.Is(err, ErrNotFound) {
    // Handle not found
}

var pathErr *os.PathError
if errors.As(err, &pathErr) {
    // Handle path error specifically
}
```

### Error Messages

```go
// Lowercase, no punctuation
return errors.New("failed to connect")     // ✅
return errors.New("Failed to connect.")    // ❌

// Include context without redundancy
return fmt.Errorf("parse config: %w", err) // ✅
// Produces: "parse config: invalid syntax"

return fmt.Errorf("error parsing config: %w", err) // ❌
// Produces: "error parsing config: invalid syntax" (redundant "error")
```

## Code Organization

### Package Design

```go
// Accept interfaces, return structs
func NewService(repo Repository) *Service {
    return &Service{repo: repo}
}

// Small interfaces at point of use
type userGetter interface {
    GetUser(id string) (*User, error)
}

func process(ug userGetter) error {
    // ...
}
```

### Function Design

```go
// Return early, avoid else
func process(data *Data) error {
    // ❌ Nested
    if data != nil {
        if data.Valid {
            // process
        } else {
            return errors.New("invalid data")
        }
    } else {
        return errors.New("nil data")
    }
    return nil
    
    // ✅ Early return
    if data == nil {
        return errors.New("nil data")
    }
    if !data.Valid {
        return errors.New("invalid data")
    }
    // process
    return nil
}

// Keep functions focused
// If description requires "and", split it
func validateAndSave(user *User) error { }  // ❌
func validate(user *User) error { }          // ✅
func save(user *User) error { }              // ✅
```

## Common Idioms

### Zero Values

```go
// Use zero values meaningfully
var buf bytes.Buffer  // Ready to use
buf.WriteString("hello")

// Initialize only when needed
var once sync.Once
once.Do(func() {
    // Initialization
})
```

### Comma-OK Idiom

```go
// Map lookup
if val, ok := myMap[key]; ok {
    // Key exists
}

// Type assertion
if str, ok := value.(string); ok {
    // Is string
}

// Channel receive
if val, ok := <-ch; ok {
    // Channel not closed
}
```

### Defer

```go
// Close resources immediately after acquiring
func readFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()  // Right after successful open
    
    return io.ReadAll(f)
}

// Defer executes in LIFO order
defer fmt.Println("3")
defer fmt.Println("2")
defer fmt.Println("1")
// Output: 1, 2, 3
```

### Make vs New

```go
// make: slices, maps, channels (returns initialized value)
slice := make([]int, 0, 10)
mp := make(map[string]int)
ch := make(chan int, 5)

// new: returns pointer to zeroed value (rarely needed)
ptr := new(int)  // Same as: var i int; ptr := &i

// Usually just use composite literals
user := &User{Name: "John"}
```

### Options Pattern

```go
type Server struct {
    addr    string
    timeout time.Duration
    logger  *log.Logger
}

type Option func(*Server)

func WithTimeout(d time.Duration) Option {
    return func(s *Server) {
        s.timeout = d
    }
}

func WithLogger(l *log.Logger) Option {
    return func(s *Server) {
        s.logger = l
    }
}

func NewServer(addr string, opts ...Option) *Server {
    s := &Server{
        addr:    addr,
        timeout: 30 * time.Second,
        logger:  log.Default(),
    }
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// Usage
server := NewServer(":8080", 
    WithTimeout(60*time.Second),
    WithLogger(customLogger),
)
```

## Documentation

### Package Documentation

```go
// Package http provides HTTP client and server implementations.
//
// The main types are Client and Server.
// Use Get, Head, Post, and PostForm for simple requests.
//
// For control over HTTP client headers, redirect policy, and other
// settings, create a Client:
//
//	client := &http.Client{
//		Timeout: time.Second * 10,
//	}
//
// See the documentation on Transport for more details.
package http
```

### Function Documentation

```go
// ReadFile reads the named file and returns its contents.
// A successful call returns err == nil, not err == EOF.
// Because ReadFile reads the whole file, it does not treat an EOF
// from Read as an error to be reported.
func ReadFile(name string) ([]byte, error)

// Printf formats according to a format specifier and writes to standard output.
// It returns the number of bytes written and any write error encountered.
func Printf(format string, a ...any) (n int, err error)
```

### Example Functions

```go
func ExamplePrintf() {
    fmt.Printf("Hello, %s!\n", "World")
    // Output: Hello, World!
}

func ExampleServer_ListenAndServe() {
    server := &http.Server{Addr: ":8080"}
    server.ListenAndServe()
}
```

## Testing

### Test Organization

```go
// Table-driven tests
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Add(tt.a, tt.b)
            if got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", 
                    tt.a, tt.b, got, tt.expected)
            }
        })
    }
}
```

### Test Helpers

```go
// t.Helper() for helper functions
func assertEqual(t *testing.T, got, want int) {
    t.Helper()  // Reports caller's line number on failure
    if got != want {
        t.Errorf("got %d; want %d", got, want)
    }
}

// Cleanup with t.Cleanup
func TestWithTempFile(t *testing.T) {
    f, err := os.CreateTemp("", "test")
    if err != nil {
        t.Fatal(err)
    }
    t.Cleanup(func() {
        os.Remove(f.Name())
    })
    // Test using f
}
```

## Anti-Patterns to Avoid

```go
// ❌ Naked returns in long functions
func process() (result int, err error) {
    // 50 lines later...
    return  // What's being returned?
}

// ❌ Panic for error handling
func MustParse(s string) int {
    n, err := strconv.Atoi(s)
    if err != nil {
        panic(err)  // Only for programming errors
    }
    return n
}

// ❌ init() abuse
func init() {
    // Complex initialization
    // Hard to test
    // Hidden side effects
}

// ❌ Global mutable state
var config *Config  // Hard to test, race conditions

// ❌ Deep nesting
if condition {
    if anotherCondition {
        if yetAnother {
            // Do something
        }
    }
}

// ✅ Early returns instead
if !condition {
    return
}
if !anotherCondition {
    return
}
if !yetAnother {
    return
}
// Do something
```

## Quick Reference

| Idiom | Example |
|-------|---------|
| Naming | `userID`, `HTTPClient`, `xmlParser` |
| Error wrap | `fmt.Errorf("context: %w", err)` |
| Check error type | `errors.Is(err, ErrNotFound)` |
| Check error value | `errors.As(err, &pathErr)` |
| Map check | `val, ok := m[key]` |
| Type assert | `str, ok := v.(string)` |
| Empty struct | `struct{}{}` for sets/signals |
| Options | `func WithX(x int) Option` |
