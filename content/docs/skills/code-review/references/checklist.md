---
title: "Code Review Checklist"
---
# Code Review Checklist

Comprehensive checklist for systematic code review. Use for thorough quality assessments.

## How to Use

1. Go through each category systematically
2. Mark items as ✅ (pass), ❌ (fail), or ⏭️ (N/A)
3. Document specific findings for failed items
4. Prioritize fixes by severity

---

## 1. Correctness

### Logic & Behavior
- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Boundary conditions are correct
- [ ] Null/undefined values are handled
- [ ] Error states are handled gracefully
- [ ] Race conditions are prevented (if applicable)

### Data Handling
- [ ] Data transformations are correct
- [ ] Type conversions are safe
- [ ] Numeric operations handle overflow/precision
- [ ] String encoding is handled correctly
- [ ] Date/time handling accounts for timezones

---

## 2. Security

### Input Validation
- [ ] All user inputs are validated
- [ ] Input length limits are enforced
- [ ] Input types are verified
- [ ] Malicious input patterns are rejected

### Authentication & Authorization
- [ ] Auth checks are present where needed
- [ ] Authorization is verified before actions
- [ ] Session handling is secure
- [ ] Tokens are properly validated

### Data Protection
- [ ] Sensitive data is encrypted at rest
- [ ] Sensitive data is encrypted in transit
- [ ] PII is handled according to policy
- [ ] Secrets are not hardcoded
- [ ] Logs don't contain sensitive data

### Common Vulnerabilities
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (output encoding)
- [ ] CSRF protection in place
- [ ] Path traversal prevented
- [ ] Command injection prevented

---

## 3. Performance

### Algorithmic Efficiency
- [ ] Time complexity is appropriate
- [ ] Space complexity is reasonable
- [ ] No unnecessary nested loops
- [ ] Early exit conditions present where applicable

### Database
- [ ] Queries are optimized
- [ ] Indexes exist for queried fields
- [ ] N+1 query problem avoided
- [ ] Large result sets are paginated
- [ ] Transactions are used appropriately

### Resource Usage
- [ ] Memory leaks prevented
- [ ] Connections are properly closed
- [ ] Large files handled via streaming
- [ ] Caching used where appropriate

### Network
- [ ] API calls are batched where possible
- [ ] Retries have exponential backoff
- [ ] Timeouts are configured
- [ ] Payload sizes are reasonable

---

## 4. Reliability

### Error Handling
- [ ] Errors are caught and handled
- [ ] Error messages are informative
- [ ] Errors don't leak sensitive info
- [ ] Failed operations don't corrupt state
- [ ] Retry logic handles transient failures

### Resilience
- [ ] External service failures are handled
- [ ] Circuit breakers in place (if needed)
- [ ] Graceful degradation implemented
- [ ] Timeouts prevent hanging

### Observability
- [ ] Appropriate logging is present
- [ ] Log levels are correct
- [ ] Metrics/monitoring in place
- [ ] Errors are tracked/alertable

---

## 5. Maintainability

### Code Organization
- [ ] Code follows project structure
- [ ] Functions/classes have single responsibility
- [ ] No god objects or functions
- [ ] Dependencies are managed properly

### Readability
- [ ] Variable/function names are descriptive
- [ ] Complex logic is commented
- [ ] Code is self-documenting where possible
- [ ] Magic numbers are avoided (use constants)

### DRY Principle
- [ ] No copy-pasted code blocks
- [ ] Shared logic is extracted
- [ ] Utilities are reusable
- [ ] Configuration is centralized

### Modularity
- [ ] Components are loosely coupled
- [ ] Interfaces are well-defined
- [ ] Dependencies are injected
- [ ] Code can be tested in isolation

---

## 6. Testing

### Test Coverage
- [ ] New code has tests
- [ ] Critical paths are tested
- [ ] Edge cases are tested
- [ ] Error paths are tested

### Test Quality
- [ ] Tests are readable
- [ ] Tests are independent
- [ ] Tests are deterministic
- [ ] Tests run fast enough

### Test Types (as applicable)
- [ ] Unit tests present
- [ ] Integration tests present
- [ ] E2E tests present (if UI)
- [ ] Performance tests present (if critical)

---

## 7. Documentation

### Code Documentation
- [ ] Public APIs are documented
- [ ] Complex algorithms are explained
- [ ] Non-obvious decisions are documented
- [ ] TODO/FIXME have tracking issues

### External Documentation
- [ ] README updated if needed
- [ ] API docs updated if needed
- [ ] Changelog updated if needed
- [ ] Migration guide provided (if breaking)

---

## 8. Standards & Conventions

### Style
- [ ] Follows project style guide
- [ ] Consistent formatting
- [ ] Linting passes
- [ ] No style-only changes mixed with logic

### Patterns
- [ ] Follows established patterns
- [ ] New patterns are discussed/documented
- [ ] Anti-patterns are avoided

### Dependencies
- [ ] New dependencies are justified
- [ ] Dependencies are properly versioned
- [ ] No vulnerable dependencies
- [ ] License compatibility checked

---

## Review Summary Template

```markdown
## Code Review Summary

**Reviewer:** [Name]
**Date:** [Date]
**Scope:** [Files/Components reviewed]

### Checklist Results

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Correctness | | | |
| Security | | | |
| Performance | | | |
| Reliability | | | |
| Maintainability | | | |
| Testing | | | |
| Documentation | | | |
| Standards | | | |

### Critical Issues
1. [Issue description and location]

### Major Issues
1. [Issue description and location]

### Minor Issues
1. [Issue description and location]

### Recommendations
1. [Suggestion]

### Overall Assessment
- [ ] Approved
- [ ] Approved with minor changes
- [ ] Request changes
- [ ] Needs significant rework
```

---

## Quick Reference by Language

### JavaScript/TypeScript
- [ ] `===` used instead of `==`
- [ ] Promises properly awaited
- [ ] No floating promises
- [ ] TypeScript types are specific (not `any`)

### Python
- [ ] Type hints present
- [ ] Context managers for resources
- [ ] No bare `except:`
- [ ] f-strings used for formatting

### Go
- [ ] Errors are checked
- [ ] Context is properly passed
- [ ] Goroutines don't leak
- [ ] defer used for cleanup

### SQL
- [ ] Parameterized queries used
- [ ] Appropriate indexes exist
- [ ] JOINs are efficient
- [ ] No SELECT *

### React
- [ ] Keys present in lists
- [ ] useEffect deps are correct
- [ ] No state in derived data
- [ ] Components are focused
