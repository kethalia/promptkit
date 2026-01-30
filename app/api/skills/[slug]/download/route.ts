import fs from 'node:fs'
import path from 'node:path'

import { NextResponse } from 'next/server'

const SKILLS_DIR = path.join(process.cwd(), 'skills')

export const dynamic = 'force-dynamic'

/**
 * GET /api/skills/{slug}/download
 * Returns a pre-built .skill file for a single skill.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const filePath = path.join(SKILLS_DIR, `${slug}.skill`)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `Skill not found: ${slug}` },
      { status: 404 },
    )
  }

  const buffer = fs.readFileSync(filePath)

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.skill"`,
      'Content-Length': String(buffer.length),
    },
  })
}
