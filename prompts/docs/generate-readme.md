# Generate README

Create or update a comprehensive project README based on actual codebase analysis.

---

## Context

Gather before starting:
- Project manifest files (package.json, cargo.toml, pyproject.toml, go.mod, etc.)
- Existing README.md if present (to preserve tone/style)
- Directory structure overview
- Entry points and main modules
- Existing documentation in /docs folder
- CI/CD configuration files
- License file

## Instructions

1. **Analyze project type and structure**
   - Identify language/framework from manifest files
   - Map directory structure to understand organization
   - Find entry points (main.ts, index.js, main.go, etc.)
   - Note monorepo vs single package structure

2. **Extract project metadata**
   - Name, version, description from manifest
   - Repository URL, homepage, author info
   - License type
   - Node/Python/Rust version requirements

3. **Identify key features**
   - Analyze exports and public API surface
   - Review CLI commands if applicable
   - Note integrations and plugins
   - Check for configuration options

4. **Document dependencies**
   - List major runtime dependencies and their purpose
   - Note peer dependencies and requirements
   - Identify optional dependencies

5. **Map available scripts/commands**
   - Build, test, lint, format commands
   - Development server commands
   - Deployment or release scripts

6. **Generate code examples**
   - Pull real examples from tests or examples/ directory
   - Create minimal usage examples for main features
   - Include configuration examples if relevant

7. **Match existing style**
   - If README exists, preserve voice and tone
   - Follow badge/shield conventions if present
   - Maintain existing section ordering preferences

## Output Format

```markdown
# Project Name

Brief description (1-2 sentences)

[Badges: build status, version, license, etc.]

## Overview

What the project does and why it exists (2-3 paragraphs max)

## Features

- Key feature 1
- Key feature 2
- Key feature 3

## Installation

```bash
# Package manager installation
npm install package-name
```

## Quick Start

```javascript
// Minimal working example
```

## Usage

### Basic Usage
[Core functionality with examples]

### Configuration
[Config options if applicable]

### CLI Commands
[If applicable]

## API Reference

[Brief API overview or link to full docs]

## Development

```bash
# Clone and install
git clone <repo>
cd project
npm install

# Run tests
npm test

# Build
npm run build
```

## Contributing

[Contributing guidelines or link to CONTRIBUTING.md]

## License

[License type with link]
```

## Interactive Decisions

Ask the user about:
- **Audience level**: Beginner-friendly or developer-focused?
- **Detail depth**: Minimal quickstart or comprehensive reference?
- **Sections to include/exclude**: API docs, contributing, badges?
- **Example complexity**: Simple snippets or complete workflows?
- **Existing README**: Update in place or regenerate from scratch?
