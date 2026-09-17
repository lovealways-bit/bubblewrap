import { getOliStack } from './stacks'
import type {
  DataClass,
  OliRouteDecision,
  OliRouteRequest,
  OliStackId,
  PermissionScope,
} from './types'

const KEYWORDS: Record<OliStackId, string[]> = {
  web: [
    'search',
    'latest',
    'current',
    'market',
    'trend',
    'compare prices',
    'research online',
    'website',
    'news',
  ],
  esoteric: [
    'tarot',
    'oracle',
    'birth chart',
    'astrology',
    'zodiac',
    'numerology',
    'rune',
    'esoteric',
    'divination',
  ],
  music: [
    'music',
    'song',
    'chord',
    'melody',
    'harmony',
    'mix',
    'master',
    'midi',
    'stem',
    'daw',
    'release',
    'publishing',
  ],
  education: [
    'education',
    'student',
    'school',
    'lesson',
    'iep',
    '504',
    'transition',
    'cte',
    'work-based learning',
    'wbl',
    'ferpa',
    'idea',
  ],
  'industrial-safety': [
    'osha',
    'niosh',
    'worksite',
    'industrial',
    'hazard',
    'lockout',
    'tagout',
    'ppe',
    'sds',
    'machine guarding',
    'incident',
    'near miss',
  ],
  medical: [
    'medical',
    'health',
    'symptom',
    'lab',
    'medication',
    'diagnosis',
    'doctor',
    'hospital',
    'wearable',
    'heart rate',
    'blood pressure',
  ],
}

const SENSITIVE_CLASSES = new Set<DataClass>([
  'HEALTH',
  'EDUCATION_RECORD',
  'RESTRICTED',
])

function inferStack(text: string, dataClass?: DataClass): OliStackId {
  if (dataClass === 'HEALTH') return 'medical'
  if (dataClass === 'EDUCATION_RECORD') return 'education'

  const normalized = text.toLowerCase()
  let best: OliStackId = 'web'
  let bestScore = 0

  for (const [id, keywords] of Object.entries(KEYWORDS) as [OliStackId, string[]][]) {
    const score = keywords.reduce(
      (total, keyword) => total + (normalized.includes(keyword) ? 1 : 0),
      0,
    )
    if (score > bestScore) {
      best = id
      bestScore = score
    }
  }

  return best
}

function missingScopes(required: PermissionScope[], available: PermissionScope[]): PermissionScope[] {
  return required.filter((scope) => !available.includes(scope))
}

export function routeOliTask(request: OliRouteRequest): OliRouteDecision {
  const stackId = request.requestedStack ?? inferStack(request.text, request.dataClass)
  const stack = getOliStack(stackId)
  const availableScopes = request.availableScopes ?? []
  const missing = missingScopes(stack.requiredScopes, availableScopes)
  const reasons: string[] = []

  if (request.requestedStack) {
    reasons.push(`Founder or caller explicitly requested ${stack.shortName}.`)
  } else {
    reasons.push(`Task language routed to ${stack.shortName}.`)
  }

  if (
    request.dataClass &&
    SENSITIVE_CLASSES.has(request.dataClass) &&
    !request.userConfirmedSensitiveDataUse
  ) {
    reasons.push('Sensitive data class requires explicit user authorization before use.')
    return {
      stack,
      status: 'PERMISSION_REQUIRED',
      missingScopes: missing,
      reasons,
      humanReviewRequired: false,
    }
  }

  if (missing.length > 0) {
    reasons.push(`Missing required scope(s): ${missing.join(', ')}.`)
    return {
      stack,
      status: 'PERMISSION_REQUIRED',
      missingScopes: missing,
      reasons,
      humanReviewRequired: false,
    }
  }

  const highRiskLanguage = /\b(emergency|imminent danger|suicid|overdose|severe bleeding|unconscious|confined space rescue|electrocution|active fire)\b/i
  if (highRiskLanguage.test(request.text)) {
    reasons.push('High-risk language detected. Human or emergency escalation is required.')
    return {
      stack,
      status: 'HUMAN_REVIEW',
      missingScopes: [],
      reasons,
      humanReviewRequired: true,
    }
  }

  reasons.push('Required stack permissions are present for a non-consequential task.')
  return {
    stack,
    status: 'READY',
    missingScopes: [],
    reasons,
    humanReviewRequired: false,
  }
}
