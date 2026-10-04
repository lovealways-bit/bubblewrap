import { buildDeck } from './deck'
import { isCardHeld } from './held-cards'
import type { DrawnCard, Orientation, TarotCard } from './types'

// ---------------------------------------------------------------------------
// The shuffle / draw engine. Pure functions, no UI, no React.
// A future plugin could replace `drawSpread` with a server-seeded or
// physics-based draw without touching the rest of the app.
// ---------------------------------------------------------------------------

/** Default probability that any single drawn card lands reversed. */
export const DEFAULT_REVERSAL_CHANCE = 0.35

/**
 * Fisher-Yates (Durstenfeld) shuffle. Returns a NEW shuffled array and
 * never mutates the input, so state stays predictable.
 */
export function shuffleDeck<T>(deck: readonly T[]): T[] {
  const out = deck.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function rollOrientation(reversalChance: number): Orientation {
  return Math.random() < reversalChance ? 'reversed' : 'upright'
}

/**
 * The deck readings are dealt from: the full deck minus any card held out of
 * production in lib/tarot/held-cards.ts. Same order and layer numbers as
 * buildDeck(), just without the held cards.
 */
export function buildPlayableDeck(): TarotCard[] {
  return buildDeck().filter((card) => !isCardHeld(card.id))
}

export interface DrawOptions {
  count: number
  reversalChance?: number
  /** Provide a pre-shuffled deck to draw from; otherwise a fresh deck is built and shuffled. */
  deck?: TarotCard[]
}

/**
 * Shuffles the playable deck (unless one is supplied) and draws `count`
 * cards off the top, each independently rolled for upright vs reversed.
 * Held cards (lib/tarot/held-cards.ts) are never in the playable deck.
 * Cards start face down (`revealed: false`).
 */
export function drawCards({
  count,
  reversalChance = DEFAULT_REVERSAL_CHANCE,
  deck,
}: DrawOptions): DrawnCard[] {
  const shuffled = shuffleDeck(deck ?? buildPlayableDeck())
  return shuffled.slice(0, count).map((card) => ({
    card,
    orientation: rollOrientation(reversalChance),
    // Randomized per draw: half the time we show the blonde-haired variant.
    // The renderer only honors this when a variant actually exists for the card.
    blonde: Math.random() < 0.5,
    revealed: false,
  }))
}
