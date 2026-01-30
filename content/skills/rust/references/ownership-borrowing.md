# Ownership & Borrowing

Guide to Rust's ownership system and memory safety patterns.

## Ownership Rules

### The Three Rules

1. **Each value has exactly one owner**
2. **When the owner goes out of scope, the value is dropped**
3. **Ownership can be transferred (moved)**

```rust
// Rule 1: One owner
let s1 = String::from("hello");

// Rule 2: Dropped when out of scope
{
    let s2 = String::from("world");
} // s2 is dropped here

// Rule 3: Move
let s3 = s1;  // Ownership moved to s3
// println!("{}", s1);  // Error: s1 no longer valid
```

### Copy vs Move

```rust
// Copy types - bitwise copy, original still valid
let x = 5;
let y = x;  // x is still valid
println!("{}, {}", x, y);  // Works!

// Move types - ownership transferred
let s1 = String::from("hello");
let s2 = s1;  // s1 is now invalid
// println!("{}", s1);  // Error!

// Types that implement Copy:
// - All integer types (i32, u64, etc.)
// - bool
// - char
// - Floating point types (f32, f64)
// - Tuples containing only Copy types
// - Arrays of Copy types
// - References (&T)
```

## Borrowing

### Immutable Borrowing (&T)

```rust
fn main() {
    let s = String::from("hello");
    
    // Borrow immutably - s is still valid
    let len = calculate_length(&s);
    
    println!("Length of '{}' is {}", s, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### Mutable Borrowing (&mut T)

```rust
fn main() {
    let mut s = String::from("hello");
    
    change(&mut s);
    
    println!("{}", s);  // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

### Borrowing Rules

```rust
// Rule 1: Any number of immutable borrows
let s = String::from("hello");
let r1 = &s;
let r2 = &s;
let r3 = &s;  // All OK!

// Rule 2: OR exactly one mutable borrow
let mut s = String::from("hello");
let r1 = &mut s;
// let r2 = &mut s;  // Error: second mutable borrow

// Rule 3: Cannot mix mutable and immutable
let mut s = String::from("hello");
let r1 = &s;     // immutable borrow
// let r2 = &mut s;  // Error: can't borrow as mutable
```

### Non-Lexical Lifetimes (NLL)

```rust
// Borrows end at last use, not end of scope
let mut s = String::from("hello");

let r1 = &s;
let r2 = &s;
println!("{} and {}", r1, r2);
// r1 and r2 no longer used after this point

let r3 = &mut s;  // OK! Previous borrows have ended
println!("{}", r3);
```

## Lifetimes

### Basic Lifetime Annotation

```rust
// Explicit lifetime: 'a
// The returned reference is valid as long as both inputs are valid
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

### Lifetime Elision Rules

```rust
// Rule 1: Each input reference gets its own lifetime
fn foo(x: &str) -> ...
// becomes: fn foo<'a>(x: &'a str) -> ...

// Rule 2: If exactly one input lifetime, it's assigned to all outputs
fn foo(x: &str) -> &str
// becomes: fn foo<'a>(x: &'a str) -> &'a str

// Rule 3: If &self or &mut self, self's lifetime is assigned to outputs
impl Foo {
    fn method(&self, x: &str) -> &str
    // becomes: fn method<'a, 'b>(&'a self, x: &'b str) -> &'a str
}
```

### Struct Lifetimes

```rust
// Struct containing references needs lifetime annotation
struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    
    fn announce(&self, announcement: &str) -> &str {
        println!("Attention: {}", announcement);
        self.part
    }
}
```

### Static Lifetime

```rust
// 'static - lives for entire program
let s: &'static str = "I live forever!";

// String literals are 'static
const GREETING: &str = "Hello";  // Implicitly &'static str
```

## Common Patterns

### Returning Owned vs Borrowed

```rust
// Return owned when creating new data
fn create_greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}

// Return reference when borrowing from input
fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}
```

### Interior Mutability

```rust
use std::cell::{Cell, RefCell};
use std::rc::Rc;

// Cell - for Copy types
struct Counter {
    value: Cell<i32>,
}

impl Counter {
    fn increment(&self) {  // &self, not &mut self!
        self.value.set(self.value.get() + 1);
    }
}

// RefCell - for non-Copy types, runtime borrow checking
struct Cache {
    data: RefCell<HashMap<String, String>>,
}

impl Cache {
    fn get(&self, key: &str) -> Option<String> {
        self.data.borrow().get(key).cloned()
    }
    
    fn insert(&self, key: String, value: String) {
        self.data.borrow_mut().insert(key, value);
    }
}
```

### Shared Ownership

```rust
use std::rc::Rc;      // Single-threaded
use std::sync::Arc;    // Thread-safe

// Rc - reference counted, single thread
let data = Rc::new(vec![1, 2, 3]);
let data2 = Rc::clone(&data);  // Increment count, not deep clone

// Arc - atomic reference counted, thread safe
use std::sync::Arc;
let data = Arc::new(vec![1, 2, 3]);
let data2 = Arc::clone(&data);

// Combine with interior mutability
use std::sync::Mutex;
let shared = Arc::new(Mutex::new(vec![1, 2, 3]));
```

### Cow (Clone on Write)

```rust
use std::borrow::Cow;

// Cow delays cloning until mutation is needed
fn process(input: &str) -> Cow<str> {
    if input.contains("bad") {
        // Only clone if we need to modify
        Cow::Owned(input.replace("bad", "good"))
    } else {
        // No allocation needed
        Cow::Borrowed(input)
    }
}
```

## Common Mistakes

### Returning Reference to Local

```rust
// ❌ Error: returns reference to local variable
fn bad() -> &String {
    let s = String::from("hello");
    &s  // s is dropped at end of function!
}

// ✅ Return owned value
fn good() -> String {
    String::from("hello")
}
```

### Holding Borrow Across Await

```rust
// ❌ Problem: borrow held across await point
async fn bad(data: &mut Data) {
    let item = &data.items[0];  // Borrow starts
    some_async_operation().await;  // Await while borrowed
    println!("{}", item);  // Borrow still held
}

// ✅ Clone or restructure
async fn good(data: &mut Data) {
    let item = data.items[0].clone();  // Clone instead
    some_async_operation().await;
    println!("{}", item);
}
```

### Self-Referential Structs

```rust
// ❌ Cannot create self-referential structs directly
struct Bad {
    data: String,
    slice: &str,  // Can't reference data!
}

// ✅ Use indices or Pin
struct Good {
    data: String,
    start: usize,
    end: usize,
}

impl Good {
    fn slice(&self) -> &str {
        &self.data[self.start..self.end]
    }
}
```

## Quick Reference

| Concept | Syntax | Notes |
|---------|--------|-------|
| Immutable borrow | `&T` | Many allowed |
| Mutable borrow | `&mut T` | Only one allowed |
| Lifetime annotation | `'a` | Named lifetime |
| Static lifetime | `'static` | Lives forever |
| Reference counting | `Rc<T>` | Single-threaded |
| Atomic ref counting | `Arc<T>` | Thread-safe |
| Interior mutability | `Cell<T>`, `RefCell<T>` | Mutate through `&self` |
| Clone on write | `Cow<T>` | Delay cloning |
