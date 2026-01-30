import { getSkillBySlug } from '@/lib/skills'

interface SkillPageProps {
  slug: string
}

export function SkillPage({ slug }: SkillPageProps) {
  const skill = getSkillBySlug(slug)

  if (!skill) {
    return <p>Skill not found: {slug}</p>
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <a
          href={skill.apiUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.875rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--nextra-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          View API
        </a>
        <a
          href={skill.downloadUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.875rem',
            padding: '0.375rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--nextra-border)',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Download .skill
        </a>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: renderMarkdownToHtml(skill.content),
        }}
      />
    </div>
  )
}

/**
 * Minimal markdown-to-HTML renderer for skill content.
 * Handles headings, paragraphs, code blocks, lists, tables,
 * bold, italic, links, and horizontal rules.
 */
function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split('\n')
  const html: string[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let codeLang = ''
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'
  let inTable = false
  let tableRows: string[] = []

  function processInline(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  }

  function flushTable() {
    if (!inTable || tableRows.length === 0) return
    const headerRow = tableRows[0]
    const dataRows = tableRows.slice(2) // skip separator row
    const headerCells = headerRow
      .split('|')
      .slice(1, -1)
      .map((c) => `<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--nextra-border)">${processInline(c.trim())}</th>`)
    let tableHtml = '<table style="width:100%;border-collapse:collapse;margin:1rem 0"><thead><tr>'
    tableHtml += headerCells.join('')
    tableHtml += '</tr></thead><tbody>'
    for (const row of dataRows) {
      const cells = row
        .split('|')
        .slice(1, -1)
        .map((c) => `<td style="padding:0.5rem;border-bottom:1px solid var(--nextra-border)">${processInline(c.trim())}</td>`)
      tableHtml += `<tr>${cells.join('')}</tr>`
    }
    tableHtml += '</tbody></table>'
    html.push(tableHtml)
    inTable = false
    tableRows = []
  }

  function flushList() {
    if (inList) {
      html.push(`</${listType}>`)
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.trimStart().startsWith('```')) {
      if (!inCodeBlock) {
        flushList()
        flushTable()
        inCodeBlock = true
        codeLang = line.trimStart().slice(3).trim()
        codeContent = []
      } else {
        const escaped = codeContent
          .join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        const langAttr = codeLang ? ` data-language="${codeLang}"` : ''
        html.push(`<pre${langAttr}><code>${escaped}</code></pre>`)
        inCodeBlock = false
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList()
      if (!inTable) {
        inTable = true
        tableRows = []
      }
      tableRows.push(line.trim())
      continue
    } else if (inTable) {
      flushTable()
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushList()
      const level = headingMatch[1].length
      const text = processInline(headingMatch[2])
      html.push(`<h${level}>${text}</h${level}>`)
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList()
      html.push('<hr />')
      continue
    }

    // Unordered list items
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)$/)
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList()
        html.push('<ul>')
        inList = true
        listType = 'ul'
      }
      html.push(`<li>${processInline(ulMatch[2])}</li>`)
      continue
    }

    // Ordered list items
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/)
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList()
        html.push('<ol>')
        inList = true
        listType = 'ol'
      }
      html.push(`<li>${processInline(olMatch[2])}</li>`)
      continue
    }

    // Checkbox list items
    const checkMatch = line.match(/^(\s*)[-*]\s+\[([ x])\]\s+(.+)$/)
    if (checkMatch) {
      if (!inList || listType !== 'ul') {
        flushList()
        html.push('<ul style="list-style:none;padding-left:0">')
        inList = true
        listType = 'ul'
      }
      const checked = checkMatch[2] === 'x' ? ' checked disabled' : ' disabled'
      html.push(
        `<li><input type="checkbox"${checked} /> ${processInline(checkMatch[3])}</li>`,
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      flushList()
      continue
    }

    // Regular paragraph
    flushList()
    html.push(`<p>${processInline(line)}</p>`)
  }

  flushList()
  flushTable()

  return html.join('\n')
}
