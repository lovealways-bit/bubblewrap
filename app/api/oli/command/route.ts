import { NextRequest, NextResponse } from 'next/server'
import { routeOliCommand } from '@/lib/oli/command-router'
import { getSession, isAdminEmail } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const input = body as { message?: unknown; appId?: unknown; pathname?: unknown }
  const message = typeof input.message === 'string' ? input.message.trim() : ''

  if (!message) {
    return NextResponse.json({ error: 'message is required.' }, { status: 400 })
  }

  if (message.length > 4000) {
    return NextResponse.json({ error: 'message must be 4000 characters or fewer.' }, { status: 413 })
  }

  const session = await getSession()
  const isAdmin = Boolean(session?.user?.email && isAdminEmail(session.user.email))
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || undefined

  const response = routeOliCommand({
    message,
    host,
    appId: typeof input.appId === 'string' ? input.appId : undefined,
    pathname: typeof input.pathname === 'string' ? input.pathname : undefined,
    isAdmin,
  })

  return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } })
}
