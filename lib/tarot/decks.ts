// Deck theme registry.
//
// A "deck theme" is a full alternate art style for the 78-card tarot deck.
// Each theme has its own folder under /public/cards/<folder>/<cardId>.png.
// Cards without themed art yet fall back to the classic gold-frame proof,
// then to the procedural pip illustration, so the reading experience never
// breaks while a theme's art is still rolling out.
//
// Visibility is controlled by the `enabled` flag. A deck stays hidden from
// every user-facing surface (picker, saved preference, random variants) until
// it is switched on. Only switch a deck on once `cardCount` reaches
// FULL_DECK_CARD_COUNT and its art has been approved.
export type DeckThemeId = 'classic' | 'mermaid' | 'fairy' | 'creature' | 'summer-court' | 'winter-court' | 'hallow-court' | 'christmas-court'

export const FULL_DECK_CARD_COUNT = 78

export interface DeckTheme {
  id: DeckThemeId
  name: string
  tagline: string
  /** Folder under /public/cards/. */
  folder: string
  /** Shown to users only when true. */
  enabled: boolean
  /** Asset extension for themed cards. */
  extension?: 'png' | 'webp'
  /** How many of the 78 cards have themed art on disk today. */
  cardCount: number
}

const FULL_THEME_CARD_IDS = new Set<string>([
    'major-00',
    'major-01',
    'major-02',
    'major-03',
    'major-04',
    'major-05',
    'major-06',
    'major-07',
    'major-08',
    'major-09',
    'major-10',
    'major-11',
    'major-12',
    'major-13',
    'major-14',
    'major-15¶»§q«^