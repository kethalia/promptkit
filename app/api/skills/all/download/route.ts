import fs from 'node:fs'
import path from 'node:path'

import { NextResponse } from 'next/server'

import { getAllSkills } from '@/lib/skills'

const SKILLS_DIR = path.join(process.cwd(), 'skills')

export const dynamic = 'force-dynamic'

/**
 * GET /api/skills/all/download
 * Returns a zip file containing all pre-built .skill files.
 * Uses dynamic import for archiver since it's only needed here.
 */
export async function GET() {
  const skills = getAllSkills()

  if (skills.length === 0) {
    return NextResponse.json(
      { error: 'No skills found' },
      { status: 404 },
    )
  }

  // Collect all .skill files that exist
  const skillFiles: { slug: string; filePath: string }[] = []
  for (const skill of skills) {
    const filePath = path.join(SKILLS_DIR, `${skill.slug}.skill`)
    if (fs.existsSync(filePath)) {
      skillFiles.push({ slug: skill.slug, filePath })
    }
  }

  if (skillFiles.length === 0) {
    return NextResponse.json(
      { error: 'No skill files found' },
      { status: 404 },
    )
  }

  // Use archiver to bundle all .skill files into a single zip
  const archiver = (await import('archiver')).default
  const { PassThrough } = await import('node:stream')

  const chunks: Buffer[] = []
  const passthrough = new PassThrough()

  passthrough.on('data', (chunk: Buffer) => chunks.push(chunk))

  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(passthrough)

  for (const { slug, filePath } of skillFiles) {
    archive.file(filePath, { name: `${slug}.skill` })
  }

  await archive.finalize()
  await new Promise<void>((resolve) => passthrough.on('end', resolve))

  const zipBuffer = Buffer.concat(chunks)

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="all-skills.zip"',
      'Content-Length': String(zipBuffer.length),
    },
  })
}
