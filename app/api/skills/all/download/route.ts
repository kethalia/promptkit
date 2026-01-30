import { NextResponse } from 'next/server'
import archiver from 'archiver'
import { PassThrough } from 'node:stream'

import { getAllSkillDirPaths } from '@/lib/skills'

export const dynamic = 'force-dynamic'

/**
 * Create a .skill archive (zip) for a single skill directory.
 * Returns a Buffer containing the zip data.
 */
async function createSkillBuffer(
  slug: string,
  dirPath: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const passthrough = new PassThrough()

    passthrough.on('data', (chunk: Buffer) => chunks.push(chunk))
    passthrough.on('end', () => resolve(Buffer.concat(chunks)))
    passthrough.on('error', reject)

    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.on('error', reject)
    archive.pipe(passthrough)
    archive.directory(dirPath, slug)
    archive.finalize()
  })
}

/**
 * GET /api/skills/all/download
 * Returns a zip file containing all .skill files.
 */
export async function GET() {
  const skillDirs = getAllSkillDirPaths()

  if (skillDirs.length === 0) {
    return NextResponse.json(
      { error: 'No skills found' },
      { status: 404 },
    )
  }

  const outerChunks: Buffer[] = []
  const passthrough = new PassThrough()

  passthrough.on('data', (chunk: Buffer) => outerChunks.push(chunk))

  const outerArchive = archiver('zip', { zlib: { level: 9 } })
  outerArchive.pipe(passthrough)

  for (const { slug, dirPath } of skillDirs) {
    const skillBuffer = await createSkillBuffer(slug, dirPath)
    outerArchive.append(skillBuffer, { name: `${slug}.skill` })
  }

  await outerArchive.finalize()

  // Wait for passthrough stream to finish
  await new Promise<void>((resolve) => passthrough.on('end', resolve))

  const zipBuffer = Buffer.concat(outerChunks)

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="all-skills.zip"',
      'Content-Length': String(zipBuffer.length),
    },
  })
}
