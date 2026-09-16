import type { DrawnCard, Spread, SpreadPosition, TarotCard } from './types'

// ---------------------------------------------------------------------------
// The interpretation layer: the deliberate plugin seam.
//
// `getInterpretation` currently returns the STATIC meaning baked into the
// deck data. It is intentionally shaped as an async-friendly, position-aware
// function so a future plugin can swap in a live API call (e.g. an LLM that
// writes a bespoke reading) WITHOUT any change to the UI that consumes it.
//
// To plug in a custom provider, implement the `InterpretationProvider`
// interface and register it with `setInterpretationProvider(...)`. The UI
// only ever calls `getInterpretation`, so the swap is invisible upstream.
// ---------------------------------------------------------------------------

export interface InterpretationInput {
  card: TarotCard
  orientation: 'upright' | 'reversed'
  /** The spread slot this card fell into (label + hint), if any. */
  position?: SpreadPosition
  /** The seeker's situational question, if they asked one. */
  question?: string
}

export interface InterpretationResult {
  /** The primary reading text shown to the seeker. */
  text: string
  /** Where the text came from, useful for badges/debugging. */
  source: 'static' | 'api'
}

export interface InterpretationProvider {
  interpret(input: InterpretationInput): Promise<InterpretationResult> | InterpretationResult
}

/**
 * The default provider: returns the static meaning from the deck data,
 * lightly framed by the spread position so the copy reads intentionally.
 */
export const staticProvider: InterpretationProvider = {
  interpret({ card, orientation, position }): InterpretationResult {
    // NOTE: `question` is intentionally accepted (via InterpretationInput) and
    // ignored by the static text so per-card copy stays clean and non-repetitive.
    // A future API/LLM provider can weave the question into every card.
    const meaning = orientation === 'upright' ? card.upright : card.reversed
    const framed = position
      ? `${positionFraming(position.id, orientation)} ${meaning}`
      : meaning
    return { text: framed, source: 'static' }
  },
}

function positionFraming(positionId: string, orientation: 'upright' | 'reversed'): string {
  const tone = orientation === 'reversed' ? 'shadowed' : 'clear'
  switch (positionId) {
    case 'past':
      return `In your past, ${tone === 'shadowed' ? 'a knot still felt:' : 'a foundation was laid:'}`
    case 'present':
      return 'In this moment,'
    case 'future':
      return 'On the road ahead,'
    case 'focus':
      return 'The Empire fixes your gaze here:'
    case 'heart':
      return 'At the heart of it,'
    case 'crossing':
      return `Crossing you, ${tone === 'shadowed' ? 'a weight to name:' : 'a force to reckon with:'}`
    case 'foundation':
      return 'Beneath it all,'
    case 'recent-past':
      return 'Now passing away,'
    case 'crown':
      return 'Crowning what could be,'
    case 'near-future':
      return 'Drawing near,'
    case 'self':
      return 'As for you,'
    case 'environment':
      return 'The world around you shows'
    case 'hopes-fears':
      return `In your hopes and fears, ${tone === 'shadowed' ? 'a dread stirs:' : 'a longing rises:'}`
    case 'outcome':
      return 'Where the road resolves,'
    default:
      return 'The Empire reveals:'
  }
}

let activeProvider: InterpretationProvider = staticProvider

/**
 * Swap the interpretation engine at runtime. Example future use:
 *
 *   setInterpretationProvider({
 *     async interpret({ card, orientation, position }) {
 *       const res = await fetch('/api/interpret', {
 *         method: 'POST',
 *         body: JSON.stringify({ card: card.id, orientation, position: position?.id }),
 *       })
 *       const { text } = await res.json()
 *       return { text, source: 'api' }
 *     },
 *   })
 */
export function setInterpretationProvider(provider: InterpretationProvider) {
  activeProvider = provider
}

/**
 * The single entry point the UI uses. Position-aware and async-ready so the
 * static-vs-API swap never ripples outward. Signature mirrors the requested
 * `getInterpretation(card, spreadPosition)` shape.
 */
