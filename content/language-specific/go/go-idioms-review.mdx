# Go Idioms Review

Review code for idiomatic Go patterns following Effective Go guidelines.

---

## Context

Gather the following before starting the review:

1. List all `.go` files in the target package/directory
2. Read the project's `go.mod` to understand module structure
3. Identify any existing linting configurations (`.golangci.yml`)
4. Note the Go version being used

## Instructions

1. **Check Go naming conventions**
   - Verify MixedCaps (not snake_case) for all identifiers
   - Check acronyms are consistently cased (`HTTPServer` not `HttpServer`, `xmlParser` not `XMLParser` for unexported)
   - Ensure package names are lowercase, single-word, no underscores
   - Verify receiver names are short (1-2 letters) and consistent across methods
   - Confirm interface names use -er suffix when appropriate (Reader, Writer, Stringer)

2. **Review error handling patterns**
   - Verify errors are returned as the last return value
   - Check for `if err != nil` immediately after calls that return errors
   - Confirm error messages are lowercase without punctuation
   - Look for proper error wrapping with `fmt.Errorf("context: %w", err)`
   - Verify errors are not logged and then returned (double logging)

3. **Validate interface usage**
   - Confirm interfaces are defined where they're used, not where implemented
   - Check for "accept interfaces, return structs" pattern
   - Identify overly broad interfaces (should be small, 1-3 methods)
   - Look for unnecessary `interface{}`/`any` usage
   - Find opportunities to use standard library interfaces (io.Reader, io.Writer, etc.)

4. **Check proper use of defer**
   - Verify defer is used for cleanup (Close, Unlock, etc.)
   - Check defer placement immediately after resource acquisition
   - Identify defer in loops (potential resource exhaustion)
   - Review defer with closures capturing loop variables
   - Check for deferred calls with ignored errors (`defer f.Close()` vs proper handling)

5. **Review package organization**
   - Check for circular dependencies
   - Verify internal packages are used appropriately
   - Look for packages that are too large or have mixed responsibilities
   - Flag utility/common/misc packages (too generic)
   - Confirm exported vs unexported identifiers are intentional

6. **Identify non-idiomatic patterns with Go alternatives**
   - Flag getter methods named `GetX` (should be just `X`)
   - Check for unnecessary else after return (use early returns)
   - Look for `init()` functions that could be explicit initialization
   - Identify Java/Python-style code (factory classes, excessive abstraction)
   - Flag unnecessary pointer receivers where value receivers suffice
   - Check for slice/map initialization that doesn't use zero values

7. **Reference Effective Go guidelines**
   - Cite specific sections for each issue found
   - Link to relevant Go blog posts or wiki pages
   - Provide before/after code examples

## Output Format

```markdown
## Go Idioms Review: [package/file name]

### Summary
- **Idiomatic Score**: [1-5, where 5 is fully idiomatic]
- **Critical Issues**: [count]
- **Suggestions**: [count]

### Naming Conventions
| Location | Current | Suggested | Reason |
|----------|---------|-----------|--------|
| file:line | `HttpClient` | `HTTPClient` | Acronym casing (Effective Go: MixedCaps) |

### Error Handling
- [ ] **[file:line]**: [issue description]
  - Current: `[code snippet]`
  - Idiomatic: `[suggested code]`
  - Reference: [Effective Go section]

### Interface Design
| Location | Interface | Issue | Recommendation |
|----------|-----------|-------|----------------|
| file:line | `DataStore` | Defined at implementation | Move to consumer package |

### Defer Usage
| Location | Issue | Risk | Fix |
|----------|-------|------|-----|
| file:line | defer in loop | Resource leak | Move to separate function |

### Package Organization
- **Issue**: [description]
- **Location**: [package path]
- **Recommendation**: [suggested structure]

### Non-Idiomatic Patterns
| Pattern | Location | Go Alternative | Reference |
|---------|----------|----------------|-----------|
| GetUser() | user.go:45 | User() | Effective Go: Getters |
| else after return | handler.go:23 | Early return | Effective Go: If |

### Effective Go References
- [Section Name]: [URL] - applies to [issues]
```

## Interactive Decisions

Pause and ask the user when encountering:

1. **Interface location ambiguity**: "Interface `X` is defined in package A but only used in package B. Should I recommend moving it?"

2. **Naming trade-offs**: "Name `X` follows convention but reduces clarity. Prefer convention or clarity?"

3. **Package splitting**: "Package `X` has [N] files and [M] responsibilities. Should I recommend splitting into sub-packages?"

4. **Breaking changes**: "Making `[identifier]` unexported would be more idiomatic but may break external consumers. Should I include this suggestion?"

5. **Init function usage**: "Found `init()` for [purpose]. Should this be explicit initialization instead?"
