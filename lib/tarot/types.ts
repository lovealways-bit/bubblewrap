// Core domain types for The Empire Tarot.
// Kept framework-agnostic so the deck, engine, and interpretation
// layers can be reused or swapped by future plugins.

export type Suit = 'cups' | 'wands' | 'swords' | 'pentacles'
export type Arcana = 'major' | 'minor'
export type Orientation = 'upright' | 'reversed'

export interface TarotCard {
  /** Stable identifier, e.g. "major-00" or "cups-07". */
  id: string
  name: string
  arcana: Arcana
  /** Present only for Minor Arcana. */
  suit?: Suit
  /** Major: 0-21. Minor: 1-14 (1=Ace ... 11=Page ... 14=King). */
  number: number
  /** 1-78. This card's position as a layer of the magik world. */
  layer?: number
  upright: string
  reversed: string
  keywords: string[]
  /** A short, orientation-independent core meaning of the card itself. */
  essence?: string
  /** Single evocative theme word shown under the title, e.g. "NEW BEGINNINGS". */
  theme?: string
  /**
   * Image reference for a future art plugin. Currently unused by the
   * renderer (which draws a themed SVG face), but reserved so a plugin
   * can supply real artwork without touching the UI.
   */
  imageRef?: string
}

export interface DrawnCard {
  card: TarotCard
  orientation: Orientation
  revealed: boolean
  /** Whether this draw shows the blonde-haired variant art (when one exists). */
  blonde?: boolean
}

export interface SpreadPosition {
  id: string
  label: string
  hint: string
}

export interface Spread {
  id: string
  name: string
  tagline: string
  positions: SpreadPosition[]
}
