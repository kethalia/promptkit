---
title: "Error Handling"
---
# Error Handling

Guide to Rust's error handling patterns with Result and Option.

## Option Type

### Basic Usage

```rust
// Option<T> = Some(T) | None
fn find_user(id: u64) -> Option<User> {
    users.get(&id).cloned()
}

// Using Option
match find_user(1) {
    Some(user) => println!("Found: {}", user.name),
    None => println!("User not found"),
}

// if let for single case
if let Some(user) = find_user(1) {
    println!("Found: {}", user.name);
}

// let else (Rust 1.65+)
let Some(user) = find_user(1) else {
    return;
};
```

### Option Methods

```rust
let opt: Option<i32> = Some(5);

// Transform value
opt.map(|x| x * 2);           // Some(10)
opt.and_then(|x| Some(x * 2)); // Some(10), for chaining Options

// Provide default
opt.unwrap_or(0);             // 5 or default if None
opt.unwrap_or_else(|| compute_default()); // Lazy default
opt.unwrap_or_default();      // Use Default trait

// Convert to Result
opt.ok_or("error message");   // Result<i32, &str>
opt.ok_or_else(|| Error::new("message")); // Lazy error

// Panic if None (avoid in production!)
opt.unwrap();                 // Panics if None
opt.expect("should have value"); // Panics with message

// Check
opt.is_some();
opt.is_none();

// Take ownership
opt.take();                   // Takes value, leaves None

// Reference operations
opt.as_ref();                 // Option<&T>
opt.as_mut();                 // Option<&mut T>
```

### Combining Options

```rust
let a: Option<i32> = Some(1);
let b: Option<i32> = Some(2);

// Both must be Some
let sum = a.zip(b).map(|(x, y)| x + y);  // Some(3)

// Flatten nested Option
let nested: Option<Option<i32>> = Some(Some(5));
let flat: Option<i32> = nested.flatten();  // Some(5)

// Filter
let opt = Some(5);
opt.filter(|x| x > &3);  // Some(5)
opt.filter(|x| x > &10); // None
```

## Result Type

### Basic Usage

```rust
// Result<T, E> = Ok(T) | Err(E)
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

// Using Result
match divide(10.0, 2.0) {
    Ok(result) => println!("Result: {}", result),
    Err(e) => println!("Error: {}", e),
}

// ? operator for propagation
fn calculate() -> Result<f64, String> {
    let x = divide(10.0, 2.0)?;  // Returns early on Err
    let y = divide(x, 2.0)?;
    Ok(y)
}
```

### Result Methods

```rust
let res: Result<i32, &str> = Ok(5);

// Transform value
res.map(|x| x * 2);           // Ok(10)
res.map_err(|e| format!("Error: {}", e)); // Transform error

// Chain operations
res.and_then(|x| Ok(x * 2));  // For operations that return Result

// Provide default
res.unwrap_or(0);
res.unwrap_or_else(|_| 0);
res.unwrap_or_default();

// Convert to Option
res.ok();                     // Option<i32>, discards error
res.err();                    // Option<&str>, discards value

// Check
res.is_ok();
res.is_err();

// Reference operations
res.as_ref();                 // Result<&T, &E>
res.as_mut();                 // Result<&mut T, &mut E>
```

## Custom Error Types

### Simple Error Enum

```rust
#[derive(Debug)]
pub enum AppError {
    NotFound,
    InvalidInput(String),
    DatabaseError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::NotFound => write!(f, "Resource not found"),
            AppError::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            AppError::DatabaseError(msg) => write!(f, "Database error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}
```

### With thiserror Crate

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Resource not found")]
    NotFound,
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    #[error("Database error: {source}")]
    DatabaseError {
        #[from]
        source: sqlx::Error,
    },
    
    #[error("IO error")]
    IoError(#[from] std::io::Error),
}
```

### With anyhow Crate

```rust
use anyhow::{anyhow, Context, Result};

