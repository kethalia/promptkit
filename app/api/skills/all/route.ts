import { NextResponse } from 'next/server'

import { getAllSkillsWithContent } from '@/lib/skills'

export const dynamic = 'force-static'

export function GET() {
  const skills = getAllSkillsWithContent()

  return NextResponse.json({
    total: skills.length,
    skills,
  })
}
