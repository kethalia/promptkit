---
title: "Improve Test Coverage"
---
# Improve Test Coverage

Workflow for identifying and filling gaps in test coverage.

## Coverage Types

### Understanding Coverage Metrics

| Metric | What It Measures | Target |
|--------|------------------|--------|
| **Line Coverage** | % of lines executed | 80%+ |
| **Branch Coverage** | % of decision paths taken | 75%+ |
| **Function Coverage** | % of functions called | 90%+ |
| **Statement Coverage** | % of statements executed | 80%+ |
| **Condition Coverage** | % of boolean sub-expressions | 75%+ |

### Coverage Limitations

High coverage ≠ Good tests. Coverage tells you what code ran, not:
- If assertions were meaningful
- If edge cases were tested
- If the right behavior was verified

## Step 1: Generate Coverage Report

### JavaScript/TypeScript

```bash
# Jest
npm test -- --coverage

# Vitest
npx vitest --coverage

# NYC/Istanbul
npx nyc npm test
```

**Output:** `coverage/lcov-report/index.html`

### Python

```bash
# pytest-cov
pytest --cov=myproject --cov-report=html

# coverage.py
coverage run -m pytest
coverage html
```

**Output:** `htmlcov/index.html`

### Go

```bash
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

### Rust

```bash
cargo tarpaulin --out Html
```

## Step 2: Analyze Coverage Gaps

### Reading Coverage Reports

```
File: user-service.js
Coverage: 67% (Target: 80%)

Lines:
  ✓ 1-20   (covered)
  ✗ 21-25  (NOT covered) ← Error handling block
  ✓ 26-40  (covered)
  ✗ 41-45  (NOT covered) ← Edge case branch
  ✓ 46-60  (covered)
```

### Common Gap Patterns

| Gap Type | Example | Priority |
|----------|---------|----------|
| Error handlers | catch blocks, error callbacks | High |
| Edge case branches | `if (items.length === 0)` | High |
| Validation failures | input validation rejections | Medium |
| Fallback code | default cases, else branches | Medium |
| Logging/debug code | console.log, debug statements | Low |

## Step 3: Prioritize Coverage Gaps

### High Priority (Must Cover)
- Business logic branches
- Error handling for user-facing features
- Security-related code paths
- Data validation logic

### Medium Priority (Should Cover)
- Configuration handling
- Fallback behaviors
- Edge cases in utilities

### Low Priority (Nice to Have)
- Logging statements
- Debug code
- Rarely executed paths

### Coverage Priority Matrix

```
                    High Risk
                        │
    ┌───────────────────┼───────────────────┐
    │   MUST COVER      │   SHOULD COVER    │
    │   - Auth logic    │   - API error     │
    │   - Payment       │     handling      │
    │   - Data writes   │   - Validation    │
High├───────────────────┼───────────────────┤Low
Freq│   SHOULD COVER    │   OPTIONAL        │
    │   - Common flows  │   - Debug code    │
    │   - UI rendering  │   - Logging       │
    │                   │   - Rare paths    │
    └───────────────────┼───────────────────┘
                        │
                    Low Risk
```

## Step 4: Write Missing Tests

### For Uncovered Branches

Identify the condition that leads to the uncovered branch:

```javascript
// Uncovered: line 23-25
function processOrder(order) {
  if (!order.items || order.items.length === 0) {  // line 22
    throw new Error('Order must have items');       // line 23-25 NOT COVERED
  }
  // ... rest of function
}

// Add test:
it('should throw error for empty order', () => {
  expect(() => processOrder({ items: [] }))
    .toThrow('Order must have items');
});
```

### For Uncovered Error Handlers

```javascript
// Uncovered: catch block
async function fetchUser(id) {
  try {
    return await api.getUser(id);
  } catch (error) {           // NOT COVERED
    logger.error(error);
    throw new UserFetchError(id);
  }
}

// Add test:
it('should throw UserFetchError when API fails', async () => {
  api.getUser.mockRejectedValue(new Error('Network error'));
  
  await expect(fetchUser('123'))
    .rejects.toThrow(UserFetchError);
});
```

### For Uncovered Switch Cases

```javascript
// Uncovered: default case
function getStatusColor(status) {
  switch (status) {
    case 'success': return 'green';
    case 'warning': return 'yellow';
    case 'error': return 'red';
    default: return 'gray';  // NOT COVERED
  }
}

// Add test:
it('should return gray for unknown status', () => {
  expect(getStatusColor('unknown')).toBe('gray');
});
```

## Step 5: Coverage Improvement Strategies

### Strategy 1: Branch-by-Branch

1. Find file with lowest branch coverage
2. Identify each uncovered branch
3. Write test for each branch
4. Repeat

### Strategy 2: Risk-Based

1. List business-critical functions
2. Check coverage for each
3. Prioritize gaps by business impact
4. Fill gaps systematically

### Strategy 3: Change-Based

1. Identify recently changed code
2. Ensure new code has tests
3. Use coverage diff in CI

```bash
# Coverage diff in CI
npm test -- --coverage --changedSince=main
```

## Coverage Configuration

### Jest

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/critical/': {
      branches: 90,
      functions: 95,
      lines: 95,
    },
  },
};
```

### pytest

```ini
# pytest.ini
[pytest]
addopts = --cov=myproject --cov-fail-under=80

# .coveragerc
[run]
omit =
    */tests/*
    */migrations/*

[report]
fail_under = 80
```

## Coverage Report Template

```markdown
## Coverage Improvement Report

### Current State
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Lines | 72% | 80% | -8% |
| Branches | 65% | 75% | -10% |
| Functions | 85% | 90% | -5% |

### Files Needing Attention

| File | Coverage | Priority | Gap Type |
|------|----------|----------|----------|
| user-service.js | 55% | High | Error handling |
| payment.js | 60% | High | Edge cases |
| utils.js | 70% | Medium | Branches |

### Recommended Tests to Add

1. **user-service.js:23-25** - Test error when user not found
2. **payment.js:45-50** - Test refund edge case
3. **utils.js:12** - Test empty input handling

### Tests Added
- [ ] Test 1
- [ ] Test 2
- [ ] Test 3

### New Coverage (after improvements)
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lines | 72% | __% | +__% |
```

## CI Integration

### Fail on Coverage Drop

```yaml
# GitHub Actions
- name: Test with coverage
  run: npm test -- --coverage
  
- name: Check coverage threshold
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 80% threshold"
      exit 1
    fi
```

### Coverage Badge

```markdown
![Coverage](https://img.shields.io/codecov/c/github/username/repo)
```

## Anti-Patterns

### Don't Do This

```javascript
// ❌ Test just to increase coverage
it('covers the function', () => {
  myFunction(); // No assertion!
});

// ❌ Ignore meaningful coverage
/* istanbul ignore next */
if (criticalCondition) {
  // This SHOULD be tested
}
```

### Do This Instead

```javascript
// ✅ Meaningful test with assertion
it('handles the error case correctly', () => {
  const result = myFunction(invalidInput);
  expect(result.error).toBe('Invalid input');
});
```
