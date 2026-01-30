import { NextResponse } from 'next/server'
import archiver from 'archiver'
import { PassThrough } from 'node:stream'

import { getSkillDirPath } from '@/lib/skills'

export const dynamic = 'force-dynamic'

/**
 * GET /api/skills/{slug}/download
 * Returns a .skill file (zip archive) for a single skill.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  const dirPath = getSkillDirPath(slug)

  if (!dirPath) {
    return NextResponse.json(
      { error: `Skill not found: ${slug}` },
      { status: 404 },
    )
  }

  const chunks: Buffer[] = []
  const passthrough = new PassThrough()

  passthrough.on('data', (chunk: Buffer) => chunks.push(chunk))

  const archive = archiver('zip', { zlib: { level: 9 } })
  archive.pipe(passthrough)
  archive.directory(dirPath, slug)
  await archive.finalize()

  // Wait for passthrough stream to finish
  await new Promise<void>((resolve) => passthrough.on('end', resolve))

  const zipBuffer = Buffer.concat(chunks)

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.skill"`,
      'Content-Length': String(zipBuffer.length),
    },
  })
}
