# PR Review

Comprehensive pull request review with context gathering and prioritized findings.

---

## Context

Before reviewing, gather the following:

1. **PR Information**
   - Read the PR diff: `gh pr diff <PR_NUMBER>` or `git diff <base>...<head>`
   - Get PR description: `gh pr view <PR_NUMBER>`
   - List changed files: `gh pr diff <PR_NUMBER> --name-only`

2. **Repository Documentation**
   - README.md (project overview, conventions)
   - CONTRIBUTING.md (contribution guidelines)
   - Architecture docs (docs/architecture*, ARCHITECTURE.md)
   - API documentation (docs/api*, API.md, OpenAPI specs)
   - AGENTS.md or similar AI/coding guidelines

3. **Related Code Context**
   - Read files that import/are imported by changed files
   - Check test files for changed modules
   - Review type definitions if applicable

## Instructions

1. **Gather Context**
   - Fetch PR diff and metadata
   - Read all relevant documentation files
   - Identify the scope and intent of the changes

2. **Review for Logic Correctness**
   - Trace execution paths through changed code
   - Verify conditionals and loops behave as intended
   - Check return values and state mutations
   - Confirm async/await and promise handling

3. **Identify Edge Cases**
   - Null/undefined inputs
   - Empty collections
   - Boundary values (0, -1, MAX_INT)
   - Concurrent access scenarios
   - Network/IO failures

4. **Check for Breaking Changes**
   - Public API signature changes
   - Removed or renamed exports
   - Changed default values
   - Modified behavior of existing functions
   - Database schema changes

5. **Verify API Compatibility**
   - Request/response format changes
   - Required vs optional field changes
   - Versioning implications
   - Backward compatibility with clients

6. **Assess Naming Conventions**
   - Consistency with existing codebase
   - Descriptive and unambiguous names
   - Following language/framework conventions

7. **Evaluate Error Handling**
   - Errors caught and handled appropriately
   - Meaningful error messages
   - No swallowed exceptions
   - Proper cleanup in error paths

8. **Cross-Reference Documentation**
   - Changes align with documented architecture
   - New features follow established patterns
   - No violations of stated conventions

## Output Format

Present findings grouped by priority:

```
## Critical (Must Fix)
Issues that will cause bugs, security vulnerabilities, or data loss.

- [ ] **[Category]** `file/path.ts:42` - Description of issue
  - Why: Explanation of impact
  - Suggestion: How to fix

## Important (Should Fix)
Issues that may cause problems or significantly hurt maintainability.

- [ ] **[Category]** `file/path.ts:87` - Description of issue
  - Why: Explanation of impact
  - Suggestion: How to fix

## Minor (Consider)
Style issues, minor improvements, or suggestions.

- [ ] **[Category]** `file/path.ts:123` - Description of issue
  - Suggestion: How to improve

## Looks Good
- Highlight well-written code or good patterns observed
```

Categories: `Logic`, `Edge Case`, `Breaking Change`, `API`, `Naming`, `Error Handling`, `Security`, `Performance`, `Documentation`

## Interactive Decisions

After presenting each priority section, pause for user input:

1. **After Critical Issues**
   - Ask: "Should I elaborate on any critical issue, or proceed to important issues?"
   - Options: Elaborate on specific item / Continue / Stop review

2. **After Important Issues**
   - Ask: "Would you like suggested fixes for any of these, or continue to minor issues?"
   - Options: Generate fix for item / Continue / Stop review

3. **After Minor Issues**
   - Ask: "Should I generate a review summary for the PR, or help draft fixes?"
   - Options: Generate summary / Draft fixes / Done

4. **Before Completing**
   - Ask: "Ready to post this review? I can format it for GitHub PR comments."
   - Options: Format for GitHub / Export as markdown / Revise findings
