import { NextRequest, NextResponse } from 'next/server'
import { getRuntimeContext } from '@/lib/oli/registry'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
