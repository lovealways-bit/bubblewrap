// ---------------------------------------------------------------------------
// The Elder Futhark rune set for The Empire Tarot's Rune Oracle.
//
// Kept framework-agnostic and separate from the tarot modules so the rune
// casting logic and meanings can be reused or swapped by a future plugin,
// exactly like the tarot deck / engine / interpretation split.
// ---------------------------------------------------------------------------

export type RuneOrientation = 'upright' | 'merkstave'

export interface Rune {
  /** Stable id, e.g. "fehu". */
  id: string
  name: string
  /** Unicode Elder Futhark glyph. */
  symbol: string
  /** Sound the rune carries. */
  phoneme: string
  /** One-word essence. */
  essence: string
  upright: string
  /** Reversed / merkstave meaning. Empty when the rune cannot reverse. */
  merkstave: string
  /** Some runes are symmetric and have no reversed form. */
  canReverse: boolean
  keywords: string[]
}

export interface CastRune {
  rune: Rune
  orientation: RuneOrientation
}

export const RUNES: Rune[] = [
  {
    id: 'fehu', name: 'Fehu', symbol: 'ᚠ', phoneme: 'F', essence: 'Wealth',
    upright: 'Earned abundance, prosperity, and the energy to create more. What you tend now multiplies.',
    merkstave: 'Loss, greed, or wealth slipping through the fingers. Guard what matters.',
    canReverse: true, keywords: ['wealth', 'abundance', 'reward'],
  },
  {
    id: 'uruz', name: 'Uruz', symbol: 'ᚢ', phoneme: 'U', essence: 'Strength',
    upright: 'Raw vitality and untamed power. A surge of health and will to break new ground.',
    merkstave: 'Misused force, weakness, or a chance for strength squandered.',
    canReverse: true, keywords: ['strength', 'vitality', 'will'],
  },
  {
    id: 'thurisaz', name: 'Thurisaz', symbol: 'ᚦ', phoneme: 'TH', essence: 'Thorn',
    upright: 'A sharp gateway. Defensive force, a warning, or a catalyst that pierces stagnation.',
    merkstave: 'Danger, spite, or acting on impulse before the moment is ripe.',
    canReverse: true, keywords: ['catalyst', 'defense', 'conflict'],
  },
  {
    id: 'ansuz', name: 'Ansuz', symbol: 'ᚨ', phoneme: 'A', essence: 'Message',
    upright: 'The voice of wisdom. A signal, teaching, or insight arriving from beyond you.',
    merkstave: 'Deception, misheard counsel, or wisdom refused.',
    canReverse: true, keywords: ['message', 'wisdom', 'voice'],
  },
  {
    id: 'raidho', name: 'Raidho', symbol: 'ᚱ', phoneme: 'R', essence: 'Journey',
    upright: 'The ride, the right road, movement with purpose. Travel and rhythm align.',
    merkstave: 'A journey disrupted, wrong turns, or being out of step.',
    canReverse: true, keywords: ['journey', 'movement', 'rhythm'],
  },
  {
    id: 'kenaz', name: 'Kenaz', symbol: 'ᚲ', phoneme: 'K', essence: 'Torch',
    upright: 'Illumination. Knowledge kindled, craft mastered, the dark made workable.',
    merkstave: 'A light gone out, lost clarity, or creative fire withheld.',
    canReverse: true, keywords: ['knowledge', 'craft', 'clarity'],
  },
  {
    id: 'gebo', name: 'Gebo', symbol: 'ᚷ', phoneme: 'G', essence: 'Gift',
    upright: 'A gift given and received, sacred exchange, partnership and balance.',
    merkstave: '', canReverse: false, keywords: ['gift', 'exchange', 'union'],
  },
  {
    id: 'wunjo', name: 'Wunjo', symbol: 'ᚹ', phoneme: 'W', essence: 'Joy',
    upright: 'Joy, harmony, belonging. A wish fulfilled and the fellowship that carries it.',
    merkstave: 'Sorrow, discord, or joy just out of reach.',
    canReverse: true, keywords: ['joy', 'harmony', 'reward'],
  },
  {
    id: 'hagalaz', name: 'Hagalaz', symbol: 'ᚺ', phoneme: 'H', essence: 'Hail',
    upright: 'Sudden disruption from beyond your control. The storm that clears the field.',
    merkstave: '', canReverse: false, keywords: ['disruption', 'trial', 'change'],
  },
  {
    id: 'nauthiz', name: 'Nauthiz', symbol: 'ᚾ', phoneme: 'N', essence: 'Need',
    upright: 'Necessity and constraint. Hardship that forges resilience and resourcefulness.',
    merkstave: 'Deprivation, want, or a lesson refused and repeated.',
    canReverse: true, keywords: ['need', 'constraint', 'endurance'],
  },
  {
    id: 'isa', name: 'Isa', symbol: 'ᛁ', phoneme: 'I', essence: 'Ice',
    upright: 'Stillness and pause. A freeze that asks patience before the thaw.',
    merkstave: '', canReverse: false, keywords: ['stillness', 'pause', 'patience'],
  },
  {
    id: 'jera', name: 'Jera', symbol: 'ᛃ', phoneme: 'J/Y', essence: 'Harvest',
    upright: 'The harvest of right effort in right season. Cycles complete and reward.',
    merkstave: '', canReverse: false, keywords: ['harvest', 'cycle', 'reward'],
  },
  {
    id: 'eihwaz', name: 'Eihwaz', symbol: 'ᛇ', phoneme: 'EI', essence: 'Yew',
    upright: 'The world-tree axis. Endurance, defense, and the strength that spans worlds.',
    merkstave: '', canReverse: false, keywords: ['endurance', 'defense', 'axis'],
  },
  {
    id: 'perthro', name: 'Perthro', symbol: 'ᛈ', phoneme: 'P', essence: 'Mystery',
    upright: 'The cup of fate and chance. Hidden things, secrets, and what luck may turn up.',
    merkstave: 'Stagnation, secrets that harm, or fate held back.',
    canReverse: true, keywords: ['fate', 'mystery', 'chance'],
  },
  {
    id: 'algiz', name: 'Algiz', symbol: 'ᛉ', phoneme: 'Z', essence: 'Protection',
    upright: 'The raised hand, the elk-sedge. Protection, higher connection, a shield around you.',
    merkstave: 'Exposure, a warning ignored, or defenses down.',
    canReverse: true, keywords: ['protection', 'shield', 'guidance'],
  },
  {
    id: 'sowilo', name: 'Sowilo', symbol: 'ᛋ', phoneme: 'S', essence: 'Sun',
    upright: 'The sun-wheel. Victory, wholeness, vital success and guiding light.',
    merkstave: '', canReverse: false, keywords: ['success', 'light', 'victory'],
  },
  {
    id: 'tiwaz', name: 'Tiwaz', symbol: 'ᛏ', phoneme: 'T', essence: 'Justice',
    upright: 'The warrior-star of Tyr. Honor, justice, and victory won by principle.',
    merkstave: 'Injustice, waning drive, or a cause abandoned.',
    canReverse: true, keywords: ['justice', 'honor', 'victory'],
  },
  {
    id: 'berkano', name: 'Berkano', symbol: 'ᛒ', phoneme: 'B', essence: 'Birch',
    upright: 'Birth and becoming. New growth, nurture, and gentle beginnings taking root.',
    merkstave: 'Stunted growth, family strain, or a beginning that stalls.',
    canReverse: true, keywords: ['growth', 'birth', 'nurture'],
  },
  {
    id: 'ehwaz', name: 'Ehwaz', symbol: 'ᛖ', phoneme: 'E', essence: 'Horse',
    upright: 'The trusted horse. Partnership, steady progress, and movement in harmony.',
    merkstave: 'Restlessness, a partnership out of sync, or progress stalled.',
    canReverse: true, keywords: ['partnership', 'progress', 'trust'],
  },
  {
    id: 'mannaz', name: 'Mannaz', symbol: 'ᛗ', phoneme: 'M', essence: 'Self',
    upright: 'Humankind and the self. Your role among others, intelligence, and shared purpose.',
    merkstave: 'Isolation, self-deception, or an ego that blocks the way.',
    canReverse: true, keywords: ['self', 'community', 'mind'],
  },
  {
    id: 'laguz', name: 'Laguz', symbol: 'ᛚ', phoneme: 'L', essence: 'Water',
    upright: 'The flowing water. Intuition, dreams, and the deep tide beneath the surface.',
    merkstave: 'Confusion, fear, or intuition overridden.',
    canReverse: true, keywords: ['intuition', 'flow', 'dreams'],
  },
  {
    id: 'ingwaz', name: 'Ingwaz', symbol: 'ᛝ', phoneme: 'NG', essence: 'Seed',
    upright: 'The gestating seed. Potential gathered, completion, and energy released at the right time.',
    merkstave: '', canReverse: false, keywords: ['completion', 'potential', 'fertility'],
  },
  {
    id: 'othala', name: 'Othala', symbol: 'ᛟ', phoneme: 'O', essence: 'Heritage',
    upright: 'Ancestral home and inheritance. What is truly yours, roots, and enduring legacy.',
    merkstave: 'Rootlessness, loss of home, or clinging to the past.',
    canReverse: true, keywords: ['heritage', 'home', 'legacy'],
  },
  {
    id: 'dagaz', name: 'Dagaz', symbol: 'ᛞ', phoneme: 'D', essence: 'Dawn',
    upright: 'The break of day. Awakening, breakthrough, and transformation at the turning point.',
    merkstave: '', canReverse: false, keywords: ['breakthrough', 'dawn', 'awakening'],
  },
]

