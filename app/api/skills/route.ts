import { NextResponse } from 'next/server'

import { getAllSkills } from '@/lib/skills'

export const dynamic = 'force-static'

export function GET() {
  const skills = getAllSkills()

  return NextResponse.json({
    total: skills.length,
    skills,
  })
}
