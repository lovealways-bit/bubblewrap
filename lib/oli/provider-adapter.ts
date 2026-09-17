import 'server-only'

export type OliProviderCapability = 'generate' | 'research' | 'embeddings' | 'tools'

export type OliProviderEntitlement = {
  provider: string
  plan: string | 'GRAY'
  capabilities: OliProviderCapability[]
  includedUsage: string | 'GRAY'
  overage: string | 'GRAY'
  verifiedAt?: string
}

export type OliProviderRequest = {
  system: string
  user: string
  appId: string
  metadata?: Record<string, string | number | boolean | null>
}

export type OliProviderResult = {
  text: string
  citations?: Array<{ title: string; url: string }>
  provider: string
  model?: string
}

export interface OliProviderAdapter {
  readonly id: string
  readonly capabilities: OliProviderCapability[]
  getEntitlement(): Promise<OliProviderEntitlement>
  generate?(request: OliProviderRequest): Promise<OliProviderResult>
  research?(request: OliProviderRequest): Promise<OliProviderResult>
}

const adapters = new Map<string, OliProviderAdapter>()

/**
 * Register a server-side provider adapter. Registration does not automatically
 * enable a provider for an app. App capability state, entitlement verification,
 * privacy rules, and owner-approved spend still control activation.
 */
export function registerOliProvider(adapter: OliProviderAdapter) {
  adapters.set(adapter.id, adapter)
}

export function getOliProvider(id: string) {
  return adapters.get(id)
}

export function listOliProviders() {
  return Array.from(adapters.values()).map((adapter) => ({
    id: adapter.id,
    capabilities: adapter.capabilities,
  }))
}

export async function verifyOliProvider(id: string) {
  const adapter = adapters.get(id)
  if (!adapter) {
    return {
      connected: false as const,
      state: 'GRAY' as const,
      reason: `Provider adapter ${id} is not registered in this runtime.`,
    }
  }

  const entitlement = await adapter.getEntitlement()
  const unresolved =
    entitlement.plan === 'GRAY' ||
    entitlement.includedUsage === 'GRAY' ||
    entitlement.overage === 'GRAY'

  return {
    connected: !unresolved,
    state: unresolved ? ('GRAY' as const) : ('READY' as const),
    entitlement,
  }
}
