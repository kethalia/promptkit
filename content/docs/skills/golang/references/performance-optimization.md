---
title: "Performance Optimization"
---
# Performance Optimization

Guide to profiling and optimizing Go applications.

## Profiling

### CPU Profiling

```go
import "runtime/pprof"

// In code
f, _ := os.Create("cpu.prof")
pprof.StartCPUProfile(f)
defer pprof.StopCPUProfile()

// Run your code
```

```bash
# From test
go test -cpuprofile=cpu.prof -bench=.

# Analyze
go tool pprof cpu.prof
(pprof) top10
(pprof) list functionName
(pprof) web  # Visualize in browser
```

### Memory Profiling

```go
import "runtime/pprof"

f, _ := os.Create("mem.prof")
pprof.WriteHeapProfile(f)
f.Close()
```

```bash
# From test
go test -memprofile=mem.prof -bench=.

# Analyze
go tool pprof mem.prof
(pprof) top10 --alloc_space    # Total allocations
(pprof) top10 --inuse_space    # Current heap
```

### HTTP Profiling

```go
import _ "net/http/pprof"

// Adds endpoints to default mux
go func() {
    http.ListenAndServe("localhost:6060", nil)
}()
```

```bash
# Access profiles
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
go tool pprof http://localhost:6060/debug/pprof/heap
go tool pprof http://localhost:6060/debug/pprof/goroutine
```

### Tracing

```go
import "runtime/trace"

f, _ := os.Create("trace.out")
trace.Start(f)
defer trace.Stop()
```

```bash
go test -trace=trace.out
go tool trace trace.out
```

## Benchmarking

### Writing Benchmarks

```go
// In _test.go file
func BenchmarkFunction(b *testing.B) {
    // Setup (not timed)
    data := prepareData()
    
    b.ResetTimer()  // Reset after setup
    
    for i := 0; i < b.N; i++ {
        process(data)
    }
}

// With sub-benchmarks
func BenchmarkProcess(b *testing.B) {
    sizes := []int{10, 100, 1000, 10000}
    for _, size := range sizes {
        b.Run(fmt.Sprintf("size=%d", size), func(b *testing.B) {
            data := make([]int, size)
            b.ResetTimer()
            for i := 0; i < b.N; i++ {
                process(data)
            }
        })
    }
}

// Memory benchmarks
func BenchmarkAlloc(b *testing.B) {
    b.ReportAllocs()
    for i := 0; i < b.N; i++ {
        _ = make([]byte, 1024)
    }
}
```

```bash
# Run benchmarks
go test -bench=. -benchmem

# Compare benchmarks
go test -bench=. -count=10 > old.txt
# Make changes
go test -bench=. -count=10 > new.txt
benchstat old.txt new.txt
```

## Memory Optimizations

### Reduce Allocations

```go
// ❌ Allocates on every call
func concat(a, b string) string {
    return a + b  // Allocates new string
}

// ✅ Use strings.Builder
func concat(strs ...string) string {
    var b strings.Builder
    for _, s := range strs {
        b.WriteString(s)
    }
    return b.String()
}

// ✅ Pre-allocate builder
func concat(strs ...string) string {
    total := 0
    for _, s := range strs {
        total += len(s)
    }
    var b strings.Builder
    b.Grow(total)  // Pre-allocate
    for _, s := range strs {
        b.WriteString(s)
    }
    return b.String()
}
```

### Slice Pre-allocation

```go
// ❌ Multiple reallocations
var result []int
for i := 0; i < n; i++ {
    result = append(result, i)
}

// ✅ Pre-allocate capacity
result := make([]int, 0, n)
for i := 0; i < n; i++ {
    result = append(result, i)
}

// ✅ If length known
result := make([]int, n)
for i := 0; i < n; i++ {
    result[i] = i
}
```

### Avoid Slice/Map Copies

```go
// ❌ Pass by value - copies entire slice header
func process(data []int) { }

// For large underlying arrays, this is fine since slice is a header
// But for maps:

// ❌ Unnecessary copy if read-only
func printMap(m map[string]int) {
    for k, v := range m {
        fmt.Println(k, v)
    }
}

// Maps are already reference types, so no copy happens
// But be aware of mutation
```

### Sync.Pool for Reuse

```go
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func process(data []byte) string {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufPool.Put(buf)
    }()
    
    buf.Write(data)
    return buf.String()
}
```

### Avoid Interface Allocations

```go
// ❌ Allocates when converting to interface{}
func print(v interface{}) {
    fmt.Println(v)
}
print(42)  // Boxing allocation

// ✅ Use generics (Go 1.18+)
func print[T any](v T) {
    fmt.Println(v)
}
print(42)  // No allocation
```

