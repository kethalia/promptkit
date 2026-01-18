# AI Prompts for Coding

A collection of reusable prompts for AI coding assistants, optimized for [opencode](https://opencode.ai) and Claude.

## Usage

Copy the prompt content and paste it into your AI assistant, or reference the file path directly if your tool supports it.

### With opencode

```bash
# Use a prompt directly
opencode "$(cat prompts/review/pr-review.md)"

# Or reference in conversation
@prompts/testing/write-unit-tests.md
```

## Prompt Categories

### General Purpose

| Category | Description |
|----------|-------------|
| [review/](prompts/review/) | Code review, PR review, change analysis |
| [debug/](prompts/debug/) | Error diagnosis, bug tracing, stack trace analysis |
| [refactor/](prompts/refactor/) | Code quality improvements, extraction, modernization |
| [testing/](prompts/testing/) | Unit tests, test coverage, test case generation |
| [docs/](prompts/docs/) | README generation, function documentation, API docs |
| [architecture/](prompts/architecture/) | Design review, patterns, tradeoff analysis |
| [security/](prompts/security/) | Security audits, vulnerability checks, dependency audits |

### Language-Specific

| Language/Framework | Description |
|--------------------|-------------|
| [typescript/](prompts/language-specific/typescript/) | Type safety, migration, fixing type errors |
| [solidity/](prompts/language-specific/solidity/) | Smart contract audits, gas optimization, Foundry/Hardhat testing |
| [react-nextjs/](prompts/language-specific/react-nextjs/) | Component review, performance, hooks, App Router migration |
| [go/](prompts/language-specific/go/) | Idioms, concurrency, error handling |
| [rust/](prompts/language-specific/rust/) | Ownership, unsafe code, Cargo best practices |

## Prompt Index

### Review
- [review-current-changes.md](prompts/review/review-current-changes.md) - Review staged/unstaged changes against docs and best practices
- [pr-review.md](prompts/review/pr-review.md) - Comprehensive pull request review
- [code-review-checklist.md](prompts/review/code-review-checklist.md) - Quick checklist-style code review

### Debug
- [diagnose-error.md](prompts/debug/diagnose-error.md) - Systematic error diagnosis
- [trace-bug.md](prompts/debug/trace-bug.md) - Step-by-step bug tracing
- [analyze-stack-trace.md](prompts/debug/analyze-stack-trace.md) - Stack trace analysis and fixes

### Refactor
- [improve-code-quality.md](prompts/refactor/improve-code-quality.md) - General code quality improvements
- [extract-reusable.md](prompts/refactor/extract-reusable.md) - Extract reusable components/utilities
- [modernize-codebase.md](prompts/refactor/modernize-codebase.md) - Update deprecated patterns

### Testing
- [write-unit-tests.md](prompts/testing/write-unit-tests.md) - Generate meaningful unit tests
- [improve-test-coverage.md](prompts/testing/improve-test-coverage.md) - Find and fill test gaps
- [generate-test-cases.md](prompts/testing/generate-test-cases.md) - Generate edge cases and scenarios

### Documentation
- [generate-readme.md](prompts/docs/generate-readme.md) - Create/update project README
- [document-function.md](prompts/docs/document-function.md) - Generate function documentation
- [generate-api-docs.md](prompts/docs/generate-api-docs.md) - Document API endpoints

### Architecture
- [design-review.md](prompts/architecture/design-review.md) - Review system/component design
- [suggest-patterns.md](prompts/architecture/suggest-patterns.md) - Recommend design patterns
- [evaluate-tradeoffs.md](prompts/architecture/evaluate-tradeoffs.md) - Compare approaches with pros/cons

### Security
- [security-audit.md](prompts/security/security-audit.md) - Comprehensive security review
- [check-vulnerabilities.md](prompts/security/check-vulnerabilities.md) - Check for common vulnerabilities
- [dependency-audit.md](prompts/security/dependency-audit.md) - Review dependencies for issues

### TypeScript
- [type-safety-review.md](prompts/language-specific/typescript/type-safety-review.md) - Review type safety
- [migrate-to-typescript.md](prompts/language-specific/typescript/migrate-to-typescript.md) - Convert JS to TypeScript
- [fix-type-errors.md](prompts/language-specific/typescript/fix-type-errors.md) - Fix TypeScript errors

### Solidity
- [smart-contract-audit.md](prompts/language-specific/solidity/smart-contract-audit.md) - Smart contract security audit
- [gas-optimization.md](prompts/language-specific/solidity/gas-optimization.md) - Optimize gas usage
- [upgrade-solidity-version.md](prompts/language-specific/solidity/upgrade-solidity-version.md) - Upgrade Solidity version
- [foundry-test-coverage.md](prompts/language-specific/solidity/foundry-test-coverage.md) - Foundry test generation
- [hardhat-test-coverage.md](prompts/language-specific/solidity/hardhat-test-coverage.md) - Hardhat test generation

### React/Next.js
- [component-review.md](prompts/language-specific/react-nextjs/component-review.md) - Review component design
- [performance-optimization.md](prompts/language-specific/react-nextjs/performance-optimization.md) - Fix performance issues
- [hooks-best-practices.md](prompts/language-specific/react-nextjs/hooks-best-practices.md) - Review hooks usage
- [nextjs-app-router-migration.md](prompts/language-specific/react-nextjs/nextjs-app-router-migration.md) - Migrate to App Router
- [extract-constants.md](prompts/language-specific/react-nextjs/extract-constants.md) - Extract hardcoded values into constants
- [extract-utility-functions.md](prompts/language-specific/react-nextjs/extract-utility-functions.md) - Extract pure utility functions

### Go
- [go-idioms-review.md](prompts/language-specific/go/go-idioms-review.md) - Review for idiomatic Go
- [concurrency-review.md](prompts/language-specific/go/concurrency-review.md) - Review concurrency patterns
- [error-handling-review.md](prompts/language-specific/go/error-handling-review.md) - Review error handling

### Rust
- [ownership-review.md](prompts/language-specific/rust/ownership-review.md) - Review ownership and borrowing
- [unsafe-code-audit.md](prompts/language-specific/rust/unsafe-code-audit.md) - Audit unsafe blocks
- [cargo-best-practices.md](prompts/language-specific/rust/cargo-best-practices.md) - Review Cargo configuration

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding or improving prompts.

## License

MIT
