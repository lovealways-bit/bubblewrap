import appRegistry from '@/commander/OLI_APP_REGISTRY.json'
import capabilityRegistry from '@/commander/OLI_CAPABILITIES.json'
import type {
  OliAppProfile,
  OliCapability,
  OliDeploymentProject,
  OliRepository,
  OliRuntimeContext,
} from './types'

export const repositories = appRegistry.github.repositories as OliRepository[]
export const deploymentProjects = appRegistry.vercel.projects as OliDeploymentProject[]
export const capabilities = capabilityRegistry.capabilities as OliCapability[]

export const appProfiles: OliAppProfile[] = [
  {
    id: 'oli-hub',
    name: 'Oli Commander Training Hub',
    aliases: ['oli commander hub', 'oli training hub', 'commander training hub'],
    hosts: [],
    repository: 'lovealways-bit/bubblewrap',
    vercelProjects: [],
    audience: 'Owner, authorized collaborators, builders, and support operators',
    domain: 'Cross-app orchestration, training context, capability governance, and handoff',
    designFamily: 'AllPath / SynchPathways Commander',
    defaultCapabilities: [
      'commander.context',
      'commander.manuscript',
      'support.first-line',
      'handoff.agent',
      'design.library',
      'repo.read',
      'deployment.observe',
    ],
    supportMode: 'internal',
    surfaceAccess: {
      user: 'NONE',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: [
      'This profile is the shared Oli control surface implemented on the current Bubblewrap branch.',
      'The separately observed ACCA/Oli Vercel project is linked to cosmic-guide and is not claimed here as this branch’s canonical deployment.',
    ],
  },
  {
    id: 'lunara',
    name: 'Lunara Atlas',
    aliases: ['lunara', 'tarot', 'ascension'],
    hosts: ['lunara-atlas'],
    repository: 'lovealways-bit/bubblewrap',
    vercelProjects: ['lunara-atlas'],
    audience: 'Consumer app users',
    domain: 'Tarot, reflective interpretation, account guidance, subscriptions, and product support',
    designFamily: 'Lunara Ascension',
    defaultCapabilities: [
      'support.first-line',
      'navigation.app',
      'research.web',
      'ai.generative',
      'feedback.capture',
      'billing.explain',
    ],
    supportMode: 'consumer',
    surfaceAccess: {
      user: 'PUBLIC',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: [
      'Reflective/divinatory content must stay distinct from factual claims or professional advice.',
      'Private reading/profile data is not eligible for advertising targeting.',
    ],
  },
  {
    id: 'coughlin',
    name: 'Coughlin Atlas',
    aliases: ['coughlin', 'terrain review', 'case review'],
    hosts: ['coughlin-atlas'],
    repository: 'lovealways-bit/bubblewrap',
    vercelProjects: ['coughlin-atlas'],
    audience: 'Authorized client/reviewer users',
    domain: 'Client portal navigation, evidence/source organization, records, and structured support',
    designFamily: 'AllPath Coughlin Review',
    defaultCapabilities: [
      'support.first-line',
      'navigation.app',
      'handoff.agent',
      'research.web',
    ],
    supportMode: 'client',
    surfaceAccess: {
      user: 'AUTHORIZED_CLIENT',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: [
      'Case-specific private material must remain within authorized client scope.',
      'Oli must separate documented evidence, reported experience, analysis, and open questions.',
    ],
  },
  {
    id: 'allpath',
    name: 'AllPath Properties / UIOS',
    aliases: ['allpath', 'allpath properties', 'uios'],
    hosts: ['aallpathproperties-com', 'allpath-commander-hub'],
    repository: 'lovealways-bit/aallpathproperties-com',
    vercelProjects: ['aallpathproperties-com', 'allpath-commander-hub'],
    audience: 'Prospects, clients, operators, and collaborators',
    domain: 'Systems development, consulting, product navigation, support, and client intake',
    designFamily: 'AllPath white / pearl / gold / purple UIOS',
    defaultCapabilities: [
      'support.first-line',
      'navigation.app',
      'billing.explain',
      'feedback.capture',
      'handoff.agent',
      'design.library',
    ],
    supportMode: 'mixed',
    surfaceAccess: {
      user: 'PUBLIC',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: ['Commercial promises and pricing must come from verified app configuration.'],
  },
  {
    id: 'mothership',
    name: 'Mothership Source Command',
    aliases: ['mothership', 'source command', 'source-command'],
    hosts: ['mothership-design-studio'],
    repository: 'lovealways-bit/Mothership',
    vercelProjects: ['mothership-design-studio'],
    audience: 'Authorized source contributors',
    domain: 'Governance, source provenance, communication, permission, versioning, and institutional memory',
    designFamily: 'Mothership Commander',
    defaultCapabilities: [
      'commander.context',
      'commander.manuscript',
      'handoff.agent',
      'repo.read',
      'repo.write',
      'deployment.observe',
    ],
    supportMode: 'internal',
    surfaceAccess: {
      user: 'NONE',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: ['Mothership remains the upstream cross-agent authority.'],
  },
  {
    id: 'bubblewrap-public',
    name: 'Oli Product Guide',
    aliases: [],
    hosts: [],
    repository: 'lovealways-bit/bubblewrap',
    vercelProjects: [],
    audience: 'Product users',
    domain: 'Safe first-line product support when the active product host has not yet been mapped',
    designFamily: 'App inherited',
    defaultCapabilities: ['support.first-line', 'navigation.app', 'feedback.capture'],
    supportMode: 'mixed',
    surfaceAccess: {
      user: 'PUBLIC',
      admin: 'ADMIN_ONLY',
      developer: 'DEVELOPER_ONLY',
      founder: 'FOUNDER_ONLY',
    },
    notes: [
      'Do not expose internal Commander topology from the public fallback profile.',
      'Resolve the exact app before using app-specific private data, pricing, or permissions.',
    ],
  },
]

const fallbackProfile = appProfiles.find((profile) => profile.id === 'bubblewrap-public')!

export function resolveAppProfile(input?: { host?: string; appId?: string; text?: string }): OliAppProfile {
  const appId = input?.appId?.toLowerCase().trim()
  if (appId) {
    const byId = appProfiles.find((profile) => profile.id === appId)
    if (byId) return byId
  }

  const host = input?.host?.toLowerCase() ?? ''
  if (host) {
    const byHost = appProfiles.find((profile) =>
      profile.hosts.some((needle) => host.includes(needle.toLowerCase())),
    )
    if (byHost) return byHost
  }

  const text = input?.text?.toLowerCase() ?? ''
  if (text) {
    const byAlias = appProfiles.find((profile) =>
      profile.aliases.some((alias) => text.includes(alias.toLowerCase())),
    )
    if (byAlias) return byAlias
  }

  return fallbackProfile
}

export function getCapabilities(ids?: string[]): OliCapability[] {
  if (!ids?.length) return capabilities
  const wanted = new Set(ids)
  return capabilities.filter((capability) => wanted.has(capability.id))
}

export function getRuntimeContext(input?: { host?: string; appId?: string; text?: string }): OliRuntimeContext {
  const app = resolveAppProfile(input)
  return {
    app,
    repositoryCount: repositories.length,
    deploymentProjectCount: deploymentProjects.length,
    capabilities: getCapabilities(app.defaultCapabilities),
    verifiedAt: appRegistry.verifiedAt,
  }
}