## CPU Optimizations

### Loop Optimizations

```go
// ❌ Bounds check on every iteration
for i := 0; i < len(slice); i++ {
    _ = slice[i]
}

// ✅ Range eliminates bounds checks
for _, v := range slice {
    _ = v
}

// ✅ Hoist length if modifying
n := len(slice)
for i := 0; i < n; i++ {
    // ...
}
```

### Inline Small Functions

```go
// Compiler inlines small functions
// Use //go:noinline to prevent (for testing)

//go:noinline
func notInlined() int {
    return 42
}
```

### Avoid Defer in Hot Loops

```go
// ❌ Defer overhead in tight loop
for i := 0; i < 1000000; i++ {
    mu.Lock()
    defer mu.Unlock()  // Deferred 1M times!
    // ...
}

// ✅ Manual unlock
for i := 0; i < 1000000; i++ {
    mu.Lock()
    // ...
    mu.Unlock()
}

// Or extract to function
for i := 0; i < 1000000; i++ {
    processItem(i)  // defer inside is fine
}

func processItem(i int) {
    mu.Lock()
    defer mu.Unlock()
    // ...
}
```

### Use Appropriate Data Structures

```go
// Map vs Slice for lookups
// Map: O(1) lookup, more memory
// Slice: O(n) lookup, less memory

// For small collections (< 10-20), slice might be faster
// due to cache locality

// Sets using map[T]struct{}
set := make(map[string]struct{})
set["key"] = struct{}{}
_, exists := set["key"]
```

## I/O Optimizations

### Buffered I/O

```go
// ❌ Unbuffered writes
for _, line := range lines {
    file.Write([]byte(line))  // System call per line
}

// ✅ Buffered writer
w := bufio.NewWriter(file)
for _, line := range lines {
    w.WriteString(line)
}
w.Flush()
```

### Reduce System Calls

```go
// ❌ Multiple reads
buf := make([]byte, 1)
for {
    n, err := reader.Read(buf)
    // ...
}

// ✅ Larger buffer
buf := make([]byte, 4096)
for {
    n, err := reader.Read(buf)
    // Process buf[:n]
}
```

## Concurrency Optimizations

### Reduce Lock Contention

```go
// ❌ Single lock for everything
type Cache struct {
    mu   sync.Mutex
    data map[string]interface{}
}

// ✅ Sharded locks
type Cache struct {
    shards [256]struct {
        mu   sync.RWMutex
        data map[string]interface{}
    }
}

func (c *Cache) getShard(key string) *shard {
    hash := fnv.New32()
    hash.Write([]byte(key))
    return &c.shards[hash.Sum32()%256]
}
```

### Batch Operations

```go
// ❌ Process one at a time
for _, item := range items {
    result := process(item)
    send(result)
}

// ✅ Batch processing
batch := make([]Result, 0, batchSize)
for _, item := range items {
    batch = append(batch, process(item))
    if len(batch) >= batchSize {
        sendBatch(batch)
        batch = batch[:0]
    }
}
if len(batch) > 0 {
    sendBatch(batch)
}
```

## Optimization Checklist

```markdown
### Before Optimizing
- [ ] Profile to find actual bottlenecks
- [ ] Benchmark to measure current performance
- [ ] Set performance targets

### Memory
- [ ] Pre-allocate slices/maps when size known
- [ ] Use sync.Pool for frequently allocated objects
- [ ] Avoid unnecessary allocations in hot paths
- [ ] Consider using []byte instead of string for mutations

### CPU
- [ ] Use range loops for bounds check elimination
- [ ] Avoid defer in very tight loops
- [ ] Consider inlining small hot functions
- [ ] Use appropriate data structures

### I/O
- [ ] Buffer reads and writes
- [ ] Batch operations
- [ ] Use connection pooling

### Concurrency
- [ ] Minimize lock scope
- [ ] Consider lock-free structures for hot paths
- [ ] Shard data to reduce contention
- [ ] Right-size worker pools
```

## Quick Reference Commands

```bash
# Profile CPU
go test -cpuprofile=cpu.prof -bench=BenchmarkX
go tool pprof -http=:8080 cpu.prof

# Profile memory
go test -memprofile=mem.prof -bench=BenchmarkX
go tool pprof -http=:8080 mem.prof

# Benchmark with memory stats
go test -bench=. -benchmem

# Compare benchmarks
benchstat old.txt new.txt

# Escape analysis
go build -gcflags='-m' ./...

# Check inlining
go build -gcflags='-m -m' ./...
```
