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
export type DeckThemeId = 'classic' | 'mermaid' | 'fairy' | 'creature' | 'summer-court'

export const FULL_DECK_CARD_COUNT = 78

export interface DeckTheme {
  id: DeckThemeId
  name: string
  tagline: string
  /** Folder under /public/cards/. */
  folder: string
  /** Shown to users only when true. */
  enabled: boolean
  /** How many of the 78 cards have themed art on disk today. */
  cardCount: number
}

const THEME_CARD_IDS: Record<DeckThemeId, Set<string>> = {
  classic: new Set(),
  'summer-court': new Set([
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

/** Every registered deck, including hidden ones. Do not render this list directly. */
export const ALL_DECK_THEMES: DeckTheme[] = [
  {
    id: 'classic',
    name: 'Lunara Classic',
    tagline: 'The original gold-frame Empire deck.',
    folder: 'proofs',
    enabled: true,
    cardCount: FULL_DECK_CARD_COUNT,
  },
  {
    id: 'summer-court',
    name: 'Summer Court',
    tagline: 'A sunlit court of golden figures.',
    folder: 'summer-court',
    enabled: false,
    cardCount: THEME_CARD_IDS['summer-court'].size,
  },
  {
    id: 'mermaid',
    name: 'Tidebound Mermaid',
    tagline: 'An oceanic court of merfolk, pearl, and coral thrones.',
    folder: 'mermaid',
    enabled: false,
    cardCount: THEME_CARD_IDS.mermaid.size,
  },
  {
    id: 'fairy',
    name: 'Thornlight Fairy',
    tagline: 'A woodland court of fae light, moss, and bramble.',
    folder: 'fairy',
    enabled: false,
    cardCount: THEME_CARD_IDS.fairy.size,
  },
  {
    id: 'creature',
    name: 'Wildkin Creature',
    tagline: 'A totemic den of animal spirits and feral wisdom.',
    folder: 'creature',
    enabled: false,
    cardCount: THEME_CARD_IDS.creature.size,
  },
]

/** The decks users can see and choose. */
export const DECK_THEMES: DeckTheme[] = ALL_DECK_THEMES.filter((t) => t.enabled)

export function isDeckEnabled(id: DeckThemeId): boolean {
  return ALL_DECK_THEMES.some((t) => t.id === id && t.enabled)
}

/**
 * Resolve a stored deck id to a visible deck. Hidden or unknown ids (for
 * example an old saved preference for a deck that is switched off) fall back
 * to the main deck.
 */
export function getDeckTheme(id: string | null | undefined): DeckTheme {
  // Older saved preferences used the id 'blonde' for what is now Summer Court.
  const normalized = id === 'blonde' ? 'summer-court' : id
  return DECK_THEMES.find((t) => t.id === normalized) ?? DECK_THEMES[0]
}

export function hasThemeArt(themeId: DeckThemeId, cardId: string): boolean {
  if (themeId === 'classic') return false
  if (!isDeckEnabled(themeId)) return false
  return THEME_CARD_IDS[themeId]?.has(cardId) ?? false
}

export function themeArtSrc(themeId: DeckThemeId, cardId: string): string {
  const theme = ALL_DECK_THEMES.find((t) => t.id === themeId) ?? ALL_DECK_THEMES[0]
  return `/cards/${theme.folder}/${cardId}.png`
}
