# Contributing to AI Prompts

## Adding a New Prompt

1. Choose the appropriate category folder under `prompts/`
2. Create a new `.md` file with a descriptive kebab-case name
3. Follow the prompt template structure below
4. Update `README.md` to include your new prompt in the index

## Prompt Template

```markdown
# [Prompt Title]

[One-line description of what this prompt does]

---

## Context

[Specify what context the AI should gather first, e.g., files to read, commands to run]

## Instructions

[Step-by-step process for the AI to follow]

1. **Step Name:**
   - Details
   - Details

2. **Step Name:**
   - Details

## Output Format

[How findings/results should be presented]

## Interactive Decisions (if applicable)

[Points where user input is needed]

For each [finding type], ask:
- (a) Option A
- (b) Option B
- (c) Option C
```

## Design Principles

### Universal and Language-Agnostic
- Write prompts that work across different languages when possible
- Use language-specific folders only when the prompt is inherently tied to that language/framework

### Reference Repository Documentation
- Always instruct the AI to check for and reference:
  - README files
  - Architecture docs
  - Contributing guidelines
  - Code style guides
  - API documentation
- Compare findings against both repo-specific docs AND general software development standards

### Testing Prompts: Meaningful Tests
When writing testing-related prompts, ensure they produce tests that:
- Actually execute the code under test (not just mock everything)
- Have specific assertions that verify behavior
- Cover edge cases and error conditions
- Don't just test that "a function was called" but that it produced correct results
- Avoid trivial tests that always pass

### Interactive Decision Points
- Include decision points where the user can choose how to proceed
- Offer clear options with brief explanations
- Don't assume what the user wants - ask

### Prioritized Output
- Present findings in priority order (critical > important > minor)
- Be specific - cite file names, line numbers, code snippets
- Explain why something matters, not just what it is

## File Naming

- Use kebab-case: `my-prompt-name.md`
- Be descriptive but concise
- Prefix with action verb when applicable: `generate-`, `review-`, `fix-`, `migrate-`

## Categories

| Folder | Use For |
|--------|---------|
| `review/` | Code review, PR review, change analysis |
| `debug/` | Error diagnosis, debugging, tracing |
| `refactor/` | Code improvements, extraction, cleanup |
| `testing/` | Test generation, coverage, test cases |
| `docs/` | Documentation generation |
| `architecture/` | Design, patterns, system structure |
| `security/` | Security audits, vulnerability checks |
| `language-specific/` | Language or framework-specific prompts |

## Quality Checklist

Before submitting a prompt:

- [ ] Follows the template structure
- [ ] Has clear, numbered steps
- [ ] Specifies what context/files the AI should gather
- [ ] Includes output format expectations
- [ ] Has interactive decision points where appropriate
- [ ] Is added to README.md index
- [ ] Tested with at least one real use case