// Use anyhow::Result for application code
fn process_file(path: &str) -> Result<String> {
    let content = std::fs::read_to_string(path)
        .context("Failed to read file")?;
    
    let parsed: Data = serde_json::from_str(&content)
        .context("Failed to parse JSON")?;
    
    if parsed.items.is_empty() {
        return Err(anyhow!("No items found"));
    }
    
    Ok(parsed.name)
}
```

## Error Propagation

### The ? Operator

```rust
fn read_config(path: &str) -> Result<Config, Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string(path)?;  // Propagates io::Error
    let config: Config = serde_json::from_str(&content)?;  // Propagates serde error
    Ok(config)
}

// ? works with Option in functions returning Option
fn first_even(numbers: &[i32]) -> Option<i32> {
    let first = numbers.first()?;  // Returns None if empty
    if first % 2 == 0 {
        Some(*first)
    } else {
        None
    }
}
```

### Adding Context

```rust
use anyhow::Context;

fn process(path: &str) -> anyhow::Result<()> {
    let data = std::fs::read_to_string(path)
        .with_context(|| format!("Failed to read {}", path))?;
    
    Ok(())
}

// Or with thiserror, map the error
fn process(path: &str) -> Result<(), AppError> {
    let data = std::fs::read_to_string(path)
        .map_err(|e| AppError::IoError { 
            path: path.to_string(), 
            source: e 
        })?;
    
    Ok(())
}
```

## Patterns

### Try Block (Nightly)

```rust
#![feature(try_blocks)]

fn process() -> Result<(), Error> {
    let result: Result<i32, Error> = try {
        let x = operation1()?;
        let y = operation2()?;
        x + y
    };
    
    match result {
        Ok(v) => println!("Result: {}", v),
        Err(e) => println!("Error: {}", e),
    }
    
    Ok(())
}
```

### Collecting Results

```rust
// Collect into Result<Vec<T>, E>
let results: Result<Vec<i32>, ParseIntError> = 
    ["1", "2", "3"]
        .iter()
        .map(|s| s.parse::<i32>())
        .collect();

// First error short-circuits
let results: Result<Vec<i32>, ParseIntError> = 
    ["1", "bad", "3"]
        .iter()
        .map(|s| s.parse::<i32>())
        .collect();  // Err(ParseIntError)
```

### Partition Results

```rust
let strings = vec!["1", "two", "3", "four"];

let (successes, failures): (Vec<_>, Vec<_>) = strings
    .iter()
    .map(|s| s.parse::<i32>())
    .partition(Result::is_ok);

let numbers: Vec<i32> = successes.into_iter().map(Result::unwrap).collect();
let errors: Vec<_> = failures.into_iter().map(Result::unwrap_err).collect();
```

### Early Return Patterns

```rust
// Pattern: validate then proceed
fn process(input: &str) -> Result<Output, Error> {
    // Validate early
    if input.is_empty() {
        return Err(Error::EmptyInput);
    }
    
    let parsed = parse(input)?;
    
    // Guard clause
    let Some(value) = parsed.get("key") else {
        return Err(Error::MissingKey);
    };
    
    Ok(transform(value))
}
```

## Best Practices

### When to Use Each

| Situation | Use | Example |
|-----------|-----|---------|
| Value may not exist | `Option<T>` | `HashMap::get` |
| Operation may fail | `Result<T, E>` | File I/O |
| Unrecoverable error | `panic!` | Index out of bounds |
| Application errors | `anyhow::Result` | CLI tools |
| Library errors | Custom `Error` enum | Libraries |

### Error Handling Checklist

```markdown
- [ ] No `unwrap()` in production code paths
- [ ] Errors have meaningful context
- [ ] Custom errors implement `Error` trait
- [ ] Errors are documented
- [ ] `?` used for propagation
- [ ] Appropriate error granularity
```

### Avoid

```rust
// ❌ Avoid unwrap in error paths
let value = risky_operation().unwrap();

// ❌ Avoid discarding errors silently
let _ = might_fail();

// ❌ Avoid panic for recoverable errors
if input.is_empty() {
    panic!("Empty input!");  // Use Result instead
}

// ❌ Avoid stringly-typed errors in libraries
fn process() -> Result<(), String> { }  // Use proper error type
```
