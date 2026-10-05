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
export type DeckThemeId = 'classic' | 'mermaid' | 'fairy' | 'creature' | 'summer-court' | 'winter-court' | 'hallow-court'

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
    'major-15',
    'major-16',
    'major-17',
    'major-18',
    'major-19',
    'major-20',
    'major-21',
    'cups-01',
    'cups-02',
    'cups-03',
    'cups-04',
    'cups-05',
    'cups-06',
    'cups-07',
    'cups-08',
    'cups-09',
    'cups-10',
    'cups-11',
    'cups-12',
    'cups-13',
    'cups-14',
    'pentacles-01',
    'pentacles-02',
    'pentacles-03',
    'pentacles-04',
    'pentacles-05',
    'pentacles-06',
    'pentacles-07',
    'pentacles-08',
    'pentacles-09',
    'pentacles-10',
    'pentacles-11',
    'pentacles-12',
    'pentacles-13',
    'pentacles-14',
    'swords-01',
    'swords-02',
    'swords-03',
    'swords-04',
    'swords-05',
    'swords-06',
    'swords-07',
    'swords-08',
    'swords-09',
    'swords-10',
    'swords-11',
    'swords-12',
    'swords-13',
    'swords-14',
    'wands-01',
    'wands-02',
    'wands-03',
    'wands-04',
    'wands-05',
    'wands-06',
    'wands-07',
    'wands-08',
    'wands-09',
    'wands-10',
    'wands-11',
    'wands-12',
    'wands-13',
    'wands-14',
])

const THEME_CARD_IDS: Record<DeckThemeId, Set<string>> = {
  classic: new Set(),
  'hallow-court': FULL_THEME_CARD_IDS,
  'summer-court': FULL_THEME_CARD_IDS,
  'winter-court': new Set([
    'cups-01',
    'cups-02',
    'cups-03',
    'cups-04',
    'cups-05',
    'cups-06',
    'cups-07',
    'cups-08',
    'cups-09',
    'cups-10',
    'cups-11',
    'cups-12',
    'cups-13',
    'cups-14',
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
    'major-15',
    'major-16',
    'major-17',
    'major-18',
    'major-19',
    'major-20',
    'major-21',
    'pentacles-01',
    'pentacles-02',
    'pentacles-03',
    'pentacles-04',
    'pentacles-05',
    'pentacles-06',
    'pentacles-07',
    'pentacles-08',
    'pentacles-09',
    'pentacles-10',
    'pentacles-11',
    'pentacles-12',
    'pentacles-13',
    'pentacles-14',
    'swords-01',
    'swords-02',
    'swords-03',
    'swords-04',
    'swords-05',
    'swords-06',
    'swords-07',
    'swords-08',
    'swords-09',
    'swords-10',
    'swords-11',
    'swords-12',
    'swords-13',
    'swords-14',
    'wands-01',
    'wands-02',
    'wands-03',
    'wands-04',
    'wands-05',
    'wands-06',
    'wands-07',
    'wands-08',
    'wands-09',
    'wands-10',
    'wands-11',
    'wands-12',
    'wands-13',
    'wands-14',
  ]),
  mermaid: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
  fairy: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
  creature: new Set(['major-00', 'major-01', 'wands-01', 'cups-01', 'swords-01', 'pentacles-01']),
}

/** Every registered deck, including hidden ones. Do not render this list directly.
 *  Order of enabled decks here is the picker order: first enabled = default. */
export const ALL_DECK_THEMES: DeckTheme[] = [
  {
    id: 'hallow-court',
    name: 'Hallow Court',
    tagline: 'A Halloween court of lanterns, cauldrons, scythes, and seals.',
    folder: 'hallow-court',
    enabled: true,
    cardCount: FULL_DECK_CARD_COUNT,
  },
  {
    id: 'summer-court',
    name: 'Summer Court',
    tagline: 'A sunlit court of golden figures.',
    folder: 'summer-court',
    enabled: true,
    cardCount: FULL_DECK_CARD_COUNT,
  },
  {
    id: 'classic',
    name: 'Lunara Classic',
    tagline: 'The original gold-frame Empire deck.',
    folder: 'proofs',
    enabled: false,
    cardCount: FULL_DECK_CARD_COUNT,
  },
  {
    id: 'winter-court',
    name: 'Winter Court',
    tagline: 'A pale silver court of frost, cauldrons, and carved stone.',
    folder: 'winter-court',
    enabled: true,
    cardCount: FULL_DECK_CARD_COUNT,
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

/** Optional full-bleed card back shipped with a LIVE theme folder. */
export function themeBackSrc(themeId: DeckThemeId): string | null {
  if (themeId === 'hallow-court' && isDeckEnabled('hallow-court')) {
    return '/cards/hallow-court/back.png'
  }
  return null
}
