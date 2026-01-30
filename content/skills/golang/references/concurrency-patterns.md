# Concurrency Patterns

Guide to Go concurrency primitives and patterns.

## Goroutines

### Basic Goroutine

```go
// Start a goroutine
go func() {
    // Runs concurrently
}()

// ⚠️ Common mistake - variable capture
for i := 0; i < 10; i++ {
    go func() {
        fmt.Println(i)  // Bug: prints same value!
    }()
}

// ✅ Fix - pass as parameter
for i := 0; i < 10; i++ {
    go func(i int) {
        fmt.Println(i)  // Correct
    }(i)
}
```

### Goroutine Lifecycle

```go
// Pattern: Controlled shutdown with context
func worker(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            fmt.Println("Shutting down")
            return
        default:
            doWork()
        }
    }
}

// Usage
ctx, cancel := context.WithCancel(context.Background())
go worker(ctx)

// Later: signal shutdown
cancel()
```

## Channels

### Channel Basics

```go
// Unbuffered - synchronous
ch := make(chan int)

// Buffered - async up to capacity
ch := make(chan int, 10)

// Send and receive
ch <- value    // Send
value := <-ch  // Receive

// Close channel (only sender should close)
close(ch)

// Check if closed
value, ok := <-ch
if !ok {
    // Channel closed
}
```

### Channel Patterns

#### Fan-Out: One to Many

```go
func fanOut(input <-chan int, workers int) []<-chan int {
    channels := make([]<-chan int, workers)
    for i := 0; i < workers; i++ {
        ch := make(chan int)
        channels[i] = ch
        go func(ch chan<- int) {
            for v := range input {
                ch <- process(v)
            }
            close(ch)
        }(ch)
    }
    return channels
}
```

#### Fan-In: Many to One

```go
func fanIn(channels ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)

    // Start output goroutine for each input channel
    for _, ch := range channels {
        wg.Add(1)
        go func(c <-chan int) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }

    // Close output when all inputs are done
    go func() {
        wg.Wait()
        close(out)
    }()

    return out
}
```

#### Pipeline

```go
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

// Usage
nums := generate(1, 2, 3, 4)
squares := square(nums)
for s := range squares {
    fmt.Println(s)
}
```

#### Worker Pool

```go
func workerPool(ctx context.Context, jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return
                case job, ok := <-jobs:
                    if !ok {
                        return
                    }
                    results <- process(job)
                }
            }
        }()
    }
    
    wg.Wait()
    close(results)
}
```

#### Semaphore (Limit Concurrency)

```go
// Using buffered channel as semaphore
sem := make(chan struct{}, maxConcurrent)

for _, item := range items {
    sem <- struct{}{}  // Acquire
    go func(item Item) {
        defer func() { <-sem }()  // Release
        process(item)
    }(item)
}

// Wait for all
for i := 0; i < cap(sem); i++ {
    sem <- struct{}{}
}
```

## Select Statement

### Basic Select

```go
select {
case v := <-ch1:
    // Received from ch1
case ch2 <- value:
    // Sent to ch2
case <-time.After(timeout):
    // Timeout
default:
    // Non-blocking: runs if nothing else ready
}
```

### Common Select Patterns

```go
// Timeout
select {
case result := <-resultCh:
    return result, nil
case <-time.After(5 * time.Second):
    return nil, errors.New("timeout")
}

// Cancellation
select {
case <-ctx.Done():
    return ctx.Err()
case result := <-resultCh:
    return result, nil
}

// Non-blocking send
select {
case ch <- value:
    // Sent
default:
    // Channel full, handle backpressure
}
```

## Sync Package

### Mutex

```go
type SafeMap struct {
    mu   sync.Mutex
    data map[string]int
}

func (m *SafeMap) Get(key string) int {
    m.mu.Lock()
    defer m.mu.Unlock()
    return m.data[key]
}

func (m *SafeMap) Set(key string, value int) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.data[key] = value
}
```

### RWMutex

```go
type SafeMap struct {
    mu   sync.RWMutex
    data map[string]int
}

// Multiple readers allowed
func (m *SafeMap) Get(key string) int {
    m.mu.RLock()
    defer m.mu.RUnlock()
    return m.data[key]
}

// Only one writer
func (m *SafeMap) Set(key string, value int) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.data[key] = value
}
```

### WaitGroup

```go
var wg sync.WaitGroup

for _, item := range items {
    wg.Add(1)
    go func(item Item) {
        defer wg.Done()
        process(item)
    }(item)
}

wg.Wait()  // Block until all done
```

### Once

```go
var (
    instance *Config
    once     sync.Once
)

func GetConfig() *Config {
    once.Do(func() {
        instance = loadConfig()
    })
    return instance
}
```

### Cond

```go
type Queue struct {
    mu    sync.Mutex
    cond  *sync.Cond
    items []int
}

func NewQueue() *Queue {
    q := &Queue{}
    q.cond = sync.NewCond(&q.mu)
    return q
}

func (q *Queue) Push(item int) {
    q.mu.Lock()
    q.items = append(q.items, item)
    q.cond.Signal()  // Wake one waiter
    q.mu.Unlock()
}

func (q *Queue) Pop() int {
    q.mu.Lock()
    for len(q.items) == 0 {
        q.cond.Wait()  // Wait for signal
    }
    item := q.items[0]
    q.items = q.items[1:]
    q.mu.Unlock()
    return item
}
```

### Pool

```go
var bufferPool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 1024)
    },
}

func process() {
    buf := bufferPool.Get().([]byte)
    defer bufferPool.Put(buf)
    
    // Use buf
}
```

## Atomic Operations

```go
import "sync/atomic"

// Atomic counter
var counter atomic.Int64

counter.Add(1)
counter.Load()
counter.Store(0)

// Compare and swap
old := counter.Load()
swapped := counter.CompareAndSwap(old, new)

// Atomic pointer
var config atomic.Pointer[Config]
config.Store(&Config{})
cfg := config.Load()
```

## Error Handling in Goroutines

```go
// errgroup for concurrent error handling
import "golang.org/x/sync/errgroup"

func processAll(ctx context.Context, items []Item) error {
    g, ctx := errgroup.WithContext(ctx)
    
    for _, item := range items {
        item := item  // Capture
        g.Go(func() error {
            return process(ctx, item)
        })
    }
    
    return g.Wait()  // Returns first error
}
```

## Common Concurrency Bugs

### Data Race

```go
// ❌ Data race
var count int
go func() { count++ }()
go func() { count++ }()

// ✅ Fix with mutex or atomic
var count atomic.Int64
go func() { count.Add(1) }()
go func() { count.Add(1) }()
```

### Goroutine Leak

```go
// ❌ Leak - channel never read
func leak() {
    ch := make(chan int)
    go func() {
        ch <- 1  // Blocked forever
    }()
    // Function returns, goroutine stuck
}

// ✅ Fix - buffered or ensure read
func noLeak() {
    ch := make(chan int, 1)  // Buffered
    go func() {
        ch <- 1
    }()
}
```

### Deadlock

```go
// ❌ Deadlock - circular wait
func deadlock() {
    ch1 := make(chan int)
    ch2 := make(chan int)
    
    go func() {
        <-ch1
        ch2 <- 1
    }()
    
    <-ch2  // Waiting for ch2
    ch1 <- 1  // Never reached
}
```

## Testing Concurrent Code

```bash
# Run with race detector
go test -race ./...

# Stress test
go test -race -count=100 ./...
```

```go
// Use t.Parallel() for concurrent tests
func TestConcurrent(t *testing.T) {
    t.Parallel()
    // Test code
}
```
