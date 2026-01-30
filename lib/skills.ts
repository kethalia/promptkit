import fs from 'node:fs'
import path from 'node:path'

const SKILLS_DIR = path.join(process.cwd(), 'content', 'skills')

export interface SkillInfo {
  slug: string
  name: string
  description: string
  url: string
  apiUrl: string
  downloadUrl: string
}

export interface SkillContent extends SkillInfo {
  content: string
}

interface SkillFrontmatter {
  name: string
  description: string
  body: string
}

/**
 * Parse YAML frontmatter and body from a SKILL.md file.
 * Expects the format:
 * ---
 * name: skill-name
 * description: ...
 * ---
 * [markdown body]
 */
function parseFrontmatter(raw: string): SkillFrontmatter {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = raw.match(frontmatterRegex)

  if (!match) {
    return { name: '', description: '', body: raw }
  }

  const [, frontmatter, body] = match
  let name = ''
  let description = ''

  for (const line of frontmatter.split('\n')) {
    const nameMatch = line.match(/^name:\s*(.+)$/)
    if (nameMatch) {
      name = nameMatch[1].trim()
      continue
    }
    const descMatch = line.match(/^description:\s*(.+)$/)
    if (descMatch) {
      description = descMatch[1].trim()
    }
  }

  return { name, description, body: body.trim() }
}

/**
 * Collect all skill directory names under content/skills/.
 * A valid skill directory must contain a SKILL.md file.
 */
function collectSkillDirs(): string[] {
  if (!fs.existsSync(SKILLS_DIR)) {
    return []
  }

  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })

  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false
      const skillFile = path.join(SKILLS_DIR, entry.name, 'SKILL.md')
      return fs.existsSync(skillFile)
    })
    .map((entry) => entry.name)
    .sort()
}

/**
 * Collect all reference files within a skill directory.
 * Recursively finds all .md files under references/.
 */
function collectReferenceFiles(
  dir: string,
  basePath = '',
): { filePath: string; relativePath: string }[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results: { filePath: string; relativePath: string }[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relPath = basePath ? `${basePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      results.push(...collectReferenceFiles(fullPath, relPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({ filePath: fullPath, relativePath: relPath })
    }
  }

  return results.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
}

/**
 * Assemble the full inline content for a skill.
 * Combines the SKILL.md body with all reference files appended at the end.
 */
function assembleInlineContent(slug: string): string {
  const skillDir = path.join(SKILLS_DIR, slug)
  const skillFile = path.join(skillDir, 'SKILL.md')
  const raw = fs.readFileSync(skillFile, 'utf-8')
  const { body } = parseFrontmatter(raw)

  const refsDir = path.join(skillDir, 'references')
  const refFiles = collectReferenceFiles(refsDir)

  if (refFiles.length === 0) {
    return body
  }

  const sections = [body, '']

  for (const ref of refFiles) {
    const refName = ref.relativePath.replace(/\.md$/, '')
    const refContent = fs.readFileSync(ref.filePath, 'utf-8').trim()
    sections.push(`---`, '', `## Reference: ${refName}`, '', refContent, '')
  }

  return sections.join('\n').trim()
}

/**
 * Build a SkillInfo object from a slug and parsed frontmatter.
 */
function buildSkillInfo(slug: string, fm: SkillFrontmatter): SkillInfo {
  return {
    slug,
    name: fm.name || slug,
    description: fm.description,
    url: `/docs/skills/${slug}`,
    apiUrl: `/api/skills/${slug}`,
    downloadUrl: `/api/skills/${slug}/download`,
  }
}

/**
 * Get metadata for all skills without loading full content.
 */
export function getAllSkills(): SkillInfo[] {
  const dirs = collectSkillDirs()

  return dirs.map((slug) => {
    const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8')
    const fm = parseFrontmatter(raw)
    return buildSkillInfo(slug, fm)
  })
}

/**
 * Get all skills with their full assembled inline content.
 */
export function getAllSkillsWithContent(): SkillContent[] {
  const dirs = collectSkillDirs()

  return dirs.map((slug) => {
    const raw = fs.readFileSync(path.join(SKILLS_DIR, slug, 'SKILL.md'), 'utf-8')
    const fm = parseFrontmatter(raw)
    const content = assembleInlineContent(slug)
    return { ...buildSkillInfo(slug, fm), content }
  })
}

/**
 * Get a single skill by its slug with full assembled inline content.
 * Returns null if not found.
 */
export function getSkillBySlug(slug: string): SkillContent | null {
  const skillFile = path.join(SKILLS_DIR, slug, 'SKILL.md')

  if (!fs.existsSync(skillFile)) {
    return null
  }

  const raw = fs.readFileSync(skillFile, 'utf-8')
  const fm = parseFrontmatter(raw)
  const content = assembleInlineContent(slug)

  return { ...buildSkillInfo(slug, fm), content }
}

/**
 * Get the absolute path to a skill directory.
 * Used by download routes to create .skill archives.
 */
export function getSkillDirPath(slug: string): string | null {
  const dirPath = path.join(SKILLS_DIR, slug)
  const skillFile = path.join(dirPath, 'SKILL.md')

  if (!fs.existsSync(skillFile)) {
    return null
  }

  return dirPath
}

/**
 * Get all skill directory paths.
 * Used by the bulk download route.
 */
export function getAllSkillDirPaths(): { slug: string; dirPath: string }[] {
  const dirs = collectSkillDirs()

  return dirs.map((slug) => ({
    slug,
    dirPath: path.join(SKILLS_DIR, slug),
  }))
}
