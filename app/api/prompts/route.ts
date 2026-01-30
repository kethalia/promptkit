import { NextResponse } from 'next/server'

import { getAllPrompts } from '@/lib/prompts'

export const dynamic = 'force-static'

export function GET() {
  const prompts = getAllPrompts()

  const categories = [...new Set(prompts.map((p) => p.category))].sort()

  return NextResponse.json({
    total: prompts.length,
    categories,
    prompts,
  })
}
