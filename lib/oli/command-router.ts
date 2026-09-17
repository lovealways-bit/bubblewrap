import { capabilities, deploymentProjects, repositories, resolveAppProfile } from './registry'
import type { OliCommandRequest, OliCommandResponse } from './types'

function capabilityState(id: string) {
  return capabilities.find((item) => item.id === id)?.state ?? 'GRAY'
}

export function routeOliCommand(request: OliCommandRequest): OliCommandResponse {
  const message = request.message.trim()
  const normalized = message.toLowerCase()
  const app = resolveAppProfile({ host: request.host, appId: request.appId, text: message })
  const baseProvenance = [
    'commander/MANUSCRIPT.md',
    'commander/OLI_APP_REGISTRY.json',
    'commander/OLI_CAPABILITIES.json',
  ]

  if (!message) {
    return {
      kind: 'clarify',
      title: 'What should I help with?',
      message: `I’m Oli for ${app.name}. Ask me about this app, its navigation, support path, subscription access, current build context, or a task you want routed.`,
      appId: app.id,
      capabilityIds: ['support.first-line'],
      provenance: baseProvenance,
    }
  }

  if (/\b(repo|repository|github|build|deployment|vercel|status|commander|heartbeat)\b/.test(normalized)) {
    const linked = deploymentProjects.filter((project) => project.repo === app.repository)
    return {
      kind: 'answer',
      title: 'Commander context',
      message: `The verified registry currently contains ${repositories.length} accessible GitHub repositories and ${deploymentProjects.length} Vercel projects for the SynchPathways team. ${app.name} is mapped to ${app.repository ?? 'an unverified repository relationship'}${linked.length ? ` with ${linked.length} verified Vercel project link${linked.length === 1 ? '' : 's'}` : ''}. A registry entry records discovery state; it does not grant private-data access by itself.`,
      appId: app.id,
      capabilityIds: ['commander.context', 'deployment.observe', 'repo.read'],
      links: [{ label: 'Open Oli Hub', href: '/oli' }],
      provenance: baseProvenance,
    }
  }

  if (/\b(price|pricing|plan|subscription|subscribe|billing|cancel|entitlement)\b/.test(normalized)) {
    const state = capabilityState('billing.explain')
    return {
      kind: state === 'LIVE' ? 'answer' : 'route',
      title: 'Plans and access',
      message:
        state === 'LIVE'
          ? `I can explain the verified plan and entitlement state for ${app.name}.`
          : `I can guide you to ${app.name} plan and account surfaces, but live entitlement explanation is ${state} until the app’s server-side billing source is connected. I won’t invent prices or access.`,
      appId: app.id,
      capabilityIds: ['billing.explain', 'support.first-line'],
      links: [
        { label: 'Pricing', href: '/pricing' },
        { label: 'Account', href: '/account' },
      ],
      provenance: baseProvenance,
    }
  }

  if (/\b(feedback|bug|feature request|feature idea|complaint|rate|review)\b/.test(normalized)) {
    const state = capabilityState('feedback.capture')
    return {
      kind: state === 'LIVE' ? 'answer' : 'route',
      title: 'Feedback',
      message:
        state === 'LIVE'
          ? 'I can capture this as structured product feedback and keep it separate from public app-store ratings.'
          : `Feedback capture is ${state}. The Manuscript requires a low-friction in-app path, but a verified storage destination still needs to be configured before I claim I saved anything.`,
      appId: app.id,
      capabilityIds: ['feedback.capture', 'support.first-line'],
      links: [{ label: 'Open Oli Hub', href: '/oli' }],
      provenance: baseProvenance,
    }
  }

  if (/\b(search|research|web|latest|current|today|market|trend|compare)\b/.test(normalized)) {
    const state = capabilityState('research.web')
    return {
      kind: state === 'LIVE' ? 'answer' : 'route',
      title: 'Current research',
      message:
        state === 'LIVE'
          ? 'I can use the approved research connector and preserve sources for current factual claims.'
          : `Current web research is ${state}. I can recognize and route the request now, but I need an approved server-side research connector and verified entitlement before I represent live search as connected.`,
      appId: app.id,
      capabilityIds: ['research.web'],
      needsProvider: state !== 'LIVE',
      provenance: baseProvenance,
    }
  }

  if (/\b(help|navigate|where|screen|page|find|go to|how do i)\b/.test(normalized)) {
    const state = capabilityState('navigation.app')
    return {
      kind: 'route',
      title: 'Navigation',
      message:
        state === 'LIVE'
          ? `Tell me what you are trying to reach in ${app.name} and I’ll route you there.`
          : `I can provide first-line guidance for ${app.name}. Full screen-by-screen navigation is ${state} until this app registers its navigation map.`,
      appId: app.id,
      capabilityIds: ['support.first-line', 'navigation.app'],
      links: [{ label: 'Oli Hub', href: '/oli' }],
      provenance: baseProvenance,
    }
  }

  const aiState = capabilityState('ai.generative')
  return {
    kind: aiState === 'LIVE' ? 'answer' : 'route',
    title: 'Oli routed your request',
    message:
      aiState === 'LIVE'
        ? `I can handle this in ${app.name} using the approved generative provider.`
        : `I understand the request and the active app context. Generative AI is ${aiState} in this shared runtime until an approved server-side provider, entitlement, privacy configuration, and budget are verified. I can still handle registered product support and Commander context without pretending that provider is already connected.`,
    appId: app.id,
    capabilityIds: ['support.first-line', 'ai.generative'],
    needsProvider: aiState !== 'LIVE',
    links: [{ label: 'Open Oli Hub', href: '/oli' }],
    provenance: baseProvenance,
  }
}
