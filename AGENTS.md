# AGENTS.md

Guidelines for AI coding agents operating in this repository.

## Project Overview

A collection of reusable AI coding prompts transformed into a **Nextra v4** documentation site with AI/LLM-optimized access. Stack: Next.js 15 (App Router), Nextra v4, Tailwind CSS v4, shadcn/ui, Pagefind search, Docker for self-hosting.

Project management is done via **GitHub Issues**. Reference the epic (#4) and sub-issues for all planned work. Always check open issues before starting work, and reference issue numbers in commits.

## Build / Dev / Test Commands

```bash
# Install dependencies (uses pnpm — see packageManager in package.json)
pnpm install

# Development (Turbopack)
pnpm dev                 # starts Next.js dev server on :3000

# Production build
pnpm build               # builds Next.js (standalone output)
pnpm postbuild           # indexes pages with Pagefind for search
pnpm start               # starts production server on :3000

# Docker
docker compose up -d             # build and run
docker compose up -d --build     # rebuild after changes
docker compose down              # stop

# Linting / Type checking
pnpm tsc --noEmit                # typecheck without emitting
pnpm next lint                   # run Next.js ESLint rules (if configured)

# No test framework is currently configured.
# If tests are added, prefer Vitest with:
#   pnpm vitest run                  # run all tests
#   pnpm vitest run path/to/file     # run a single test file
#   pnpm vitest run -t "test name"   # run a single test by name
```

## Project Structure

```
app/                        # Next.js App Router
  layout.tsx                # Root layout (Nextra theme, navbar, footer)
  globals.css               # Tailwind CSS imports
  [[...mdxPath]]/page.tsx   # Catch-all MDX renderer (content/ directory)
  llms-full.txt/route.ts    # Full LLM context endpoint
  api/prompts/              # REST API for programmatic prompt access
content/                    # MDX prompt files (Nextra content directory)
  _meta.ts                  # Root sidebar configuration
  index.mdx                 # Homepage
  {category}/               # Prompt categories (review/, debug/, etc.)
    _meta.ts                # Sidebar config per category
    {prompt}.mdx            # Individual prompt files
components/ui/              # shadcn/ui components
lib/                        # Shared utilities (cn(), prompt helpers)
public/llms.txt             # llms.txt standard file
mdx-components.tsx          # Nextra MDX component configuration
next.config.mjs             # Next.js + Nextra config (standalone output)
```

## Code Quality Standards

Write code as a **senior/principal software engineer**. Code readability and simplicity are the top priority. Adhere to industry best practices. Write DRY code -- always analyze if there is an opportunity to reduce duplication before writing new code.

### TypeScript

- Use TypeScript for all `.ts` and `.tsx` files. No `any` types -- use `unknown` and narrow with type guards.
- Prefer `interface` for object shapes, `type` for unions/intersections/aliases.
- Use `const` by default. Only use `let` when reassignment is necessary. Never use `var`.
- Export types alongside their implementations. Prefer named exports over default exports (except for Next.js page/layout conventions).
- Use strict mode (`"strict": true` in tsconfig).

### Imports & Module Organization

- Group imports in order: (1) React/Next.js, (2) external packages, (3) internal `@/` aliases, (4) relative imports. Separate groups with a blank line.
- Use path aliases (`@/components/...`, `@/lib/...`) instead of deep relative paths.
- Avoid barrel files (`index.ts` re-exports) unless the module is a public API boundary.

### Naming Conventions

- **Files:** kebab-case for all files (`my-component.tsx`, `api-utils.ts`).
- **Components:** PascalCase (`CategoryCard`, `PromptLayout`).
- **Functions/variables:** camelCase (`getPromptContent`, `isValidSlug`).
- **Constants:** UPPER_SNAKE_CASE for true constants (`MAX_RETRIES`, `API_BASE_URL`).
- **Types/Interfaces:** PascalCase (`PromptMetadata`, `CategoryConfig`).
- **CSS classes:** Use Tailwind utilities. For custom classes, use kebab-case.

### React & Next.js

- Prefer server components by default. Only add `'use client'` when you need interactivity, browser APIs, or React hooks.
- Use Next.js App Router conventions: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`.
- Co-locate components with the routes that use them when they are single-use. Shared components go in `components/`.
- Use `async` server components for data fetching. Avoid `useEffect` for fetching data.

### Tailwind CSS & shadcn/ui

- Use Tailwind utility classes directly. Avoid custom CSS unless absolutely necessary.
- Use the `cn()` utility from `lib/utils.ts` for conditional class merging.
- Import shadcn/ui components from `@/components/ui/`. Do not modify generated component files -- extend via wrapper components instead.
- Respect Nextra's CSS cascade layers. Import `nextra-theme-docs/style.css` before `globals.css` in the root layout.

### Error Handling

- Use early returns for guard clauses. Avoid deeply nested conditionals.
- API routes: return proper HTTP status codes with JSON error bodies (`{ error: string }`).
- Never swallow errors silently. Log with context or re-throw.
- Use `NextResponse.json()` for API responses with appropriate status codes.

### Formatting

- 2-space indentation for all files (TS, TSX, JSON, MDX, CSS).
- Single quotes for strings in TypeScript/JavaScript.
- Trailing commas in multi-line objects, arrays, and function parameters.
- No semicolons (unless Prettier/project config says otherwise).
- Max line length: 100 characters as a soft guideline.

## Content (MDX Prompts) Conventions

All prompt files live in `content/` as `.mdx` files and follow the template from `CONTRIBUTING.md`:

```
# [Prompt Title]
[One-line description]
---
## Context
## Instructions
## Output Format
## Interactive Decisions
```

- **File naming:** kebab-case, prefixed with action verb (`generate-`, `review-`, `fix-`, `migrate-`).
- **Categories:** `review/`, `debug/`, `refactor/`, `testing/`, `documentation/`, `architecture/`, `security/`, `planning/`, `language-specific/{lang}/`.
- **Sidebar config:** Every directory needs a `_meta.ts` exporting title mappings.
- When adding a new prompt, also update `public/llms.txt` and the `content/_meta.ts` for the relevant category.

## Git Conventions

- **Branch naming:** descriptive kebab-case, prefixed with action (`add-`, `fix-`, `update-`, `refactor-`).
- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/) format, lowercase:
  ```
  feat: add security audit prompt for smart contracts
  fix: correct sidebar ordering for language-specific section
  refactor: extract prompt metadata parser to shared utility
  docs: update README with API endpoint documentation
  ```
- **Workflow:** GitHub Flow -- branch from `main`, open PR, merge back to `main`.
- **Default branch:** `main`.

## AI Access Endpoints

These endpoints make the site LLM-friendly. Keep them updated when content changes:

| Endpoint | Purpose |
|----------|---------|
| `GET /llms.txt` | Site overview per [llms.txt spec](https://llmstxt.org/) |
| `GET /llms-full.txt` | All prompt content in one file (XML `<source>` tags) |
| `GET /api/prompts` | JSON catalog of all prompts with metadata |
| `GET /api/prompts/{category}/{slug}` | Raw markdown for a single prompt |

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout -- Nextra theme, navbar, footer, global styles |
| `app/[[...mdxPath]]/page.tsx` | Catch-all renderer for `content/` directory MDX files |
| `mdx-components.tsx` | Nextra MDX component setup (required by Nextra v4) |
| `next.config.mjs` | Nextra plugin wrapper + `output: 'standalone'` for Docker |
| `content/_meta.ts` | Root sidebar structure with separators and ordering |
| `public/llms.txt` | Static llms.txt -- must list all prompts with descriptions |
| `CONTRIBUTING.md` | Prompt authoring guidelines and quality checklist |
