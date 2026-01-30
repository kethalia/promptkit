---
title: "Rust Performance"
---
# Rust Performance

Guide to optimizing Rust applications for maximum performance.

## Zero-Cost Abstractions

### Iterators

```rust
// Iterator chains compile to the same code as hand-written loops
let sum: i32 = (0..1000)
    .filter(|x| x % 2 == 0)
    .map(|x| x * 2)
    .sum();

// Equivalent to:
let mut sum = 0;
for x in 0..1000 {
    if x % 2 == 0 {
        sum += x * 2;
    }
}
```

### Generics and Monomorphization

```rust
// Generic function
fn process<T: Display>(item: T) {
    println!("{}", item);
}

// Compiler generates specialized versions:
// fn process_i32(item: i32) { ... }
// fn process_string(item: String) { ... }
// No runtime overhead!
```

## Memory Optimization

### Reduce Allocations

```rust
// ❌ Allocating in loop
for item in items {
    let formatted = format!("Item: {}", item);  // Allocates each time
    process(&formatted);
}

// ✅ Reuse buffer
let mut buffer = String::new();
for item in items {
    buffer.clear();
    write!(&mut buffer, "Item: {}", item).unwrap();
    process(&buffer);
}

// ✅ Pre-allocate collections
let mut vec = Vec::with_capacity(1000);  // Allocate once
for i in 0..1000 {
    vec.push(i);  // No reallocation
}
```

### Use Stack When Possible

```rust
// ❌ Unnecessary heap allocation
let boxed: Box<[i32; 100]> = Box::new([0; 100]);

// ✅ Stack allocation
let array: [i32; 100] = [0; 100];

// ✅ SmallVec for usually-small collections
use smallvec::SmallVec;
let mut vec: SmallVec<[i32; 8]> = SmallVec::new();
// Stack until > 8 elements, then heap
```

### Avoid Unnecessary Clones

```rust
// ❌ Cloning when borrowing works
fn process(data: Vec<String>) {
    for item in data.clone() {  // Unnecessary clone!
        println!("{}", item);
    }
}

// ✅ Borrow instead
fn process(data: &[String]) {
    for item in data {
        println!("{}", item);
    }
}

// ✅ Use Cow for conditional cloning
use std::borrow::Cow;

fn process(input: &str) -> Cow<str> {
    if needs_modification(input) {
        Cow::Owned(modify(input))
    } else {
        Cow::Borrowed(input)
    }
}
```

### Data Layout

```rust
// Struct field ordering affects size due to padding
// ❌ Poor layout (24 bytes with padding)
struct Bad {
    a: u8,   // 1 byte + 7 padding
    b: u64,  // 8 bytes
    c: u8,   // 1 byte + 7 padding
}

// ✅ Better layout (16 bytes)
struct Good {
    b: u64,  // 8 bytes
    a: u8,   // 1 byte
    c: u8,   // 1 byte + 6 padding
}

// Check size
assert_eq!(std::mem::size_of::<Bad>(), 24);
assert_eq!(std::mem::size_of::<Good>(), 16);
```

## CPU Optimization

### Inlining

```rust
// Suggest inlining for small hot functions
#[inline]
fn small_hot_function(x: i32) -> i32 {
    x * 2
}

// Force inlining
#[inline(always)]
fn critical_path(x: i32) -> i32 {
    x * 2
}

// Prevent inlining (useful for benchmarks)
#[inline(never)]
fn benchmark_target() { }
```

### Branch Prediction

```rust
// ❌ Unpredictable branches in hot loops
for item in items {
    if random_condition() {  // Hard to predict
        expensive_operation();
    }
}

// ✅ Use likely/unlikely hints (nightly)
#![feature(core_intrinsics)]
use std::intrinsics::{likely, unlikely};

if likely(common_case) {
    // Fast path
}

// ✅ Or restructure to avoid branches
// Use lookup tables, SIMD, etc.
```

### SIMD

