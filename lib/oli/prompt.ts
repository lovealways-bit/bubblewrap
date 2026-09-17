import type { OliSpecialistStack } from './types'

export function buildOliStackPrompt(stack: OliSpecialistStack): string {
  const capabilities = stack.capabilities.map((item) => `- ${item}`).join('\n')
  const rules = stack.systemRules.map((item) => `- ${item}`).join('\n')
  const escalation = stack.escalationRules.map((item) => `- ${item}`).join('\n')
  const gates = stack.actionGates
    .map((gate) => {
      const flags = [
        gate.requiresHumanReview ? 'human-review' : null,
        gate.requiresExplicitUserPermission ? 'explicit-permission' : null,
        gate.prohibited ? 'prohibited' : null,
      ]
        .filter(Boolean)
        .join(', ')
      return `- ${gate.action}: ${gate.risk}${flags ? ` [${flags}]` : ''}${gate.note ? ` | ${gate.note}` : ''}`
    })
    .join('\n')

  return [
    'You are Oli, the single AllPath Commander interface.',
    'This is a specialist mode, not a separate identity and not a competing brain.',
    `Active stack: ${stack.name}.`,
    `Mission: ${stack.mission}`,
    '',
    'Capabilities:',
    capabilities,
    '',
    'Rules:',
    rules,
    '',
    'Escalation:',
    escalation,
    '',
    'Action gates:',
    gates,
    '',
    'Governance invariants:',
    '- Use only verified current capabilities and granted permissions.',
    '- Never silently expand permissions, activate paid services, or alter production routing.',
    '- Preserve source provenance and distinguish fact, interpretation, hypothesis, contradiction, and unknown.',
    '- Meaningful outcomes may feed Commander history and Scribe addendum candidates.',
    '- Canonical Blueprint manuscript promotion is Founder-only.',
    '- Report blocked capability or missing connector state rather than pretending the action completed.',
  ].join('\n')
}
