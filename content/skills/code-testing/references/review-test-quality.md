# Review Test Quality

Workflow for assessing and improving the quality of existing tests.

## Why Test Quality Matters

Bad tests are worse than no tests:
- False confidence in broken code
- Maintenance burden
- Slow CI pipelines
- Flaky failures that get ignored

## Test Quality Dimensions

### 1. Correctness
Does the test actually verify the right behavior?

### 2. Completeness
Does the test cover all important scenarios?

### 3. Maintainability
Is the test easy to understand and modify?

### 4. Reliability
Does the test produce consistent results?

### 5. Performance
Does the test run efficiently?

## Quality Assessment Checklist

### ✅ Correctness

- [ ] **Tests the right thing** - Verifies actual requirements, not implementation
- [ ] **Assertions are meaningful** - Not just `expect(result).toBeTruthy()`
- [ ] **Expected values are correct** - Not copy-pasted from buggy output
- [ ] **Setup reflects real conditions** - Mocks match actual behavior

**Red Flags:**
```javascript
// ❌ No assertion
it('processes data', () => {
  processData(input);
});

// ❌ Weak assertion
it('returns something', () => {
  expect(getUser(1)).toBeTruthy();
});

// ❌ Testing implementation, not behavior
it('calls the internal method', () => {
  service.process(data);
  expect(service._internalMethod).toHaveBeenCalled();
});
```

### ✅ Completeness

- [ ] **Happy path covered** - Normal usage works
- [ ] **Error cases covered** - Failures are handled
- [ ] **Edge cases covered** - Boundaries are tested
- [ ] **All branches covered** - Decision paths exercised

**Questions to Ask:**
- What happens with empty input?
- What happens with null/undefined?
- What happens at boundaries?
- What happens when dependencies fail?

### ✅ Maintainability

- [ ] **Clear naming** - Test name explains what it tests
- [ ] **Single responsibility** - One concept per test
- [ ] **DRY setup** - Shared setup in beforeEach
- [ ] **No magic values** - Constants are named or obvious
- [ ] **Minimal mocking** - Only mock what's necessary

**Red Flags:**
```javascript
// ❌ Unclear name
it('works', () => { ... });

// ❌ Tests too many things
it('should create user, send email, and update cache', () => { ... });

// ❌ Magic numbers
expect(result).toBe(42);  // Why 42?

// ❌ Excessive mocking
// 15 mocks for one simple function test
```

### ✅ Reliability

- [ ] **No flakiness** - Passes consistently
- [ ] **No timing dependencies** - Doesn't rely on real time
- [ ] **No order dependencies** - Can run in any order
- [ ] **Isolated** - Doesn't affect other tests
- [ ] **Deterministic** - Same input = same result

**Red Flags:**
```javascript
// ❌ Timing dependent
await sleep(1000);  // Hoping async completes

// ❌ Real time dependency
expect(getTimestamp()).toBe(Date.now());

// ❌ Order dependent
it('test 2', () => {
  expect(globalState).toBe('set by test 1');
});

// ❌ Random without seeding
const input = Math.random();
```

### ✅ Performance

- [ ] **Fast execution** - Unit tests < 100ms each
- [ ] **Minimal I/O** - Mocked external calls
- [ ] **Efficient setup** - No unnecessary initialization
- [ ] **Parallelizable** - Can run concurrently

**Red Flags:**
```javascript
// ❌ Real network calls
const response = await fetch('https://api.example.com');

// ❌ Excessive setup
beforeEach(() => {
  // Seeds entire database for simple unit test
});

// ❌ Slow operations
it('handles large file', () => {
  const data = fs.readFileSync('100mb-file.json');
});
```

## Test Smell Detection

### Smell: Assertion Roulette

Multiple assertions with no clear failure message:

```javascript
// ❌ Bad
it('validates user', () => {
  expect(user.name).toBe('John');
  expect(user.age).toBe(30);
  expect(user.email).toBe('john@example.com');
  expect(user.role).toBe('admin');
  // Which one failed?
});

// ✅ Better - separate tests or clear messages
it('validates user name', () => {
  expect(user.name).toBe('John');
});

// Or use descriptive messages
expect(user.name).toBe('John'); // "Expected name to be John"
```

### Smell: Eager Test

Tests too much in one test:

