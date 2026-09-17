import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeContext } from '@/lib/oli/registry'
import { checkOliRateLimit, oliRateLimitHeaders, OLI_RATE_LIMITS } from '@/lib/oli/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const rate = checkOliRateLimit(request, OLI_RATE_LIMITS.context)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many context requests. Please try again shortly.' },
      { status: 429, headers: { ...oliRateLimitHeaders(rate), 'Cache-Control': 'no-store' } },
    )
  }

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || undefined
  const appId = request.nextUrl.searchParams.get('app') || undefined
  const context = getRuntimeContext({ host, appId })

  return NextResponse.json(
    {
      app: {
        id: context.app.id,
        name: context.app.name,
        audience: context.app.audience,
        domain: context.app.domain,
        designFamily: context.app.designFamily,
        supportMode: context.app.supportMode,
      },
      registry: {
        repositories: context.repositoryCount,
        deploymentProjects: context.deploymentProjectCount,
        verifiedAt: context.verifiedAt,
      },
      capabilities: context.capabilities.map((capability) => ({
        id: capability.id,
        name: capability.name,
        state: capability.state,
        description: capability.description,
      })),
    },
    { headers: { ...oliRateLimitHeaders(rate), 'Cache-Control': 'no-store' } },
  )
}
