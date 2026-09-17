export type OliStackId =
  | 'web'
  | 'esoteric'
  | 'music'
  | 'education'
  | 'industrial-safety'
  | 'medical'

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
  | 'music.market-research'
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

export interface OliCommanderEvent {
  eventType:
    | 'STACK_ROUTED'
    | 'PERMISSION_REQUIRED'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'CAPABILITY_FEEDBACK'
    | 'SOURCE_SUGGESTION'
    | 'STACK_OUTCOME'
  stackId: OliStackId
  timestamp: string
  dataClass: DataClass
  summary: string
  details?: Record<string, unknown>
}
