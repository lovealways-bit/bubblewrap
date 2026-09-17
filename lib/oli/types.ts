export type CapabilityState = 'LIVE' | 'READY' | 'PLANNED' | 'BLOCKED' | 'GRAY'

export type OliCapability = {
  id: string
  name: string
  state: CapabilityState
  scope: string
  description: string
  dependency?: string
  costClass?: string
}

export type OliRepository = {
  name: string
  fullName: string
  defaultBranch: string
  visibility: 'public' | 'private' | string
  oliRole?: string
}

export type OliDeploymentProject = {
  name: string
  id: string
  repo: string | null
}

export type OliAppProfile = {
  id: string
  name: string
  aliases: string[]
  hosts: string[]
  repository?: string
  vercelProjects: string[]
  audience: string
  domain: string
  designFamily: string
  defaultCapabilities: string[]
  supportMode: 'consumer' | 'client' | 'internal' | 'mixed'
  notes: string[]
}

export type OliRuntimeContext = {
  app: OliAppProfile
  repositoryCount: number
  deploymentProjectCount: number
  capabilities: OliCapability[]
  verifiedAt: string
}

export type OliCommandRequest = {
  message: string
  host?: string
  pathname?: string
  appId?: string
}

export type OliCommandResponse = {
  kind: 'answer' | 'navigate' | 'route' | 'clarify' | 'blocked'
  title: string
  message: string
  appId: string
  capabilityIds: string[]
  links?: Array<{ label: string; href: string }>
  needsProvider?: boolean
  provenance: string[]
}
