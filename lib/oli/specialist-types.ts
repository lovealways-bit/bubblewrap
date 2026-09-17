export type OliStackId =
  | 'web'
  | 'esoteric'
  | 'music'
  | 'education'
  | 'industrial-safety'
  | 'medical'

export type OliHubSurfaceId =
  | 'mothership-vault'
  | 'manifesto-scribe'
  | 'commander-log'
  | 'design-closet'
  | 'source-intelligence'
  | 'specialist-stacks'

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export type DataClass =
  | 'PUBLIC'
  | 'INTERNAL'
  | 'CLIENT'
  | 'EDUCATION_RECORD'
  | 'HEALTH'
  | 'RESTRICTED'

export type PermissionScope =
  | 'web.search'
  | 'web.read'
  | 'market.compare'
  | 'tarot.draw'
  | 'tarot.interpret'
  | 'esoteric.research'
  | 'music.analyze'
  | 'music.compose'
  | 'music.production'
  | 'music.midi.read'
  | 'music.midi.write'
  | 'music.audio-to-midi'
  | 'music.stems.separate'
  | 'music.stems.generate'
  | 'music.notation.read'
  | 'music.notation.write'
  | 'music.catalog.read'
  | 'music.catalog.write-candidate'
  | 'music.mix-review'
  | 'music.mastering-review'
  | 'music.market-research'
  | 'music.release.prepare'
  | 'music.release.publish'
  | 'education.design'
  | 'education.policy-research'
  | 'education.records.read'
  | 'industrial.research'
  | 'industrial.hazard-review'
  | 'industrial.incident-documentation'
  | 'medical.education'
  | 'medical.records.read'
  | 'medical.wellness.read'
  | 'medical.trend-analysis'
  | 'mothership.vault.read'
  | 'mothership.vault.write-candidate'
  | 'mothership.manifesto.read'
  | 'mothership.manifesto.propose-addendum'
  | 'mothership.commander-log.read'
  | 'mothership.commander-log.write'
  | 'mothership.daily-debrief.read'
  | 'mothership.daily-debrief.write'
  | 'mothership.design-closet.read'
  | 'mothership.design-closet.write-candidate'
  | 'mothership.source-intelligence.read'
  | 'commander.report.write'
  | 'scribe.addendum.propose'

export interface SourcePolicy {
  freshness: 'STATIC_OK' | 'CURRENT_WHEN_RELEVANT' | 'CURRENT_REQUIRED'
  preferredDomains: string[]
  requireCitations: boolean
  distinguishFactFromInterpretation: boolean
}

export interface ActionGate {
  action: string
  risk: RiskLevel
  requiresHumanReview: boolean
  requiresExplicitUserPermission: boolean
  prohibited?: boolean
  note?: string
}

export interface OliSpecialistStack {
  id: OliStackId
  name: string
  shortName: string
  description: string
  mission: string
  defaultDataClass: DataClass
  capabilities: string[]
  requiredScopes: PermissionScope[]
  optionalScopes: PermissionScope[]
  sourcePolicy: SourcePolicy
  actionGates: ActionGate[]
  systemRules: string[]
  escalationRules: string[]
  evolution: {
    learnFromVerifiedOutcomes: boolean
    allowCapabilityTelemetry: boolean
    allowSourceSuggestions: boolean
    allowPermissionExpansion: false
    allowPaidActivation: false
    canonicalManuscriptPromotion: 'FOUNDER_ONLY'
  }
}

export interface OliHubSurface {
  id: OliHubSurfaceId
  name: string
  description: string
  purpose: string
  route: string
  requiredReadScopes: PermissionScope[]
  optionalWriteScopes: PermissionScope[]
  founderGate: boolean
  dataClasses: DataClass[]
  rules: string[]
}

export interface OliRouteRequest {
  text: string
  requestedStack?: OliStackId
  availableScopes?: PermissionScope[]
  dataClass?: DataClass
  userConfirmedSensitiveDataUse?: boolean
}

export interface OliRouteDecision {
  stack: OliSpecialistStack
  status: 'READY' | 'PERMISSION_REQUIRED' | 'HUMAN_REVIEW' | 'BLOCKED'
  missingScopes: PermissionScope[]
  reasons: string[]
  humanReviewRequired: boolean
}