```rust
// Use portable SIMD (nightly)
#![feature(portable_simd)]
use std::simd::*;

fn sum_simd(data: &[f32]) -> f32 {
    let chunks = data.chunks_exact(4);
    let remainder = chunks.remainder();
    
    let mut sum = f32x4::splat(0.0);
    for chunk in chunks {
        let v = f32x4::from_slice(chunk);
        sum += v;
    }
    
    sum.reduce_sum() + remainder.iter().sum::<f32>()
}
```

## Benchmarking

### Criterion Benchmarks

```rust
// benches/my_benchmark.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 | 1 => n,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| {
        b.iter(|| fibonacci(black_box(20)))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

```bash
# Run benchmarks
cargo bench

# Compare with baseline
cargo bench -- --save-baseline main
# Make changes
cargo bench -- --baseline main
```

### Profiling

```bash
# CPU profiling with perf (Linux)
cargo build --release
perf record -g ./target/release/myapp
perf report

# With flamegraph
cargo install flamegraph
cargo flamegraph

# Memory profiling with heaptrack
heaptrack ./target/release/myapp
heaptrack_gui heaptrack.myapp.*.gz

# Valgrind
valgrind --tool=callgrind ./target/release/myapp
```

## Async Performance

### Avoid Blocking in Async

```rust
// ❌ Blocking in async context
async fn bad() {
    std::thread::sleep(Duration::from_secs(1));  // Blocks!
    std::fs::read_to_string("file.txt");  // Blocks!
}

// ✅ Use async versions
async fn good() {
    tokio::time::sleep(Duration::from_secs(1)).await;
    tokio::fs::read_to_string("file.txt").await;
}

// ✅ Use spawn_blocking for CPU-intensive work
async fn process_cpu_heavy(data: Vec<u8>) -> Result<Vec<u8>> {
    tokio::task::spawn_blocking(move || {
        heavy_computation(&data)
    }).await?
}
```

### Buffer and Batch

```rust
// ❌ Many small async operations
for item in items {
    send(item).await;  // Overhead per item
}

// ✅ Batch operations
use futures::stream::{self, StreamExt};

stream::iter(items)
    .chunks(100)
    .for_each_concurrent(10, |batch| async {
        send_batch(batch).await;
    })
    .await;
```

## Release Build Optimization

### Cargo.toml Settings

```toml
[profile.release]
opt-level = 3        # Maximum optimization
lto = true           # Link-time optimization
codegen-units = 1    # Better optimization, slower compile
panic = "abort"      # Smaller binary, no unwinding
strip = true         # Strip symbols

[profile.release-with-debug]
inherits = "release"
debug = true         # Keep debug info for profiling
```

### Target-Specific Optimization

```bash
# Build for native CPU
RUSTFLAGS="-C target-cpu=native" cargo build --release

# Check available CPU features
rustc --print target-features
```

## Common Optimizations Checklist

```markdown
### Memory
- [ ] Pre-allocate collections when size known
- [ ] Use references instead of cloning
- [ ] Use stack allocation for small data
- [ ] Consider arena allocators for many small allocations
- [ ] Order struct fields by size (largest first)

### CPU
- [ ] Use iterators (zero-cost abstractions)
- [ ] Add #[inline] to small hot functions
- [ ] Avoid unnecessary bounds checks
- [ ] Consider SIMD for data parallelism
- [ ] Minimize branches in hot loops

### Async
- [ ] Don't block in async context
- [ ] Batch I/O operations
- [ ] Use buffered I/O
- [ ] Right-size thread pools

### Build
- [ ] Enable LTO for release builds
- [ ] Use codegen-units = 1 for release
- [ ] Target native CPU when possible
- [ ] Profile before optimizing
```

## Quick Reference Commands

```bash
# Build optimized
cargo build --release

# Run benchmarks
cargo bench

# Profile with flamegraph
cargo flamegraph

# Check binary size
cargo bloat --release

# Analyze compile times
cargo build --timings

# Check optimizations applied
RUSTFLAGS="-C opt-level=3 --emit=asm" cargo build --release
```
