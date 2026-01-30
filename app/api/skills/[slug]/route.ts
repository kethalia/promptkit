import { NextRequest, NextResponse } from 'next/server'

import { getAllSkills, getSkillBySlug } from '@/lib/skills'

export function generateStaticParams() {
  const skills = getAllSkills()
  return skills.map((s) => ({ slug: s.slug }))
}

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return params.then((resolved) => {
    const skill = getSkillBySlug(resolved.slug)

    if (!skill) {
      return NextResponse.json(
        { error: `Skill not found: ${resolved.slug}` },
        { status: 404 },
      )
    }

    const accept = request.headers.get('accept') ?? ''
    const wantsJson = accept.includes('application/json')

    if (wantsJson) {
      return NextResponse.json({
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        url: skill.url,
        downloadUrl: skill.downloadUrl,
        content: skill.content,
      })
    }

    return new NextResponse(skill.content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  })
}