/** Probability a reversible rune lands merkstave (reversed). */
export const DEFAULT_MERKSTAVE_CHANCE = 0.35

/** Fisher-Yates shuffle, non-mutating, shared shape with the tarot engine. */
export function shuffleRunes(runes: readonly Rune[]): Rune[] {
  const out = runes.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Roll a single rune's orientation. */
function rollOrientation(rune: Rune, merkstaveChance: number): RuneOrientation {
  return rune.canReverse && Math.random() < merkstaveChance ? 'merkstave' : 'upright'
}

/** Cast a single rune from a freshly shuffled set, rolling orientation. */
export function castRune(merkstaveChance = DEFAULT_MERKSTAVE_CHANCE): CastRune {
  const rune = shuffleRunes(RUNES)[0]
  return { rune, orientation: rollOrientation(rune, merkstaveChance) }
}

/** Cast `count` distinct runes (drawn without replacement), each with orientation. */
export function castRunes(count: number, merkstaveChance = DEFAULT_MERKSTAVE_CHANCE): CastRune[] {
  return shuffleRunes(RUNES)
    .slice(0, count)
    .map((rune) => ({ rune, orientation: rollOrientation(rune, merkstaveChance) }))
}

/**
 * The single entry point for rune meaning, mirroring the tarot's
 * `getInterpretation` plugin seam so a future oracle API can replace it.
 */
export function getRuneMeaning({ rune, orientation }: CastRune): string {
  if (orientation === 'merkstave' && rune.merkstave) return rune.merkstave
  return rune.upright
}

// ---------------------------------------------------------------------------
// Rune spreads (the layouts) and a synthesis seam, mirroring the tarot side.
// ---------------------------------------------------------------------------

export interface RunePosition {
  id: string
  label: string
  hint: string
}

export interface RuneSpread {
  id: string
  name: string
  tagline: string
  count: number
  positions: RunePosition[]
}

export const RUNE_SPREADS: RuneSpread[] = [
  {
    id: 'single',
    name: 'Rune of the Empire',
    tagline: 'One stone. One clear word from the old alphabet.',
    count: 1,
    positions: [{ id: 'rune', label: 'The Stone', hint: 'What the Empire casts for you now' }],
  },
  {
    id: 'norns',
    name: 'The Three Norns',
    tagline: 'Urðr, Verðandi, Skuld. What was, what is, what shall be.',
    count: 3,
    positions: [
      { id: 'urdr', label: 'Urðr', hint: 'What was: the fate already woven' },
      { id: 'verdandi', label: 'Verðandi', hint: 'What is: the moment becoming' },
      { id: 'skuld', label: 'Skuld', hint: 'What shall be: the debt owed to the future' },
    ],
  },
]

export function getRuneSpread(id: string): RuneSpread {
  return RUNE_SPREADS.find((s) => s.id === id) ?? RUNE_SPREADS[0]
}

/**
 * Static synthesis of a full rune cast, in the Empire's voice.
 * Shaped like the tarot's `getReadingSummary` so a future API can replace it.
 */
export function getRuneReadingSummary(
  spread: RuneSpread,
  cast: CastRune[],
  question?: string,
): string {
  if (cast.length === 0) return ''
  const single = cast.length === 1
  const lines: string[] = []

  if (question?.trim()) {
    lines.push(`You asked: "${question.trim()}."`)
  }

  // The synthesis names the stones and their weave; it never reprints a
  // rune's meaning, which already lives in the stone's own panel.
  if (single) {
    const c = cast[0]
    lines.push(
      `The Empire casts a single stone: ${c.rune.name}${
        c.orientation === 'merkstave' ? ', merkstave' : ''
      }. Let it stand alone and sit with the stone above.`,
    )
  } else if (spread.id === 'norns' && cast.length === 3) {
    const [urdr, verdandi, skuld] = cast
    lines.push(
      `The Norns weave from ${urdr.rune.name} through ${verdandi.rune.name} toward ${skuld.rune.name}. What was set in the first shapes the present and calls the future into being.`,
    )
  }

  const merkstave = cast.filter((c) => c.orientation === 'merkstave').length
  if (single) {
    if (merkstave === 1) {
      lines.push('It falls merkstave: shadow work is asked of you before the way opens.')
    }
  } else if (merkstave === 0) {
    lines.push('Every stone lands upright: the runes speak plainly and the way is clear.')
  } else if (merkstave >= Math.ceil(cast.length / 2)) {
    lines.push('Many stones fall merkstave: shadow work is asked of you before the way opens.')
  } else {
    lines.push(
      `${merkstave} stone${merkstave > 1 ? 's fall' : ' falls'} merkstave: a knot to loosen within.`,
    )
  }

  return lines.join(' ')
}
