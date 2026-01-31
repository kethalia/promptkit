# PromptKit

A curated collection of reusable AI coding prompts and agent skills, served as a documentation site with AI/LLM-optimized access. Built with Fumadocs, optimized for [opencode](https://opencode.ai) and Claude.

## Quick Start

```bash
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Docker Deployment

```bash
# Build and run with Compose
docker compose up -d

# Or build and run manually
docker build -t promptkit .
docker run -p 3000:3000 promptkit
```

## AI / LLM Access

All prompts are accessible programmatically for AI agents and tools.

| Endpoint | Format | Description |
|----------|--------|-------------|
| `GET /llms.txt` | text | Site overview following the [llms.txt spec](https://llmstxt.org/) |
| `GET /llms-full.txt` | text | All prompt content concatenated with XML `<source>` tags |
| `GET /api/prompts` | JSON | Catalog of all prompts with metadata |
| `GET /api/prompts/{category}/{slug}` | markdown | Raw content for a single prompt |
| `GET /api/skills` | JSON | Catalog of all agent skills |
| `GET /api/skills/{slug}/download` | zip | Download a single `.skill` file |

### Examples

```bash
# Fetch the prompt catalog
curl http://localhost:3000/api/prompts

# Get a specific prompt as raw markdown
curl http://localhost:3000/api/prompts/review/pr-review

# Get a specific prompt as JSON (with metadata)
curl -H "Accept: application/json" http://localhost:3000/api/prompts/review/pr-review

# Fetch all prompts at once for LLM ingestion
curl http://localhost:3000/llms-full.txt
```

## Project Structure

```
content/docs/               # MDX prompt files (source of truth)
  meta.json                 # Sidebar configuration
  index.mdx                 # Docs landing page
  {category}/               # Prompt categories (review/, debug/, etc.)
    index.mdx               # Category landing page
    {prompt}.mdx            # Individual prompt files
  skills/                   # Agent skill definitions
    {skill}/index.mdx       # Skill overview
    {skill}/references/     # Reference material
app/                        # Next.js App Router
  (home)/page.tsx           # Homepage
  docs/layout.tsx           # Docs layout (Fumadocs)
  llms-full.txt/route.ts    # Full LLM context endpoint
  api/prompts/              # REST API for prompts
  api/skills/               # REST API for skills
components/ui/              # shadcn/ui components
lib/                        # Shared utilities
public/llms.txt             # llms.txt standard file
skills/                     # Pre-built .skill download files
```

## Adding Prompts

Add `.mdx` files to `content/docs/` following the template in [CONTRIBUTING.md](CONTRIBUTING.md). Each prompt should have:

1. An H1 title and one-line description
2. Sections for Context, Instructions, Output Format, and Interactive Decisions
3. An entry in the category's `meta.json` for sidebar ordering

## Tech Stack

- [Next.js 16](https://nextjs.org/) -- App Router, standalone output
- [Fumadocs](https://fumadocs.vercel.app/) -- MDX docs framework
- [Tailwind CSS v4](https://tailwindcss.com/) -- Utility-first styling
- [Docker](https://www.docker.com/) -- Multi-stage Alpine build for self-hosting

## License

MIT
