# Rust Code Review

Systematic approach to reviewing Rust code for quality and safety.

## Code Review Checklist

### Memory Safety

```rust
// ❌ Potential panic
let value = vec[0];  // Panics if empty

// ✅ Safe access
let value = vec.get(0);  // Returns Option

// ❌ Unwrap in production code
let result = operation().unwrap();

// ✅ Handle errors
let result = operation()?;
// or
let result = operation().map_err(|e| /* convert error */)?;
```

### Ownership Issues

```rust
// ❌ Unnecessary clone
fn process(data: &Vec<String>) {
    let cloned = data.clone();  // Why clone if only reading?
    for item in &cloned {
        println!("{}", item);
    }
}

// ✅ Use reference
fn process(data: &[String]) {
    for item in data {
        println!("{}", item);
    }
}

// ❌ Taking ownership when not needed
fn length(s: String) -> usize {
    s.len()
}

// ✅ Borrow instead
fn length(s: &str) -> usize {
    s.len()
}
```

### API Design

```rust
// ❌ Overly specific parameter types
fn process(items: &Vec<String>) { }
fn read(path: &String) { }

// ✅ Accept broader types
fn process(items: &[String]) { }  // Accepts Vec, arrays, slices
fn read(path: impl AsRef<Path>) { }  // Accepts String, &str, Path, PathBuf

// ❌ Returning references to internal data unnecessarily
fn get_name(&self) -> &String {
    &self.name
}

// ✅ Return slice for strings
fn get_name(&self) -> &str {
    &self.name
}
```

### Error Handling

```rust
// ❌ Using panic for recoverable errors
fn parse_config(path: &str) -> Config {
    let content = std::fs::read_to_string(path)
        .expect("Failed to read config");  // Panic!
    toml::from_str(&content)
        .expect("Invalid config")  // Panic!
}

// ✅ Return Result
fn parse_config(path: &str) -> Result<Config, ConfigError> {
    let content = std::fs::read_to_string(path)
        .map_err(ConfigError::Read)?;
    toml::from_str(&content)
        .map_err(ConfigError::Parse)
}
```

### Thread Safety

```rust
// ❌ Shared mutable state without synchronization
static mut COUNTER: i32 = 0;

// ✅ Use atomic or mutex
use std::sync::atomic::{AtomicI32, Ordering};
static COUNTER: AtomicI32 = AtomicI32::new(0);

// ❌ Data race potential
use std::rc::Rc;  // Not Send!
let shared = Rc::new(data);

// ✅ Use Arc for thread-safe sharing
use std::sync::Arc;
let shared = Arc::new(data);
```

### Resource Management

```rust
// ✅ RAII - resources automatically cleaned up
{
    let file = File::open("test.txt")?;
    // Use file
} // File automatically closed here

// ✅ Explicit cleanup with Drop
impl Drop for Connection {
    fn drop(&mut self) {
        self.close();
    }
}
```

### Unsafe Code

```rust
// Review all unsafe blocks carefully
unsafe {
    // ❌ Dereferencing raw pointer without validation
    let value = *ptr;
    
    // ✅ Validate first
    if !ptr.is_null() {
        let value = *ptr;
    }
}

// Document safety invariants
/// # Safety
/// 
/// - `ptr` must be valid and aligned
/// - `ptr` must point to initialized memory
unsafe fn read_value(ptr: *const i32) -> i32 {
    *ptr
}
```

## Common Issues

### Lifetime Issues

```rust
// ❌ Lifetime too short
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

// This is actually fine! Rust infers lifetimes correctly.
// But watch for this:

// ❌ Returning reference to local
fn bad() -> &str {
    let s = String::from("hello");
    &s  // Error: s dropped at end of function
}

// ✅ Return owned value
fn good() -> String {
    String::from("hello")
}
```

### Iterator Issues

```rust
// ❌ Collecting unnecessarily
let sum: i32 = numbers.iter().collect::<Vec<_>>().iter().sum();

// ✅ Chain iterators
let sum: i32 = numbers.iter().sum();

// ❌ Manual iteration
let mut result = Vec::new();
for item in items {
    if item.is_valid() {
        result.push(item.transform());
    }
}

// ✅ Use iterator combinators
let result: Vec<_> = items
    .into_iter()
    .filter(|item| item.is_valid())
    .map(|item| item.transform())
    .collect();
```

### String Issues

```rust
// ❌ Unnecessary allocation
fn greet(name: &str) -> String {
    let mut s = String::new();
    s.push_str("Hello, ");
    s.push_str(name);
    s
}

// ✅ Use format!
fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

// ❌ Pushing strings inefficiently
let mut s = String::new();
for word in words {
    s = s + &word + " ";  // Creates new String each time!
}

// ✅ Push to existing buffer
let mut s = String::new();
for word in words {
    s.push_str(&word);
    s.push(' ');
}
```

### Clippy Warnings

```bash
# Run clippy
cargo clippy

# Common warnings to address:
# - needless_return
# - redundant_clone
# - useless_vec
# - map_unwrap_or
# - expect_used / unwrap_used
```

## Review Template

```markdown
## Rust Code Review: [Crate/Module]

### Summary
- **Crate:** [name]
- **Lines of Code:** X
- **Unsafe Blocks:** X
- **Clippy Warnings:** X

### Safety Review
- [ ] All unsafe blocks documented and justified
- [ ] No undefined behavior
- [ ] Thread safety verified

### Error Handling
- [ ] No unwrap/expect in error paths
- [ ] Error types are meaningful
- [ ] Errors propagated appropriately

### API Review
- [ ] Public API documented
- [ ] Function signatures use appropriate types
- [ ] Breaking changes noted

### Performance
- [ ] No unnecessary allocations
- [ ] No unnecessary clones
- [ ] Iterators used effectively

### Specific Findings

| Location | Issue | Severity | Fix |
|----------|-------|----------|-----|
| src/lib.rs:42 | unwrap() in error path | High | Use ? operator |

### Recommendations
```rust
// Before
[problematic code]

// After
[improved code]
```
```

## Common Review Findings

| Issue | Frequency | Fix |
|-------|-----------|-----|
| `unwrap()` usage | Very High | Use `?` or match |
| Unnecessary clone | High | Use references |
| Overly specific types | High | Use slices, AsRef |
| Missing error context | Medium | Use `map_err` or `context()` |
| Unsafe without docs | Medium | Add safety comments |
| Missing `#[must_use]` | Low | Add attribute |
