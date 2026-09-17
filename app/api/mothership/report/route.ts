import { NextResponse } from 'next/server'
import { buildMothershipReport } from '@/lib/mothership/report'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Read-only metrics feed for the Mothership Commander Hub.
// The Hub polls this with `Authorization: Bearer <MOTHERSHIP_REPORT_TOKEN>`.
// No mutation surface, no PII — aggregate counts only.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

export async function GET(request: Request) {
  const token = process.env.MOTHERSHIP_REPORT_TOKEN

  if (!token) {
    return NextResponse.json(
      { error: 'Reporting endpoint is not configured. Set MOTHERSHIP_REPORT_TOKEN.' },
      { status: 503 },
    )
  }

  const header = request.headers.get('authorization') ?? ''
  const provided = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7).trim()
    : ''

  if (!provided || !timingSafeEqual(provided, token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const report = await buildMothershipReport()
    return NextResponse.json(report, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('[v0] mothership report failed:', err)
    return NextResponse.json({ error: 'Failed to build report.' }, { status: 500 })
  }
}
