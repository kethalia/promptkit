# Improve Code Quality

Analyze and refactor code for better readability, maintainability, and adherence to best practices.

---

## Context

Before analyzing, gather:
1. The target code files or directories to review
2. Repository style guide (look for `.eslintrc`, `.prettierrc`, `CONTRIBUTING.md`, `STYLE_GUIDE.md`, or similar)
3. Language and framework being used
4. Any existing linting rules or code quality tools in place
5. Team preferences if known

## Instructions

1. **Readability Analysis**
   - Check naming conventions (variables, functions, classes)
   - Evaluate function/method length and complexity
   - Assess comment quality and necessity
   - Review code organization and structure

2. **Maintainability Check**
   - Identify tightly coupled components
   - Look for hidden dependencies
   - Check for proper error handling
   - Evaluate test coverage implications

3. **DRY Violation Detection**
   - Find duplicated code blocks
   - Identify similar logic that could be unified
   - Look for copy-pasted code with minor variations

4. **Code Smell Identification**
   - Long methods/functions (>20-30 lines)
   - Deep nesting (>3 levels)
   - Long parameter lists (>3-4 parameters)
   - Feature envy (methods using other class data extensively)
   - God classes/modules (doing too much)
   - Magic numbers/strings
   - Dead code

5. **Anti-Pattern Detection**
   - Callback hell / promise chains
   - Premature optimization
   - Over-engineering
   - Inappropriate intimacy between modules
   - Shotgun surgery patterns

6. **Style Guide Compliance**
   - Compare against repo's style guide if present
   - Note deviations from established patterns
   - Check consistency with surrounding code

7. **Prioritize Findings**
   - Critical: Bugs, security issues, major maintainability blockers
   - High: Significant code smells, DRY violations
   - Medium: Readability improvements, minor refactoring
   - Low: Style nitpicks, optional enhancements

## Output Format

For each finding, provide:

```markdown
### [Issue Title]
**Priority:** Critical/High/Medium/Low
**Location:** `file:line`
**Type:** Readability/Maintainability/DRY/CodeSmell/AntiPattern/Style

**Problem:**
[Brief description of the issue]

**Before:**
```[language]
[current code]
```

**After:**
```[language]
[proposed refactored code]
```

**Rationale:**
[Why this change improves the code]

**Risk:** Low/Medium/High
[Any risks or considerations for this change]
```

### Summary Table

| Priority | Issue | Location | Type | Risk |
|----------|-------|----------|------|------|
| ... | ... | ... | ... | ... |

## Interactive Decisions

Pause and ask the user at these decision points:

1. **Scope Confirmation**
   - "I found X files to analyze. Should I proceed with all, or focus on specific areas?"

2. **Style Guide Ambiguity**
   - "No explicit style guide found. Should I infer from existing code or use [language] community standards?"

3. **Breaking Change Warning**
   - "This refactoring would change the public API of [component]. Proceed?"

4. **Large Refactoring**
   - "This improvement touches X files. Should I break it into smaller changes?"

5. **Priority Threshold**
   - "Found X issues. Should I show all, or only Critical/High priority items?"

6. **Implementation**
   - After presenting findings: "Which changes would you like me to implement? (all/specific numbers/none)"
