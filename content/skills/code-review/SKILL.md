---
name: code-review
description: Comprehensive code review workflows for AI coding assistants. Use when reviewing pull requests, staged changes, diffs, or performing code quality assessments. Triggers include "review this PR", "review my changes", "code review", "check this diff", "review before merge", or when user shares git diff output or PR links. Covers PR reviews, current changes analysis, and systematic code review checklists.
---

# Code Review Skill

Structured workflows for conducting thorough code reviews. This skill covers three main scenarios:
1. **PR Review** - Full pull request analysis
2. **Current Changes Review** - Review staged/unstaged changes before commit
3. **Code Review Checklist** - Systematic quality assessment

## Quick Reference

| Scenario | Trigger | Reference |
|----------|---------|-----------|
| PR Review | "review this PR", PR link, full diff | See [pr-review.md](references/pr-review.md) |
| Current Changes | "review my changes", staged diff | See [current-changes.md](references/current-changes.md) |
| Checklist Review | "thorough review", "code quality check" | See [checklist.md](references/checklist.md) |

## Core Review Principles

### Review Mindset
- Act as a **senior engineer** providing constructive feedback
- Focus on **substance over style** - flag real issues, not preferences
- Be **specific and actionable** - explain *why* something is problematic
- **Praise good patterns** - reinforce positive practices
- Consider **context** - review relative to the codebase and team norms

### Severity Levels

Use consistent severity markers:

| Level | Marker | Description |
|-------|--------|-------------|
| Critical | 🔴 **CRITICAL** | Security vulnerabilities, data loss risks, breaking changes |
| Major | 🟠 **MAJOR** | Bugs, performance issues, architectural concerns |
| Minor | 🟡 **MINOR** | Code quality, maintainability, best practices |
| Nit | 💭 **NIT** | Style suggestions, optional improvements |

### Review Output Format

Structure feedback consistently:

```
## Summary
[1-2 sentence overview of the changes and overall assessment]

## Critical Issues
[List any blocking issues that must be addressed]

## Recommendations
[Specific, actionable improvements organized by file/component]

## Positive Highlights
[Good patterns worth acknowledging]

## Questions
[Clarifications needed to complete review]
```

## Workflow Selection

### When to use PR Review
- Reviewing a complete pull request
- User provides full diff or PR link
- Changes span multiple files
- Need to assess overall impact

### When to use Current Changes Review  
- User wants to review before committing
- Reviewing staged changes (`git diff --staged`)
- Quick sanity check on recent work
- Pre-push verification

### When to use Checklist Review
- Thorough quality assessment needed
- Preparing code for production
- Auditing existing code
- Training or mentorship context

## Getting Diff Content

If user hasn't provided diff, suggest:

```bash
# For staged changes
git diff --staged

# For all uncommitted changes  
git diff

# For changes in a branch vs main
git diff main...HEAD

# For a specific PR (GitHub CLI)
gh pr diff <PR_NUMBER>
```

## Integration with Tools

### With Claude Code / CLI
```bash
# Review staged changes
git diff --staged | claude "review these changes"

# Review a PR
gh pr diff 123 | claude "review this PR"
```

### With opencode
```bash
opencode "review my staged changes using @code-review"
```

## Tips for Effective Reviews

1. **Start with context** - Understand what the change is trying to accomplish
2. **Check for completeness** - Are tests included? Documentation updated?
3. **Consider edge cases** - What happens with null, empty, or extreme values?
4. **Think about the future** - Will this be easy to maintain and extend?
5. **Review incrementally** - For large PRs, review file-by-file or commit-by-commit
