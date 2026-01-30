import { NextRequest, NextResponse } from 'next/server'

import { getAllPromptsWithContent, getPromptBySlug } from '@/lib/prompts'

export function generateStaticParams() {
  const prompts = getAllPromptsWithContent()
  return prompts.map((p) => ({
    slug: `${p.category}/${p.slug}`.split('/'),
  }))
}

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  return params.then((resolved) => {
    const slugPath = resolved.slug.join('/')
    const prompt = getPromptBySlug(slugPath)

    if (!prompt) {
      return NextResponse.json(
        { error: `Prompt not found: ${slugPath}` },
        { status: 404 },
      )
    }

    const accept = request.headers.get('accept') ?? ''
    const wantsJson = accept.includes('application/json')

    if (wantsJson) {
      return NextResponse.json({
        slug: prompt.slug,
        category: prompt.category,
        title: prompt.title,
        description: prompt.description,
        url: prompt.url,
        content: prompt.content,
      })
    }

    return new NextResponse(prompt.content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  })
}
