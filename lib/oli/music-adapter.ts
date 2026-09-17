import 'server-only'

export type MusicAdapterCapability =
  | 'catalog.search'
  | 'playlist.read'
  | 'playlist.write'
  | 'midi.generate'
  | 'midi.edit'
  | 'audio.generate'
  | 'audio.to-midi'
  | 'stems.separate'
  | 'stems.generate'
  | 'notation.generate'
  | 'mix.review'
  | 'master.review'
  | 'release.prepare'

export type MusicAdapterEntitlement = {
  provider: string
  accountOrPlan: string | 'GRAY'
  includedUsage: string | 'GRAY'
  meteredCost: string | 'GRAY'
  dataUse: string | 'GRAY'
  verifiedAt?: string
}

export type MusicAdapterContext = {
  appId: string
  userId?: string
  projectId?: string
  permissionScopes: string[]
  metadata?: Record<string, string | number | boolean | null>
}

export type MusicCatalogSearchRequest = MusicAdapterContext & {
  query: string
  limit?: number
}

export type MusicMidiRequest = MusicAdapterContext & {
  prompt: string
  bpm?: number
  key?: string
  meter?: string
  bars?: number
  sourceAssetId?: string
}

export type MusicAudioProcessingRequest = MusicAdapterContext & {
  sourceAssetId: string
  operation: 'audio.to-midi' | 'stems.separate' | 'stems.generate' | 'mix.review' | 'master.review'
  options?: Record<string, string | number | boolean | null>
}

export type MusicAdapterResult = {
  provider: string
  capability: MusicAdapterCapability
  summary: string
  sourceIds?: string[]
  outputAssetIds?: string[]
  warnings?: string[]
  metadata?: Record<string, unknown>
}

export interface MusicOliAdapter {
  readonly id: string
  readonly capabilities: MusicAdapterCapability[]
  getEntitlement(): Promise<MusicAdapterEntitlement>
  searchCatalog?(request: MusicCatalogSearchRequest): Promise<MusicAdapterResult>
  generateMidi?(request: MusicMidiRequest): Promise<MusicAdapterResult>
  processAudio?(request: MusicAudioProcessingRequest): Promise<MusicAdapterResult>
}

const adapters = new Map<string, MusicOliAdapter>()

export function registerMusicOliAdapter(adapter: MusicOliAdapter) {
  adapters.set(adapter.id, adapter)
}

export function getMusicOliAdapter(id: string) {
  return adapters.get(id)
}

export function listMusicOliAdapters() {
  return Array.from(adapters.values()).map((adapter) => ({
    id: adapter.id,
    capabilities: adapter.capabilities,
  }))
}

export async function verifyMusicOliAdapter(id: string) {
  const adapter = adapters.get(id)
  if (!adapter) {
    return {
      state: 'GRAY' as const,
      connected: false,
      reason: `Music adapter ${id} is not registered in this runtime.`,
    }
  }

  const entitlement = await adapter.getEntitlement()
  const unresolved =
    entitlement.accountOrPlan === 'GRAY' ||
    entitlement.includedUsage === 'GRAY' ||
    entitlement.meteredCost === 'GRAY' ||
    entitlement.dataUse === 'GRAY'

  return {
    state: unresolved ? ('GRAY' as const) : ('READY' as const),
    connected: !unresolved,
    entitlement,
  }
}

export function requireMusicScope(context: MusicAdapterContext, scope: string) {
  if (!context.permissionScopes.includes(scope)) {
    throw new Error(`Missing Music Oli permission scope: ${scope}`)
  }
}
