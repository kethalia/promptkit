# Review Documentation Consistency

Review code documentation independently for internal consistency, accuracy, clarity, and correctness without comparing to implementation.

---

## Context

Gather before starting:
- Documentation files (README.md, API docs, guides, architecture docs)
- Inline code documentation (docstrings, JSDoc, comments)
- Configuration and setup documentation
- Changelog or version history
- User-facing documentation (tutorials, how-tos)
- Technical specifications or design documents

## Instructions

1. **Collect all documentation**
   - Find all markdown files in /docs, /documentation folders
   - Identify README files at all levels
   - Locate inline documentation (docstrings, JSDoc, XML docs)
   - Note API documentation files (OpenAPI, Swagger, etc.)
   - Find contributing guidelines, code of conduct

2. **Check internal consistency**
   - Cross-reference terminology used across documents
   - Verify examples use consistent parameter names
   - Check that related sections don't contradict each other
   - Ensure version numbers match across documents
   - Validate links between documentation sections

3. **Review terminology and naming**
   - Identify inconsistent naming (e.g., "user ID" vs "userId" vs "user_id")
   - Check for ambiguous or overloaded terms
   - Note undefined acronyms or jargon
   - Verify consistent capitalization of project-specific terms
   - Flag terminology that changes meaning between documents

4. **Validate structure and completeness**
   - Check for broken internal links
   - Verify table of contents matches actual sections
   - Ensure examples are complete (imports, setup, cleanup)
   - Look for incomplete sections marked TODO or TBD
   - Check that all parameters/options mentioned are documented

5. **Review accuracy and clarity**
   - Verify configuration examples use valid syntax
   - Check that code examples would parse correctly
   - Look for outdated references (old package names, deprecated APIs)
   - Ensure error messages match documented format
   - Validate that numeric examples calculate correctly

6. **Check logical flow**
   - Verify prerequisites are mentioned before usage
   - Ensure setup steps are in correct order
   - Check that advanced topics build on basics
   - Look for circular dependencies in explanations
   - Validate that examples progress logically

7. **Review formatting and style**
   - Check consistent code block formatting
   - Verify consistent heading hierarchy
   - Look for broken markdown syntax
   - Ensure consistent list formatting (bullet vs numbered)
   - Check that tables render correctly

## Output Format

```markdown
# Documentation Consistency Review

## Summary

| Category | Status | Issues Found |
|----------|--------|--------------|
| Terminology | PASS/WARN/FAIL | N |
| Internal Consistency | PASS/WARN/FAIL | N |
| Completeness | PASS/WARN/FAIL | N |
| Accuracy | PASS/WARN/FAIL | N |
| Structure | PASS/WARN/FAIL | N |
| Formatting | PASS/WARN/FAIL | N |

**Overall Documentation Quality: EXCELLENT / GOOD / NEEDS IMPROVEMENT / POOR**

---

## Issues by Category

### Terminology Issues

#### Inconsistent Naming
- **"user ID" vs "userId"**
  - `README.md:45` uses "user ID"
  - `api-docs.md:120` uses "userId"
  - `setup-guide.md:23` uses "user_id"
  - Recommendation: Standardize on one format

#### Undefined Acronyms
- **"RPC" used without definition**
  - First used in `architecture.md:67`
  - Should define as "Remote Procedure Call" on first use

### Internal Consistency Issues

#### Contradictory Instructions
- **Installation command mismatch**
  - `README.md:12` says: `npm install --save package`
  - `getting-started.md:5` says: `yarn add package`
  - Recommendation: Document both or choose one primary method

#### Version Mismatches
- **Version numbers inconsistent**
  - `README.md` references v2.0.0
  - `CHANGELOG.md` latest entry is v1.8.5
  - `package.json` shows v1.9.0

### Completeness Issues

#### Missing Prerequisites
- **Database setup not mentioned**
  - `quick-start.md` assumes database exists
  - No mention of required schema or migrations
  - Location: `quick-start.md:15-30`

#### Incomplete Examples
- **Missing imports in code example**
  - `api-guide.md:89` example uses `createClient()` without import
  - User cannot run example as-is

### Accuracy Issues

#### Invalid Configuration
- **JSON syntax error in example**
  - `config-reference.md:120` has trailing comma in JSON
  - Would cause parse error if copied directly

#### Outdated References
- **References deprecated API**
  - `migration-guide.md:45` mentions `oldMethod()` as current
  - Should note this was replaced in v2.0

### Structure Issues

#### Broken Links
- **Dead internal link**
  - `README.md:78` links to `docs/advanced.md` (does not exist)
  - Should link to `docs/advanced-usage.md`

#### TOC Mismatch
- **Table of contents out of sync**
  - `user-guide.md` TOC lists "Security" section
  - Actual document has no Security section

### Formatting Issues

#### Inconsistent Code Blocks
- Mixed language tags (js vs javascript vs typescript)
- Some examples lack language specification
- Affects syntax highlighting

#### Broken Markdown
- **Invalid table syntax**
  - `api-reference.md:234` missing column separator
  - Table does not render correctly

---

## Recommendations

### High Priority
1. **Standardize terminology** - Create glossary and use consistent terms
2. **Fix version mismatches** - Sync version numbers across all docs
3. **Repair broken links** - Update all internal references
4. **Complete examples** - Add missing imports and setup code

### Medium Priority
5. **Define acronyms** - Expand on first use or add glossary
6. **Fix formatting** - Standardize code block languages and markdown
7. **Resolve contradictions** - Align conflicting instructions

### Low Priority
8. **Improve structure** - Update TOCs to match content
9. **Enhance clarity** - Simplify complex explanations
10. **Add missing sections** - Fill in TODO/TBD markers

---

## Documentation Health Score: X/100

**Breakdown:**
- Terminology: X/20
- Consistency: X/20
- Completeness: X/20
- Accuracy: X/20
- Structure: X/10
- Formatting: X/10
```

## Interactive Decisions

Ask the user about:
- **Scope**: Review all documentation or specific files/sections?
- **Detail level**: Quick overview or deep line-by-line analysis?
- **Terminology**: Should I create a glossary of terms found?
- **Auto-fix**: Should I fix minor formatting issues automatically?
- **Report format**: Full detailed report or summary with top issues only?
- **Include suggestions**: Just identify issues or propose solutions?
