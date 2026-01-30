# Trace Bug

Systematic approach to finding the root cause of bugs and unexpected behavior.

## When to Use This Workflow

Use when:
- Code runs without errors but produces wrong results
- Behavior is unexpected but no exception is thrown
- Something "used to work" and now doesn't
- Intermittent/flaky issues

## Bug Tracing Process

### Step 1: Define the Bug Precisely

**Gather information:**

```markdown
## Bug Report

**Expected behavior:**
[What should happen]

**Actual behavior:**
[What actually happens]

**Steps to reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Frequency:**
[Always / Sometimes / Rarely]

**Environment:**
[OS, browser, versions, config]

**When did it start:**
[Recent change? Always broken?]
```

### Step 2: Reproduce Consistently

**Can't fix what you can't reproduce.**

**Reproduction strategies:**
- Simplify: Remove unrelated code/state
- Isolate: Create minimal reproduction case
- Document: Write exact steps
- Automate: Create a failing test

**If intermittent:**
- Look for race conditions
- Check for external dependencies
- Log timestamps and state
- Increase sample size

### Step 3: Form Hypotheses

Based on symptoms, list possible causes:

```
Bug: Users sometimes see stale data

Hypotheses:
1. Caching issue - old data served from cache
2. Race condition - read before write completes
3. Replication lag - reading from replica
4. State not refreshed - UI doesn't re-render
5. Wrong API endpoint - hitting old version
```

**Prioritize by:**
- Likelihood (based on symptoms)
- Ease of testing
- Recent changes in that area

### Step 4: Test Hypotheses

For each hypothesis:

1. **Predict** what you should see if true
2. **Design** a test to verify
3. **Execute** the test
4. **Conclude** - confirmed, ruled out, or inconclusive

**Example:**
```
Hypothesis: Caching issue

Prediction: Bug disappears with cache disabled

Test: Add cache-busting headers / disable cache

Result: Bug still occurs

Conclusion: Ruled out - not a caching issue
```

### Step 5: Isolate the Problem

**Narrow the scope:**

```
System Level
├── Is it frontend or backend?
├── Is it in our code or a library?
├── Is it data or logic?
└── Is it this service or another?

Code Level
├── Which module/file?
├── Which function?
├── Which line?
└── Which variable/value?
```

**Techniques:**

**Binary Search (Bisecting):**
```bash
# Find which commit introduced the bug
git bisect start
git bisect bad                 # Current is bad
git bisect good v1.0.0         # This version was good
# Git checks out middle commit
# Test and mark as good/bad
git bisect good  # or git bisect bad
# Repeat until found
git bisect reset
```

**Code Bisection:**
```python
def complex_function():
    step1()
    step2()
    print(">>> Checkpoint 1 - state is correct here?")
    step3()
    step4()
    print(">>> Checkpoint 2 - state is correct here?")
    step5()
    step6()
```

**Data Bisection:**
```python
# Bug happens with 1000 items
# Test with 500 - still happens?
# Test with 250 - stops happening?
# Bug is triggered by items 251-500
# Continue narrowing...
```

### Step 6: Find Root Cause

Once isolated, determine WHY:

**Ask "Why?" repeatedly:**
```
Bug: Total is wrong

Why? → sum() returns wrong value
Why? → One item has negative quantity
Why? → Quantity not validated on input
Why? → Validation was removed in refactor
ROOT CAUSE: Missing input validation
```

**Common root cause categories:**

| Category | Examples |
|----------|----------|
| Logic error | Wrong operator, off-by-one, inverted condition |
| State error | Stale state, race condition, not initialized |
| Data error | Bad input, wrong format, encoding issue |
| Integration error | API changed, wrong endpoint, version mismatch |
| Environment error | Config difference, missing dependency |
| Timing error | Race condition, timeout, order dependency |

### Step 7: Verify and Fix

**Before fixing:**
- Write a failing test that reproduces the bug
- Confirm the test fails for the right reason

**Implement fix:**
- Fix the root cause, not just symptoms
- Consider edge cases
- Check for similar issues elsewhere

**After fixing:**
- Verify the test passes
- Run full test suite
- Test in environment where bug occurred
- Monitor after deployment

## Debugging Techniques

### Strategic Logging

Add logs at key points:

```python
def process_order(order):
    logger.debug(f">>> process_order called with {order.id}")
    logger.debug(f"    order.items = {order.items}")
    
    total = calculate_total(order.items)
    logger.debug(f"    calculated total = {total}")
    
    if total > order.limit:
        logger.debug(f"    total {total} exceeds limit {order.limit}")
        return None
    
    result = submit_order(order, total)
    logger.debug(f"<<< process_order returning {result}")
    return result
```

### State Inspection

Dump relevant state at failure point:

```javascript
function debugState(label) {
  console.group(label);
  console.log('User:', JSON.stringify(currentUser, null, 2));
  console.log('Cart:', JSON.stringify(cart, null, 2));
  console.log('Flags:', featureFlags);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();
}
```

### Diff Comparison

Compare working vs broken:

```python
def compare_states(working, broken):
    for key in set(working.keys()) | set(broken.keys()):
        w_val = working.get(key)
        b_val = broken.get(key)
        if w_val != b_val:
            print(f"DIFF {key}: {w_val} → {b_val}")
```

### Time Travel Debugging

Work backwards from the symptom:

```
Wrong value at line 50
  ↓ Where was it set?
Set at line 30
  ↓ What was the input?
Input from function call at line 25
  ↓ Where did that come from?
API response at line 10
  ↓ What did the API return?
Found: API returned null, not handled
```

## Bug Categories and Approaches

### Logic Bugs

**Symptoms:** Wrong output, incorrect behavior
**Approach:**
1. Add assertions for expected invariants
2. Test boundary conditions
3. Trace data transformations step by step

### Race Conditions

**Symptoms:** Intermittent failures, works sometimes
**Approach:**
1. Add logging with timestamps
2. Look for shared mutable state
3. Check async/await usage
4. Add synchronization

### Memory Issues

**Symptoms:** Slowdown over time, crashes
**Approach:**
1. Monitor memory usage
2. Check for growing collections
3. Look for unclosed resources
4. Use profiler/heap dumps

### Integration Bugs

**Symptoms:** Works in isolation, fails when integrated
**Approach:**
1. Check API contracts
2. Verify data formats
3. Check error handling
4. Test with real dependencies

## Bug Report Template

```markdown
## Bug Report

### Summary
[One-line description]

### Environment
- OS: 
- Browser/Runtime:
- Version:
- Config:

### Steps to Reproduce
1. 
2. 
3. 

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Frequency
[Always / Sometimes (X%) / Once]

### Investigation Notes
- Hypotheses tested:
- Ruled out:
- Likely cause:

### Root Cause
[When found]

### Fix
[When implemented]
```

## Debugging Checklist

- [ ] Defined expected vs actual behavior
- [ ] Can reproduce consistently
- [ ] Listed hypotheses
- [ ] Tested each hypothesis
- [ ] Isolated to specific code
- [ ] Found root cause (not just symptom)
- [ ] Wrote failing test
- [ ] Implemented fix
- [ ] Verified fix works
- [ ] Checked for similar issues
- [ ] Added prevention measures
