# Ownership and Borrowing Review

Review Rust code for ownership patterns, borrowing correctness, and idiomatic memory management.

---

## Context

Gather before starting:
- All Rust source files in the project (`src/**/*.rs`)
- Any modules with complex lifetime annotations
- Code using smart pointers (Box, Rc, Arc, RefCell, Mutex)
- Functions with multiple reference parameters
- Areas where `.clone()` is frequently used

## Instructions

1. **Identify unnecessary clones**
   - Search for `.clone()` calls throughout the codebase
   - For each clone, determine if ownership transfer or borrowing would suffice
   - Flag clones inside loops or hot paths as high priority
   - Check for clones that immediately follow a borrow

2. **Review lifetime annotations for correctness**
   - Locate all explicit lifetime annotations (`'a`, `'static`, etc.)
   - Verify each annotation is necessary (not inferrable by the compiler)
   - Check for overly restrictive lifetimes that could be relaxed
   - Identify functions where lifetime elision could apply
   - Validate that lifetime relationships accurately reflect data flow

3. **Check borrow checker workarounds for better patterns**
   - Find patterns like `RefCell` used to circumvent borrowing rules
   - Identify interior mutability patterns and validate their necessity
   - Look for `Rc<RefCell<T>>` or `Arc<Mutex<T>>` that could be simplified
   - Check for early drops or scope manipulation to satisfy the borrow checker
   - Review any use of `unsafe` to work around borrowing restrictions

4. **Validate reference usage (& vs &mut)**
   - Check each `&mut` for whether shared reference `&` would suffice
   - Identify functions taking ownership when borrowing would work
   - Review function signatures for appropriate reference types
   - Look for patterns where references could replace owned values in structs

5. **Review smart pointer usage (Box, Rc, Arc, RefCell)**
   - `Box<T>`: Verify heap allocation is necessary
   - `Rc<T>`: Confirm shared ownership is required; check for cycles
   - `Arc<T>`: Validate cross-thread sharing necessity
   - `RefCell<T>`: Ensure runtime borrow checking is justified
   - `Cow<T>`: Check for opportunities to use copy-on-write

6. **Identify ownership patterns that could be simplified**
   - Identify complex ownership chains that could be flattened
   - Look for builder patterns that could use borrowing
   - Find structs holding owned data that could hold references
   - Check for unnecessary indirection layers

7. **Suggest more idiomatic alternatives**
   - Replace manual memory management with RAII patterns
   - Suggest iterator methods over explicit loops with ownership transfer
   - Recommend `Into`/`AsRef` traits for flexible APIs
   - Propose `Cow` for conditionally owned data

## Output Format

```markdown
## Ownership Review Summary

### Unnecessary Clones
| Location | Current Code | Suggested Change | Impact |
|----------|--------------|------------------|--------|
| file:line | `.clone()` usage | Alternative | Perf/Clarity |

### Lifetime Annotation Issues
- **[file:line]**: [Issue description]
  - Current: `fn foo<'a>(...)`
  - Suggested: `fn foo(...)`
  - Rationale: [Why the change improves the code]

### Smart Pointer Recommendations
| Type | Location | Issue | Recommendation |
|------|----------|-------|----------------|
| Rc<RefCell<T>> | file:line | [Problem] | [Solution] |

### Borrow Pattern Improvements
1. **[Pattern Name]** at [location]
   - Current approach: [Description]
   - Suggested approach: [Description]
   - Benefits: [List benefits]

### Priority Fixes
1. [High impact change]
2. [Medium impact change]
3. [Low impact change]
```

## Interactive Decisions

Pause for user input on:
- **Clone removal**: When removing a clone might affect semantics in non-obvious ways
- **Lifetime changes**: Before suggesting lifetime annotation changes that affect public API
- **Smart pointer swaps**: When changing `Rc` to references or vice versa affects architecture
- **Interior mutability removal**: When removing `RefCell`/`Mutex` requires structural changes
- **Breaking changes**: Any suggestion that would change public function signatures
