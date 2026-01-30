import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'docs')

export interface PromptInfo {
  slug: string
  category: string
  title: string
  description: string
  url: string
  apiUrl: string
}

interface PromptContent extends PromptInfo {
  content: string
}

/**
 * Strip YAML frontmatter from content if present.
 */
function stripFrontmatter(content: string): string {
  const match = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/)
  return match ? match[1].trimStart() : content
}

/**
 * Extract the H1 title and first-line description from MDX content.
 * Handles files with or without YAML frontmatter.
 */
function parsePromptHeader(content: string): { title: string; description: string } {
  const body = stripFrontmatter(content)
  const lines = body.split('\n')
  let title = ''
  let description = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!title && line.startsWith('# ')) {
      title = line.slice(2).trim()
    } else if (title && !description && line.length > 0 && !line.startsWith('#') && !line.startsWith('---')) {
      description = line
      break
    }
  }

  return { title, description }
}

/**
 * Directories to exclude from prompt collection.
 * Skills have their own dedicated API and are not prompts.
 */
const EXCLUDED_DIRS = new Set(['skills'])

/**
 * Recursively collect all .mdx prompt files from a directory,
 * excluding index.mdx files and excluded directories.
 */
function collectMdxFiles(dir: string, basePath = ''): { filePath: string; relativePath: string }[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results: { filePath: string; relativePath: string }[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      if (!basePath && EXCLUDED_DIRS.has(entry.name)) continue
      results.push(...collectMdxFiles(fullPath, relPath))
    } else if (entry.isFile() && entry.name.endsWith('.mdx') && entry.name !== 'index.mdx') {
      results.push({ filePath: fullPath, relativePath: relPath })
    }
  }

  return results
}

/**
 * Get metadata for all prompts without loading full content.
 */
export function getAllPrompts(): PromptInfo[] {
  const files = collectMdxFiles(CONTENT_DIR)

  return files.map(({ filePath, relativePath }) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { title, description } = parsePromptHeader(content)
    const slugPath = relativePath.replace(/\.mdx$/, '')
    const parts = slugPath.split('/')
    const slug = parts[parts.length - 1]
    const category = parts.slice(0, -1).join('/')

    return {
      slug,
      category,
      title,
      description,
      url: `/docs/${slugPath}`,
      apiUrl: `/api/prompts/${slugPath}`,
    }
  }).sort((a, b) => {
    const catCmp = a.category.localeCompare(b.category)
    return catCmp !== 0 ? catCmp : a.slug.localeCompare(b.slug)
  })
}

/**
 * Get all prompts with their full MDX content.
 * Content is returned with frontmatter stripped.
 */
export function getAllPromptsWithContent(): PromptContent[] {
  const files = collectMdxFiles(CONTENT_DIR)

  return files.map(({ filePath, relativePath }) => {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { title, description } = parsePromptHeader(raw)
    const content = stripFrontmatter(raw)
    const slugPath = relativePath.replace(/\.mdx$/, '')
    const parts = slugPath.split('/')
    const slug = parts[parts.length - 1]
    const category = parts.slice(0, -1).join('/')

    return {
      slug,
      category,
      title,
      description,
      content,
      url: `/docs/${slugPath}`,
      apiUrl: `/api/prompts/${slugPath}`,
    }
  }).sort((a, b) => {
    const catCmp = a.category.localeCompare(b.category)
    return catCmp !== 0 ? catCmp : a.slug.localeCompare(b.slug)
  })
}

/**
 * Get a single prompt by its slug path (e.g. "review/pr-review").
 * Returns null if not found. Content is returned with frontmatter stripped.
 */
export function getPromptBySlug(slugPath: string): PromptContent | null {
  const filePath = path.join(CONTENT_DIR, `${slugPath}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { title, description } = parsePromptHeader(raw)
  const content = stripFrontmatter(raw)
  const parts = slugPath.split('/')
  const slug = parts[parts.length - 1]
  const category = parts.slice(0, -1).join('/')

  return {
    slug,
    category,
    title,
    description,
    content,
    url: `/docs/${slugPath}`,
    apiUrl: `/api/prompts/${slugPath}`,
  }
}
