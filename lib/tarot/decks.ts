// Deck theme registry.
//
// A "deck theme" is a full alternate art style for the 78-card tarot deck.
// Each theme has its own folder under /public/cards/<folder>/<cardId>.png.
// Cards without themed art yet fall back to the classic gold-frame proof,
// then to the procedural pip illustration — the reading experience never
// breaks while a theme's art is still rolling out.
export type DeckThemeId = 'classic' | 'mermaid' | 'fairy' | 'creature' | 'blonde'

export interface DeckTheme {
  id: DeckThemeId
  name: string
  tagline: string
  /** Folder under /public/cards/. `null` uses the existing classic proofs. */
  folder: string | null
}

export const DECK_THEMES: DeckTheme[] = [
  {
    id: 'classic',
    name: 'Lunara Classic',
    tagline: 'The original gold-frame Empire deck.',
    folder: 'proofs',
  },
  {
    id: 'blonde',
    name: 'Lunara Blonde Court',
    tagline: 'The blonde-court variant already on disk. Missing cards fall back to Classic.',
    folder: 'blonde',
  },
  {
    id: 'mermaid',
    name: 'Tidebound Mermaid',
    tagline: 'An oceanic court of merfolk, pearl, and coral thrones.',
    folder: 'mermaid',
  },
  {
    id: 'fairy',
    name: 'Thornlight Fairy',
    tagline: 'A woodland court of fae light, moss, and bramble.',
    folder: 'fairy',
  },
  {
    id: 'creature',
    name: 'Wildkin Creature',
    tagline: 'A totemic den of animal spirits and feral wisdom.',
    folder: 'creature',
  },
]

export function getDeckTheme(id: string | null | undefined): DeckTheme {
  return DECK_THEMES.find((t) => t.id === id) ?? DECK_THEMES[0]
}

const THEME_CARD_IDS: Record<DeckThemeId, Set<string>> = {
  classic: new Set(),
  blonde: new Set([
    'major-00', 'major-01', 'major-02', 'major-03', 'major-04', 'major-05',
    'major-08', 'major-09', 'major-11', 'major-12', 'major-13', 'major-14',
    'cups-11', 'cups-12', 'cups-13', 'cups-14',
    'pentacles-11', 'pentacles-12', 'pentacles-13', 'pentacles-14',
    'swords-11', 'swords-12', 'swords-13', 'swords-14',
    'wands-11', 'wands-12', 'wands-13', 'wands-14',
  ]),
  mermaid: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
  fairy: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
  creature: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
}

export function hasThemeArt(themeId: DeckThemeId, cardId: string): boolean {
  if (themeId === 'classic') return false
  return THEME_CARD_IDS[themeId]?.has(cardId) ?? false
}

export function themeArtSrc(themeId: DeckThemeId, cardId: string): string {
  const theme = getDeckTheme(themeId)
  return `/cards/${theme.folder}/${cardId}.png`
}
