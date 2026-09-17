import { NextRequest, NextResponse } from 'next/server'
import { routeOliCommand } from '@/lib/oli/command-router'
import { checkOliRateLimit, oliRateLimitHeaders, OLI_RATE_LIMITS } from '@/lib/oli/rate-limit'
import { getSession, isAdminEmail } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const rate = checkOliRateLimit(request, OLI_RATE_LIMITS.command)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many Oli requests. Please try again shortly.' },
      { status: 429, headers: { ...oliRateLimitHeaders(rate), 'Cache-Control': 'no-store' } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400, headers: oliRateLimitHeaders(rate) },
    )
  }

  const input = body as { message?: unknown; appId?: unknown; pathname?: unknown }
  const message = typeof input.message === 'string' ? input.message.trim() : ''

  if (!message) {
    return NextResponse.json(
      { error: 'message is required.' },
      { status: 400, headers: oliRateLimitHeaders(rate) },
    )
  }

  if (message.length > 4000) {
    return NextResponse.json(
      { error: 'message must be 4000 characters or fewer.' },
      { status: 413, headers: oliRateLimitHeaders(rate) },
    )
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

  return NextResponse.json(response, {
    headers: { ...oliRateLimitHeaders(rate), 'Cache-Control': 'no-store' },
  })
}
