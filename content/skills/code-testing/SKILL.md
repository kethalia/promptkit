---
name: code-testing
description: Comprehensive testing workflows for AI coding assistants. Use when writing unit tests, generating test cases, improving test coverage, or reviewing test quality. Triggers include "write tests", "add unit tests", "test this function", "improve coverage", "generate test cases", "review my tests", or when user shares code that needs testing. Covers unit test generation, test case design, coverage improvement, and test quality assessment.
---

# Code Testing Skill

Structured workflows for comprehensive software testing. This skill covers four main scenarios:
1. **Write Unit Tests** - Generate tests for existing code
2. **Generate Test Cases** - Design test scenarios systematically
3. **Improve Test Coverage** - Identify and fill coverage gaps
4. **Review Test Quality** - Assess and improve existing tests

## Quick Reference

| Scenario | Trigger | Reference |
|----------|---------|-----------|
| Write Unit Tests | "write tests for", "add unit tests" | See [write-unit-tests.md](references/write-unit-tests.md) |
| Generate Test Cases | "what should I test", "test scenarios" | See [generate-test-cases.md](references/generate-test-cases.md) |
| Improve Coverage | "improve coverage", "missing tests" | See [improve-coverage.md](references/improve-coverage.md) |
| Review Test Quality | "review my tests", "are these tests good" | See [review-test-quality.md](references/review-test-quality.md) |

## Core Testing Principles

### The Testing Pyramid

```
        /\
       /  \      E2E Tests (Few)
      /----\     - Full system integration
     /      \    - Slow, expensive
    /--------\   Integration Tests (Some)
   /          \  - Component interaction
  /------------\ - Medium speed
 /              \ Unit Tests (Many)
/________________\ - Fast, isolated, focused
```

### What Makes a Good Test

**F.I.R.S.T. Principles:**
- **Fast** - Tests should run quickly
- **Independent** - No dependencies between tests
- **Repeatable** - Same result every time
- **Self-validating** - Pass/fail without manual inspection
- **Timely** - Written close to the code

### Test Structure (AAA Pattern)

```
// Arrange - Set up test data and conditions
// Act - Execute the code under test
// Assert - Verify the results
```

## Test Naming Conventions

Use descriptive names that explain:
1. What is being tested
2. Under what conditions
3. What the expected outcome is

**Patterns:**
```
test_[method]_[scenario]_[expected]
should_[expected]_when_[condition]
[method]_given[condition]_returns[expected]
```

**Examples:**
```
test_calculateTotal_withEmptyCart_returnsZero
should_throwError_when_inputIsNull
divide_givenDivisorIsZero_throwsException
```

## Coverage Targets

| Coverage Type | Target | Description |
|--------------|--------|-------------|
| Line Coverage | 80%+ | Lines of code executed |
| Branch Coverage | 75%+ | Decision paths taken |
| Function Coverage | 90%+ | Functions called |
| Critical Path | 100% | Business-critical logic |

## Framework Quick Reference

### JavaScript/TypeScript
```javascript
// Jest
describe('Calculator', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});

// Vitest (same API as Jest)
import { describe, it, expect } from 'vitest';
```

### Python
```python
# pytest
def test_add_two_numbers():
    assert add(2, 3) == 5

# unittest
class TestCalculator(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
```

### Go
```go
func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}
```

### Rust
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

## Common Testing Patterns

### Mocking Dependencies
```javascript
// Mock external service
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
}));
```

### Testing Async Code
```javascript
// Async/await
it('fetches user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Test');
});
```

### Parameterized Tests
```python
@pytest.mark.parametrize("input,expected", [
    (2, 4),
    (3, 9),
    (4, 16),
])
def test_square(input, expected):
    assert square(input) == expected
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Testing implementation | Brittle tests | Test behavior, not internals |
| Too many mocks | Tests don't reflect reality | Mock only external dependencies |
| No assertions | Tests always pass | Every test needs assertions |
| Flaky tests | Random failures | Fix timing issues, use deterministic data |
| Slow tests | Developers skip them | Isolate, mock I/O, parallelize |
| Test interdependence | Order-dependent failures | Each test sets up own state |

## Integration Tips

### Running Tests
```bash
# JavaScript
npm test
npm test -- --coverage

# Python
pytest
pytest --cov=myproject

# Go
go test ./...
go test -cover ./...

# Rust
cargo test
```

### CI/CD Integration
- Run tests on every PR
- Fail builds on test failures
- Track coverage over time
- Set coverage thresholds