```javascript
// ❌ Bad
it('user flow', () => {
  const user = createUser(data);
  expect(user.id).toBeDefined();
  
  const updated = updateUser(user.id, newData);
  expect(updated.name).toBe(newData.name);
  
  deleteUser(user.id);
  expect(getUser(user.id)).toBeNull();
});

// ✅ Better - separate tests
describe('User', () => {
  it('can be created', () => { ... });
  it('can be updated', () => { ... });
  it('can be deleted', () => { ... });
});
```

### Smell: Mystery Guest

Test uses external resources not visible in the test:

```javascript
// ❌ Bad - where does testUser come from?
it('processes user', () => {
  const result = processUser(testUser);
  expect(result.processed).toBe(true);
});

// ✅ Better - setup is visible
it('processes user', () => {
  const testUser = { id: 1, name: 'Test', active: true };
  const result = processUser(testUser);
  expect(result.processed).toBe(true);
});
```

### Smell: Test Logic

Complex logic in tests (loops, conditions):

```javascript
// ❌ Bad - logic in test
it('validates all items', () => {
  for (const item of items) {
    if (item.type === 'A') {
      expect(validate(item)).toBe(true);
    } else {
      expect(validate(item)).toBe(false);
    }
  }
});

// ✅ Better - parameterized tests
it.each([
  [{ type: 'A' }, true],
  [{ type: 'B' }, false],
])('validates %o as %s', (item, expected) => {
  expect(validate(item)).toBe(expected);
});
```

### Smell: Sensitive Equality

Brittle assertions on complex objects:

```javascript
// ❌ Bad - breaks if any field changes
expect(user).toEqual({
  id: 1,
  name: 'John',
  email: 'john@test.com',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  // ... 20 more fields
});

// ✅ Better - test what matters
expect(user).toMatchObject({
  id: 1,
  name: 'John',
});
```

## Quality Review Template

```markdown
## Test Quality Review: [Component/File]

### Summary
- Total tests: X
- Quality score: X/10
- Critical issues: X
- Recommendations: X

### Correctness
| Check | Status | Notes |
|-------|--------|-------|
| Meaningful assertions | ✅/❌ | |
| Tests behavior not implementation | ✅/❌ | |
| Expected values verified | ✅/❌ | |

### Completeness  
| Check | Status | Notes |
|-------|--------|-------|
| Happy path | ✅/❌ | |
| Error cases | ✅/❌ | |
| Edge cases | ✅/❌ | |

### Maintainability
| Check | Status | Notes |
|-------|--------|-------|
| Clear naming | ✅/❌ | |
| Single responsibility | ✅/❌ | |
| Minimal mocking | ✅/❌ | |

### Reliability
| Check | Status | Notes |
|-------|--------|-------|
| No flakiness | ✅/❌ | |
| Isolated | ✅/❌ | |
| Deterministic | ✅/❌ | |

### Test Smells Found
1. [Smell and location]
2. [Smell and location]

### Recommendations
1. [Specific improvement]
2. [Specific improvement]

### Priority Fixes
- 🔴 Critical: [Must fix]
- 🟠 Major: [Should fix]
- 🟡 Minor: [Nice to have]
```

## Refactoring Tests

### Before/After Examples

**Improving Assertion Quality:**
```javascript
// Before
it('works', () => {
  const result = calculate(5, 3);
  expect(result).toBeTruthy();
});

// After
it('should add two positive numbers correctly', () => {
  const result = calculate(5, 3);
  expect(result).toBe(8);
});
```

**Improving Test Isolation:**
```javascript
// Before - shared mutable state
let counter = 0;
beforeAll(() => { counter = 0; });

it('increments', () => {
  increment();
  expect(counter).toBe(1);
});

it('increments again', () => {
  increment();
  expect(counter).toBe(2);  // Depends on test 1
});

// After - isolated
describe('counter', () => {
  let counter;
  
  beforeEach(() => {
    counter = createCounter();
  });

  it('increments from zero', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });

  it('increments from zero independently', () => {
    counter.increment();
    expect(counter.value).toBe(1);
  });
});
```

**Improving Readability:**
```javascript
// Before
it('test', () => {
  const u = { n: 'J', a: 30, e: 'j@t.c' };
  const r = v(u);
  expect(r).toBe(true);
});

// After
it('should validate user with all required fields', () => {
  const validUser = {
    name: 'John',
    age: 30,
    email: 'john@test.com'
  };
  
  const isValid = validateUser(validUser);
  
  expect(isValid).toBe(true);
});
```
