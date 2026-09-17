import 'server-only'
import { getSession, isAdminEmail } from '@/lib/session'

export type OliAccessRole = 'PUBLIC_USER' | 'SIGNED_IN_USER' | 'ADMIN' | 'DEVELOPER'

export type OliSurfacePolicy = {
  id: string
  publicPath?: string
  adminPath?: string
  developerOnly: boolean
  customerVisible: boolean
  description: string
}

export const OLI_SURFACE_POLICIES: OliSurfacePolicy[] = [
  {
    id: 'customer-commander',
    publicPath: '/',
    developerOnly: false,
    customerVisible: true,
    description: 'Customer-facing Oli guidance, navigation, approved tools, and subscription-aware help.',
  },
  {
    id: 'account',
    publicPath: '/account',
    developerOnly: false,
    customerVisible: true,
    description: 'Signed-in account, entitlements, privacy choices, saved work, and user-owned content.',
  },
  {
    id: 'commander-training-hub',
    adminPath: '/oli',
    developerOnly: false,
    customerVisible: false,
    description: 'Admin-only Commander runtime, capability state, source registry, and Manuscript controls.',
  },
  {
    id: 'music-commander-admin',
    adminPath: '/oli/music',
    developerOnly: false,
    customerVisible: false,
    description: 'Admin-only Music Oli connector, cost, MIDI, production, and rights-aware capability console.',
  },
  {
    id: 'design-closet',
    adminPath: '/oli/design-closet',
    developerOnly: false,
    customerVisible: false,
    description: 'Admin-only approved-design source shelf and candidate/version routing surface.',
  },
  {
    id: 'developer-diagnostics',
    adminPath: '/oli/dev',
    developerOnly: true,
    customerVisible: false,
    description: 'Developer-only runtime diagnostics, provider configuration state, raw capability checks, and repository/deployment traces.',
  },
]

export async function getOliAccessRole(): Promise<OliAccessRole> {
  const session = await getSession()
  if (!session?.user) return 'PUBLIC_USER'
  if (isAdminEmail(session.user.email)) {
    const developers = (process.env.DEVELOPER_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)

    return session.user.email && developers.includes(session.user.email.toLowerCase())
      ? 'DEVELOPER'
      : 'ADMIN'
  }
  return 'SIGNED_IN_USER'
}

export function canAccessOliSurface(role: OliAccessRole, surfaceId: string) {
  const surface = OLI_SURFACE_POLICIES.find((item) => item.id === surfaceId)
  if (!surface) return false

  if (surface.customerVisible) {
    if (surface.id === 'account') return role !== 'PUBLIC_USER'
    return true
  }

  if (surface.developerOnly) return role === 'DEVELOPER'
  return role === 'ADMIN' || role === 'DEVELOPER'
}
