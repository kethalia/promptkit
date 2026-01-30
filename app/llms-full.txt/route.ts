import { NextResponse } from 'next/server'

import { getAllPromptsWithContent } from '@/lib/prompts'

export const dynamic = 'force-static'

export function GET() {
  const prompts = getAllPromptsWithContent()

  const lines = [
    '# AI Prompts for Coding — Full Content',
    '',
    '> All prompts concatenated for LLM ingestion.',
    '> See /llms.txt for the index or /api/prompts for the JSON catalog.',
    '',
  ]

  for (const prompt of prompts) {
    lines.push(
      `<source url="${prompt.url}" category="${prompt.category}" slug="${prompt.slug}">`,
      prompt.content.trim(),
      '</source>',
      '',
    )
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
