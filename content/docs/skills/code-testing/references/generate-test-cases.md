---
title: "Generate Test Cases"
---
# Generate Test Cases

Systematic approach to designing comprehensive test scenarios.

## Purpose

Before writing tests, identify WHAT to test. This workflow helps:
- Ensure complete coverage of behaviors
- Discover edge cases you might miss
- Create a test plan before implementation
- Document expected behavior

## Test Case Generation Process

### Step 1: Identify Inputs

For each function/component, list all inputs:

```
Input Categories:
├── Parameters (direct inputs)
├── State (object/class state)
├── Environment (config, env vars)
├── Dependencies (injected services)
└── User Input (forms, events)
```

### Step 2: Classify Input Domains

For each input, identify its domain:

| Input Type | Domain Examples |
|------------|-----------------|
| String | Empty, whitespace, special chars, unicode, very long |
| Number | Zero, negative, positive, decimals, MAX_INT, NaN |
| Array | Empty, single item, many items, duplicates, null items |
| Object | Empty, missing fields, extra fields, nested |
| Boolean | true, false |
| Date | Past, present, future, invalid, edge of range |
| Enum | Each value, invalid value |

### Step 3: Apply Test Case Techniques

#### Equivalence Partitioning

Divide inputs into classes where behavior should be the same:

```
Age Validation Example:
├── Invalid (negative): -1, -100
├── Minor (0-17): 0, 10, 17
├── Adult (18-64): 18, 30, 64
├── Senior (65+): 65, 80, 100
└── Invalid (too high): 150, MAX_INT
```

Test ONE value from each partition.

#### Boundary Value Analysis

Test at the edges of partitions:

```
For range [18, 65]:
├── Below boundary: 17
├── At lower boundary: 18
├── Just above lower: 19
├── Normal middle: 40
├── Just below upper: 64
├── At upper boundary: 65
└── Above boundary: 66
```

#### Decision Table Testing

For complex logic with multiple conditions:

```
| Condition 1 | Condition 2 | Condition 3 | Expected Result |
|-------------|-------------|-------------|-----------------|
| T           | T           | T           | Action A        |
| T           | T           | F           | Action B        |
| T           | F           | T           | Action C        |
| T           | F           | F           | Action D        |
| F           | T           | T           | Action E        |
| F           | T           | F           | Action F        |
| F           | F           | T           | Action G        |
| F           | F           | F           | Action H        |
```

#### State Transition Testing

For stateful components:

```
Order States:
[Created] --pay--> [Paid] --ship--> [Shipped] --deliver--> [Delivered]
    |                 |                  |
    +--cancel-->  [Cancelled]  <--cancel-+

Test Cases:
- Valid transitions (happy path)
- Invalid transitions (cancel delivered order)
- Repeated transitions (pay twice)
```

## Test Case Categories

### Functional Test Cases

```markdown
## Happy Path Tests
1. [Normal usage scenario 1]
2. [Normal usage scenario 2]

## Input Validation Tests
1. [Invalid input type]
2. [Missing required field]
3. [Value out of range]

## Edge Cases
1. [Empty input]
2. [Maximum size input]
3. [Boundary values]

## Error Handling Tests
1. [Network failure]
2. [Database error]
3. [Timeout scenario]

## Integration Points
1. [External API success]
2. [External API failure]
3. [Cache hit/miss]
```

### Non-Functional Test Cases

```markdown
## Performance Tests
1. [Response time under load]
2. [Memory usage with large data]
3. [Concurrent user handling]

## Security Tests
1. [SQL injection attempt]
2. [XSS attempt]
3. [Unauthorized access]

## Usability Tests
1. [Error message clarity]
2. [Accessibility compliance]
```

## Test Case Template

Use this template for documenting test cases:

```markdown
### TC-[ID]: [Title]

**Description:** [What is being tested]

**Preconditions:**
- [Required setup/state]

**Test Data:**
- Input: [specific values]
- Expected: [expected output]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:** [What should happen]

**Priority:** [High/Medium/Low]

**Category:** [Happy Path/Edge Case/Error/etc.]
```

## Worked Example

### Function Under Test

```javascript
function validatePassword(password) {
  // Returns { valid: boolean, errors: string[] }
  // Rules:
  // - Minimum 8 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
}
```

### Generated Test Cases

```markdown
## Password Validation Test Cases

### Happy Path
| ID | Input | Expected | Description |
|----|-------|----------|-------------|
| HP-1 | "Password1!" | valid: true | All criteria met |
| HP-2 | "MyP@ssw0rd" | valid: true | Complex valid password |

### Length Validation
| ID | Input | Expected | Description |
|----|-------|----------|-------------|
| LEN-1 | "" | valid: false, errors: [length] | Empty string |
| LEN-2 | "Aa1!" | valid: false, errors: [length] | Too short (4 chars) |
| LEN-3 | "Aa1!aaa" | valid: false, errors: [length] | Just under (7 chars) |
| LEN-4 | "Aa1!aaaa" | valid: true | Exactly 8 chars |
| LEN-5 | "Aa1!" + "a".repeat(100) | valid: true | Very long |

### Character Requirements
| ID | Input | Expected | Description |
|----|-------|----------|-------------|
| CHAR-1 | "password1!" | errors: [uppercase] | Missing uppercase |
| CHAR-2 | "PASSWORD1!" | errors: [lowercase] | Missing lowercase |
| CHAR-3 | "Password!!" | errors: [number] | Missing number |
| CHAR-4 | "Password11" | errors: [special] | Missing special char |
| CHAR-5 | "password" | errors: [uppercase, number, special] | Multiple missing |

### Edge Cases
| ID | Input | Expected | Description |
|----|-------|----------|-------------|
| EDGE-1 | null | error thrown | Null input |
| EDGE-2 | undefined | error thrown | Undefined input |
| EDGE-3 | 12345678 | error thrown | Non-string input |
| EDGE-4 | "Pässwörd1!" | valid: true | Unicode characters |
| EDGE-5 | "   Pass1!  " | ? | Whitespace handling |

### Special Characters
| ID | Input | Expected | Description |
|----|-------|----------|-------------|
| SPEC-1 | "Password1@" | valid: true | @ symbol |
| SPEC-2 | "Password1#" | valid: true | # symbol |
| SPEC-3 | "Password1 " | ? | Space as special char? |
```

## Output Format

When generating test cases, provide:

```markdown
## Test Cases for [Component/Function Name]

### Summary
- Total test cases: X
- Happy path: X
- Edge cases: X
- Error cases: X
- Priority distribution: X high, X medium, X low

### Test Case Matrix

[Table of all test cases]

### Coverage Analysis
- Input combinations covered: X%
- Boundary values tested: [list]
- Error scenarios: [list]

### Recommendations
- [Additional scenarios to consider]
- [Integration points to test]
- [Performance considerations]
```

## Tips for Comprehensive Coverage

1. **Think like a user** - What would they actually do?
2. **Think like an attacker** - What could go wrong?
3. **Think about time** - What about timeouts, delays, ordering?
4. **Think about state** - What if called twice? In wrong order?
5. **Think about scale** - What about 1 item? 1 million items?
6. **Think about failures** - What if dependencies fail?
