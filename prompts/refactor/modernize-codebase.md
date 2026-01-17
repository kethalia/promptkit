# Modernize Codebase

Identify and update deprecated APIs, old syntax, and outdated patterns to modern alternatives.

---

## Context

Before analyzing, gather:
1. Current language/runtime version (Node.js, Python, etc.)
2. Framework versions and their changelogs/migration guides
3. Package.json, requirements.txt, or equivalent for dependency versions
4. Target versions for modernization (if specified)
5. Any known constraints (browser support, runtime limitations)

## Instructions

1. **Deprecated API Detection**
   - Language built-in deprecations
   - Framework-specific deprecated methods
   - Library APIs marked for removal
   - Runtime warnings about deprecation

2. **Old Syntax Identification**
   - ES5 vs ES6+ patterns (var vs let/const, callbacks vs async/await)
   - Old class syntax vs modern alternatives
   - Legacy module systems (CommonJS vs ESM)
   - Outdated type annotations

3. **Outdated Pattern Detection**
   - Promise chains that could be async/await
   - Class components vs functional (React)
   - Options API vs Composition API (Vue)
   - Old state management patterns
   - Legacy error handling approaches

4. **Framework Migration Check**
   - Breaking changes between versions
   - Deprecated lifecycle methods
   - Changed configuration formats
   - New recommended patterns

5. **Dependency Audit**
   - Packages with known vulnerabilities
   - Unmaintained dependencies
   - Packages with modern alternatives
   - Version mismatches

6. **Risk Assessment**
   For each modernization:
   - **Low Risk:** Syntax changes, drop-in replacements
   - **Medium Risk:** API changes with clear migration path
   - **High Risk:** Behavioral changes, major refactoring needed

7. **Create Migration Plan**
   - Group related changes
   - Order by dependency (what must change first)
   - Identify safe stopping points
   - Plan testing strategy

## Output Format

### Modernization Opportunities

For each finding:

```markdown
### [Pattern/API Name]
**Category:** Deprecated API/Old Syntax/Outdated Pattern/Framework Migration/Dependency
**Risk Level:** Low/Medium/High
**Occurrences:** X files, Y instances
**Effort:** Trivial/Small/Medium/Large

**Current (Deprecated):**
```[language]
[old code pattern]
```

**Modern Alternative:**
```[language]
[updated code pattern]
```

**Migration Notes:**
- [Important considerations]
- [Potential gotchas]
- [Testing recommendations]

**References:**
- [Link to deprecation notice or migration guide]
```

### Migration Plan

```markdown
## Phase 1: Low-Risk Quick Wins
[Changes that can be made safely with minimal testing]

1. [ ] [Change description] - X files
2. [ ] ...

## Phase 2: Medium-Risk Updates
[Changes requiring careful testing but with clear migration paths]

1. [ ] [Change description] - X files
   - Dependency: Requires Phase 1 completion
2. [ ] ...

## Phase 3: High-Risk Modernizations
[Major changes requiring significant testing and possible feature flags]

1. [ ] [Change description] - X files
   - Risk: [specific risk]
   - Mitigation: [how to reduce risk]
```

### Summary Table

| Item | Category | Risk | Effort | Occurrences | Priority |
|------|----------|------|--------|-------------|----------|
| ... | ... | ... | ... | ... | ... |

## Interactive Decisions

Pause and ask the user at these decision points:

1. **Target Version**
   - "What's your target environment? (e.g., Node 18+, ES2022, React 18)"

2. **Constraint Clarification**
   - "Do you need to maintain compatibility with [older version/browser]?"

3. **Risk Tolerance**
   - "Should I include high-risk modernizations that may require significant refactoring?"

4. **Scope Selection**
   - "Found X modernization opportunities. Focus on:
     a) All categories
     b) Only deprecated APIs (breaking soon)
     c) Only syntax updates (low risk)
     d) Only framework-specific migrations
     e) Specific files/directories"

5. **Automated vs Manual**
   - "Some changes can be automated with codemods. Should I:
     a) Apply automated fixes directly
     b) Show me the changes first
     c) Provide codemod commands to run"

6. **Phase Implementation**
   - "Ready to implement Phase 1 (low-risk)? Or would you like to review the full plan first?"

7. **Testing Strategy**
   - "After modernization, should I:
     a) Run existing tests
     b) Suggest additional test cases
     c) Skip testing (you'll handle it)"
