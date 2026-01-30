# PR Review Workflow

Comprehensive workflow for reviewing pull requests.

## Initial Assessment

### 1. Understand the Context
Before diving into code, gather context:

- **PR Title & Description**: What problem is being solved?
- **Related Issues**: Any linked tickets or discussions?
- **PR Size**: Small (<100 lines), Medium (100-500), Large (500+)?
- **Files Changed**: Which areas of the codebase are affected?

### 2. High-Level Scan
Quickly scan to understand the change:

```
Questions to answer:
- What type of change is this? (feature, bugfix, refactor, config)
- What's the blast radius? (isolated vs wide-reaching)
- Are there any obvious red flags?
```

## Detailed Review Process

### Step 1: Architecture & Design

Check for structural concerns:

- [ ] Does the change fit the existing architecture?
- [ ] Are there any unnecessary coupling or dependencies?
- [ ] Is the abstraction level appropriate?
- [ ] Could this be simplified?

**Red Flags:**
- Circular dependencies
- God classes/functions doing too much
- Leaky abstractions
- Copy-pasted code that should be shared

### Step 2: Logic & Correctness

Verify the implementation:

- [ ] Does the code do what it claims to do?
- [ ] Are edge cases handled?
- [ ] Is error handling appropriate?
- [ ] Are assumptions documented?

**Common Issues:**
- Off-by-one errors
- Null/undefined handling
- Race conditions in async code
- Integer overflow/underflow
- Incorrect boolean logic

### Step 3: Security Review

Check for vulnerabilities:

- [ ] Input validation present?
- [ ] SQL injection prevented?
- [ ] XSS protection in place?
- [ ] Sensitive data properly handled?
- [ ] Auth/authz checks correct?

**Security Checklist:**
```
- User input sanitized before use
- Parameterized queries for database
- Output encoding for HTML/JS
- Secrets not hardcoded
- Proper access control checks
```

### Step 4: Performance

Assess performance implications:

- [ ] Any obvious O(n²) or worse algorithms?
- [ ] Database queries optimized? (N+1 problem?)
- [ ] Appropriate caching considered?
- [ ] Memory usage reasonable?

**Performance Red Flags:**
- Loops within loops over large datasets
- Missing database indexes on queried fields
- Unbounded queries without pagination
- Synchronous operations that could be async

### Step 5: Testing

Verify test coverage:

- [ ] Are there tests for the new code?
- [ ] Do tests cover edge cases?
- [ ] Are tests readable and maintainable?
- [ ] Do existing tests still pass?

**Testing Questions:**
- What's the happy path test?
- What's the sad path test?
- Are boundary conditions tested?
- Are error conditions tested?

### Step 6: Documentation & Readability

Check code clarity:

- [ ] Are complex sections commented?
- [ ] Are public APIs documented?
- [ ] Is the code self-documenting?
- [ ] Are README/docs updated if needed?

## PR Review Template

Use this template for structured feedback:

```markdown
## PR Review: [PR Title]

### Summary
[Overall assessment - approve, request changes, or needs discussion]

### What This PR Does
[1-2 sentences summarizing the change]

### Review Notes

#### 🔴 Critical (Must Fix)
- [Issue with file:line reference and explanation]

#### 🟠 Major (Should Fix)
- [Issue with file:line reference and explanation]

#### 🟡 Minor (Consider)
- [Suggestion with file:line reference]

#### 💭 Nits (Optional)
- [Style/preference suggestions]

### ✅ What I Liked
- [Positive aspects worth highlighting]

### ❓ Questions
- [Clarifications needed]

### Verdict
- [ ] Approved
- [ ] Request Changes
- [ ] Needs Discussion
```

## Review Communication

### Tone Guidelines
- Be constructive, not critical
- Ask questions rather than making demands
- Explain the "why" behind suggestions
- Acknowledge good work

### Example Phrasing

**Instead of:** "This is wrong"
**Say:** "I think this might cause an issue because... What do you think about...?"

**Instead of:** "Why didn't you..."
**Say:** "Have you considered... It might help with..."

**Instead of:** "This is confusing"
**Say:** "I had trouble following this section. Would adding a comment help clarify...?"

## Large PR Strategy

For PRs over 500 lines:

1. **Review commit-by-commit** if commits are logical
2. **Review file-by-file** grouping by functionality
3. **Ask for split** if PR does multiple unrelated things
4. **Prioritize critical paths** - focus on business logic over boilerplate
5. **Time-box** - do initial pass, note concerns, return fresh

## Checklist for Final Sign-off

Before approving:

- [ ] All critical/major issues addressed
- [ ] Tests pass
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Breaking changes documented (if any)
- [ ] Changelog updated (if required)