export async function getInterpretation(
  drawn: DrawnCard,
  position?: SpreadPosition,
  question?: string,
): Promise<InterpretationResult> {
  return activeProvider.interpret({
    card: drawn.card,
    orientation: drawn.orientation,
    position,
    question,
  })
}

// ---------------------------------------------------------------------------
// The reading summary: a second plugin seam.
//
// `getReadingSummary` synthesizes the whole spread into one closing statement.
// Like `getInterpretation`, it is static today but shaped so a future
// LLM/API provider can produce a bespoke synthesis without any UI change.
// ---------------------------------------------------------------------------

const SUIT_FORCE: Record<string, string> = {
  wands: 'drive, passion, and what you are building',
  cups: 'heart, feeling, and connection',
  swords: 'mind, truth, and conflict',
  pentacles: 'work, money, and the material world',
}

export interface ReadingSummaryInput {
  spread: Spread
  cards: DrawnCard[]
  question?: string
}

/** Static synthesis of the full reading, in the Empire's voice. */
export function getReadingSummary({ spread, cards, question }: ReadingSummaryInput): string {
  const revealed = cards.filter((c) => c.revealed)
  if (revealed.length === 0) return ''

  const single = revealed.length === 1
  const reversed = revealed.filter((c) => c.orientation === 'reversed').length
  const majors = revealed.filter((c) => c.card.arcana === 'major').length

  const suitCount: Record<string, number> = {}
  for (const c of revealed) {
    if (c.card.suit) suitCount[c.card.suit] = (suitCount[c.card.suit] ?? 0) + 1
  }
  const dominantSuit = Object.entries(suitCount).sort((a, b) => b[1] - a[1])[0]

  const lines: string[] = []

  if (question?.trim()) {
    lines.push(`You asked: "${question.trim()}."`)
  }

  // Spread-specific spine. The summary names the cards and their relationship;
  // it never reprints a card's meaning, which already lives in the card panel.
  if (single) {
    const c = revealed[0]
    lines.push(
      `The Empire lays a single truth before you: ${c.card.name}${
        c.orientation === 'reversed' ? ', reversed' : ''
      }. Let it stand alone and sit with the card above.`,
    )
  } else if (spread.id === 'three-card' && revealed.length === 3) {
    const [past, present, future] = revealed
    lines.push(
      `Your thread runs from ${past.card.name} through ${present.card.name} toward ${future.card.name}. What was rooted in the first becomes the pressure of the present and points the way the current carries you.`,
    )
  } else if (spread.id === 'celtic-cross') {
    const heart = revealed[0]
    const crossing = revealed[1]
    const outcome = revealed[revealed.length - 1]
    lines.push(
      `At the heart stands ${heart.card.name}, crossed by ${crossing.card.name}. Follow the map through its layers and the road resolves in ${outcome.card.name}.`,
    )
  }

  // Tone from reversals. Plural framing only makes sense across a spread;
  // a lone reversed card gets its own singular line.
  if (single) {
    if (reversed === 1) {
      lines.push('It falls reversed: the Empire asks for inner work before the way clears.')
    }
  } else if (reversed === 0) {
    lines.push('Every card stands upright: the way is open and the energy runs clean.')
  } else if (reversed >= Math.ceil(revealed.length / 2)) {
    lines.push('Many cards fall reversed: there is inner work to do before the way clears.')
  } else {
    lines.push(
      `${reversed} card${reversed > 1 ? 's fall' : ' falls'} reversed: a knot to loosen amid the flow.`,
    )
  }

  // Emphasis only reads across multiple cards.
  if (!single) {
    if (majors >= 2) {
      lines.push('The Major Arcana crowd this reading: great forces are at work, larger than daily choice.')
    } else if (dominantSuit && dominantSuit[1] >= 2) {
      lines.push(`The suit of ${dominantSuit[0]} runs strong: this is a matter of ${SUIT_FORCE[dominantSuit[0]]}.`)
    }
  }

  return lines.join(' ')
}
