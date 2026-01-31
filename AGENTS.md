# AGENTS.md

Guidelines for AI coding agents operating in this repository.

## Project Overview

A collection of reusable AI coding prompts transformed into a **Fumadocs** documentation site with AI/LLM-optimized access. Stack: Next.js 15 (App Router), Fumadocs, Tailwind CSS v4, shadcn/ui, Docker for self-hosting.

Project management is done via **GitHub Issues**. Reference the epic (#4) and sub-issues for all planned work. Always check open issues before starting work, and reference issue numbers in commits.

## Build / Dev / Test Commands

```bash
# Install dependencies (uses pnpm — see packageManager in package.json)
pnpm install

# Development (Turbopack)
pnpm dev                 # starts Next.js dev server on :3000

# Production build
pnpm build               # builds Next.js (standalone output)
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
  layout.tsx                # Root layout (Fumadocs provider, global styles)
  globals.css               # Tailwind CSS imports
  (home)/page.tsx           # Homepage route
  docs/[[...slug]]/page.tsx # Catch-all MDX renderer (content/docs/ directory)
  llms-full.txt/route.ts    # Full LLM context endpoint
  api/prompts/              # REST API for programmatic prompt access
  api/skills/               # REST API for skills access and downloads
content/docs/               # MDX content (Fumadocs content directory)
  meta.json                 # Root sidebar configuration
  index.mdx                 # Docs landing page
  {category}/               # Prompt categories (review/, debug/, etc.)
    meta.json               # Sidebar config per category
    {prompt}.mdx            # Individual prompt files
  skills/                   # Agent Skills content
    meta.json               # Skills sidebar config
    index.mdx               # Skills landing page
    {skill}/                # Individual skill directories
      index.mdx             # Skill page (frontmatter: title, name, description)
      references/           # Reference documents
        meta.json           # References sidebar config
        {reference}.md      # Reference files (plain markdown)
skills/                     # Pre-built .skill files (zip archives for download API)
components/ui/              # shadcn/ui components
lib/                        # Shared utilities (cn(), prompt/skill helpers)
  source.ts                 # Fumadocs content source loader
  prompts.ts                # Prompt discovery and metadata
  skills.ts                 # Skill discovery, assembly, and metadata
public/llms.txt             # llms.txt standard file
source.config.ts            # Fumadocs MDX collection config
mdx-components.tsx          # Fumadocs MDX component configuration
next.config.mjs             # Next.js + Fumadocs MDX config (standalone output)
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
- Fumadocs handles CSS via its `RootProvider`. Import `globals.css` in the root layout after Fumadocs styles.

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
- **Sidebar config:** Every directory needs a `meta.json` for sidebar configuration.
- When adding a new prompt, also update `public/llms.txt` and the `content/docs/meta.json` for the relevant category.

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
| `GET /api/skills` | JSON catalog of all skills with metadata |
| `GET /api/skills/all` | All skills with full inline content |
| `GET /api/skills/all/download` | Download all `.skill` files as zip |
| `GET /api/skills/{slug}` | Single skill content (markdown or JSON) |
| `GET /api/skills/{slug}/download` | Download a single `.skill` file |

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout -- Fumadocs provider, global styles |
| `app/docs/[[...slug]]/page.tsx` | Catch-all renderer for `content/docs/` directory MDX files |
| `mdx-components.tsx` | Fumadocs MDX component setup |
| `next.config.mjs` | Fumadocs MDX plugin + `output: 'standalone'` for Docker |
| `source.config.ts` | Fumadocs MDX collection config |
| `lib/source.ts` | Fumadocs content source loader |
| `content/docs/meta.json` | Root sidebar structure with separators and ordering |
| `public/llms.txt` | Static llms.txt -- must list all prompts and skills with descriptions |
| `CONTRIBUTING.md` | Prompt authoring guidelines and quality checklist |
