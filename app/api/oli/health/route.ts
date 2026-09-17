import { NextResponse } from 'next/server'
import { capabilities, deploymentProjects, repositories } from '@/lib/oli/registry'

export const dynamic = 'force-dynamic'

export async function GET() {
  const counts = capabilities.reduce<Record<string, number>>((acc, capability) => {
    acc[capability.state] = (acc[capability.state] || 0) + 1
    return acc
  }, {})

  return NextResponse.json(
    {
      service: 'oli-commander-runtime',
      status: 'ok',
      manuscript: 'commander/MANUSCRIPT.md',
      registry: {
        repositories: repositories.length,
        deploymentProjects: deploymentProjects.length,
      },
      capabilityStates: counts,
      providerMode: 'subscription-first',
      providerConnected: false,
      providerMessage:
        'Shared generative/search providers are intentionally not marked connected until approved entitlement, credentials, privacy configuration, and budget are verified.',
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
