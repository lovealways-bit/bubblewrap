// The Reader Growth Model: a self-learning layer derived from the seeker's
// own on-device history (tarot + runes). It is intentionally reflective, not
// predictive — it summarizes what has recurred, what is being explored, and
// what has been integrated, so the Empire "grows with" the reader.
//
// Framework-agnostic and read-only over the history stores; the UI consumes
// the single `computeGrowth()` result.

import { loadHistory } from './history'
import type { DrawnCard, Suit } from './types'
import { loadRuneHistory } from '@/lib/runes/history'
import { RUNES } from '@/lib/runes/runes'

export type MajorRealmId = 'awakening' | 'reckoning' | 'return'
export type RealmId = Suit | MajorRealmId

const MAJOR_REALMS: MajorRealmId[] = ['awakening', 'reckoning', 'return']

/** The suit an emblem should render for a realm, or undefined for major arcs. */
export function realmSuit(id: RealmId): Suit | undefined {
  return (MAJOR_REALMS as string[]).includes(id) ? undefined : (id as Suit)
}

export type LessonStatus = 'dormant' | 'exploring' | 'integrating' | 'integrated'

export interface LessonRealm {
  id: RealmId
  name: string
  /** The emotional lesson this realm carries. */
  lesson: string
  /** The Empire-tongue symbol / element for this realm. */
  symbol: string
  /** Total cards drawn from this realm across all readings. */
  appearances: number
  /** How many distinct readings touched this realm. */
  readings: number
  depth: 0 | 1 | 2 | 3
  status: LessonStatus
}

export interface RecurringCard {
  name: string
  count: number
  suit?: Suit
  arcana: 'major' | 'minor'
}

export interface MeaningfulSymbol {
  label: string
  count: number
  kind: 'element' | 'rune'
}

export interface Milestone {
  threshold: number
  name: string
  detail: string
  reached: boolean
}

export interface GrowthModel {
  totalReadings: number
  totalCards: number
  reflections: number
  realms: LessonRealm[]
  realmsExplored: number
  currentLesson: LessonRealm | null
  completedLessons: LessonRealm[]
  recurringCards: RecurringCard[]
  strengths: string[]
  symbols: MeaningfulSymbol[]
  milestones: Milestone[]
  /** 0..1 across all seven realms, by depth. */
  progress: number
  /** A one-line reflection of where the reader is currently pointed. */
  direction: string
  /** Cardinal the compass needle favors: n/e/s/w or null (center). */
  cardinal: 'n' | 'e' | 's' | 'w' | null
}

// The seven realms: four elemental suits + the three septenaries of the
// Major Arcana journey (the traditional three rows of seven).
const REALM_DEFS: Record<RealmId, { name: string; lesson: string; symbol: string }> = {
  wands: { name: 'The Flame', lesson: 'Acting on your own creative fire', symbol: 'Ignum' },
  cups: { name: 'The Tide', lesson: 'Trusting feeling and connection', symbol: 'Aquum' },
  swords: { name: 'The Blade', lesson: 'Meeting truth with a clear mind', symbol: 'Aerum' },
  pentacles: { name: 'The Root', lesson: 'Building something that lasts', symbol: 'Terrum' },
  awakening: { name: 'The Awakening', lesson: 'Waking to the journey ahead', symbol: 'Aurora' },
  reckoning: { name: 'The Reckoning', lesson: 'Facing the trials that transform', symbol: 'Ordalia' },
  return: { name: 'The Return', lesson: 'Returning whole to the world', symbol: 'Corona' },
}

const REALM_ORDER = Object.keys(REALM_DEFS) as RealmId[]

const DIRECTION: Record<RealmId, { text: string; cardinal: GrowthModel['cardinal'] }> = {
  swords: { text: 'Toward clarity — the mind is asking to be met', cardinal: 'n' },
  wands: { text: 'Toward action — a fire wants to move', cardinal: 'e' },
  pentacles: { text: 'Toward foundation — something real is being built', cardinal: 's' },
  cups: { text: 'Toward the heart — feeling leads the way', cardinal: 'w' },
  awakening: { text: 'Toward awakening — a new journey is opening', cardinal: null },
  reckoning: { text: 'Toward the reckoning — a trial asks to be faced', cardinal: null },
  return: { text: 'Toward return — a great cycle is completing', cardinal: null },
}

// Seven gates, the thresholds of a deepening practice.
const MILESTONE_DEFS: Omit<Milestone, 'reached'>[] = [
  { threshold: 1, name: 'First Light', detail: 'You cast your first reading' },
  { threshold: 3, name: 'The Path Appears', detail: 'Three readings walked' },
  { threshold: 6, name: "The Seeker's Vow", detail: 'A steady practice forms' },
  { threshold: 10, name: 'The Constellation Forms', detail: 'Ten readings mapped' },
  { threshold: 15, name: 'The Inner Gate', detail: 'The pattern turns inward' },
  { threshold: 21, name: 'Empire Adept', detail: 'The deck knows your hand' },
  { threshold: 30, name: 'Keeper of the Deck', detail: 'Mastery of the seven realms' },
]

function realmOf(c: DrawnCard): RealmId {
  if (c.card.arcana !== 'major') return c.card.suit as Suit
  if (c.card.number <= 7) return 'awakening'
  if (c.card.number <= 14) return 'reckoning'
  return 'return'
}

function emptyRealmRecord(): Record<RealmId, number> {
  return Object.fromEntries(REALM_ORDER.map((id) => [id, 0])) as Record<RealmId, number>
}

function statusFor(readings: number): { depth: LessonRealm['depth']; status: LessonStatus } {
  if (readings <= 0) return { depth: 0, status: 'dormant' }
  if (readings <= 2) return { depth: 1, status: 'exploring' }
  if (readings <= 4) return { depth: 2, status: 'integrating' }
  return { depth: 3, status: 'integrated' }
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function computeGrowth(): GrowthModel {
  const tarot = loadHistory()
  const runes = loadRuneHistory()

  const allCards: DrawnCard[] = tarot.flatMap((r) => r.cards)
  const totalCards = allCards.length
  const totalReadings = tarot.length + runes.length
  const reflections =
    tarot.filter((r) => r.question.trim()).length + runes.filter((r) => r.question.trim()).length

  // --- Realms: appearances + distinct readings per realm ---
  const appearances = emptyRealmRecord()
  const readingCounts = emptyRealmRecord()
  for (const c of allCards) appearances[realmOf(c)] += 1
  for (const r of tarot) {
    const seen = new Set<RealmId>()
    for (const c of r.cards) seen.add(realmOf(c))
    seen.forEach((id) => (readingCounts[id] += 1))
  }

  const realms: LessonRealm[] = REALM_ORDER.map((id) => {
    const { depth, status } = statusFor(readingCounts[id])
    return {
      id,
      ...REALM_DEFS[id],
      appearances: appearances[id],
      readings: readingCounts[id],
      depth,
      status,
    }
  })

  const realmsExplored = realms.filter((r) => r.depth > 0).length
  const completedLessons = realms.filter((r) => r.status === 'integrated')
  const progress = realms.reduce((sum, r) => sum + r.depth, 0) / (3 * realms.length)

  // --- Current lesson: the realm most present in the 3 most recent readings ---
  const recentTally: Record<string, number> = {}
  for (const r of tarot.slice(0, 3)) {
    for (const c of r.cards) recentTally[realmOf(c)] = (recentTally[realmOf(c)] ?? 0) + 1
  }
  const recentTop = Object.entries(recentTally).sort((a, b) => b[1] - a[1])[0]?.[0] as
    | RealmId
    | undefined
  const currentLesson =
    realms.find((r) => r.id === recentTop && r.depth > 0) ??
    realms.filter((r) => r.depth > 0).sort((a, b) => b.appearances - a.appearances)[0] ??
    null

  // --- Recurring cards (drawn 2+ times) ---
  const cardTally = new Map<string, RecurringCard>()
  for (const c of allCards) {
    const existing = cardTally.get(c.card.name)
    if (existing) existing.count += 1
    else
      cardTally.set(c.card.name, {
        name: c.card.name,
        count: 1,
        suit: c.card.suit,
        arcana: c.card.arcana,
      })
  }
  const recurringCards = [...cardTally.values()]
    .filter((c) => c.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // --- Emerging strengths: most frequent card keywords ---
  const kwTally: Record<string, number> = {}
  for (const c of allCards) {
    for (const k of c.card.keywords) kwTally[k] = (kwTally[k] ?? 0) + 1
  }
  const strengths = Object.entries(kwTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => titleCase(k))

  // --- Meaningful symbols: realm elements + cast runes ---
  const symbols: MeaningfulSymbol[] = realms
    .filter((r) => r.appearances > 0)
    .map((r) => ({ label: r.symbol, count: r.appearances, kind: 'element' as const }))

  const runeTally: Record<string, number> = {}
  for (const r of runes) {
    for (const stone of r.cast) {
      const name = RUNES.find((x) => x.id === stone.runeId)?.name
      if (name) runeTally[name] = (runeTally[name] ?? 0) + 1
    }
  }
  for (const [label, count] of Object.entries(runeTally)) {
    symbols.push({ label, count, kind: 'rune' })
  }
  symbols.sort((a, b) => b.count - a.count)

  // --- Direction from the single most recent reading (tarot preferred) ---
  let direction = 'Cast your first reading to begin the map'
  let cardinal: GrowthModel['cardinal'] = null
  const newestTarot = tarot[0]
  const newestRune = runes[0]
  if (newestTarot && (!newestRune || newestTarot.savedAt >= newestRune.savedAt)) {
    const tally: Record<string, number> = {}
    for (const c of newestTarot.cards) tally[realmOf(c)] = (tally[realmOf(c)] ?? 0) + 1
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] as RealmId | undefined
    if (top) {
      direction = DIRECTION[top].text
      cardinal = DIRECTION[top].cardinal
    }
  } else if (newestRune) {
    direction = 'Toward the old ways — the runes hold your current thread'
    cardinal = null
  }

  const milestones: Milestone[] = MILESTONE_DEFS.map((m) => ({
    ...m,
    reached: totalReadings >= m.threshold,
  }))

  return {
    totalReadings,
    totalCards,
    reflections,
    realms,
    realmsExplored,
    currentLesson,
    completedLessons,
    recurringCards,
    strengths,
    symbols: symbols.slice(0, 8),
    milestones,
    progress,
    direction,
    cardinal,
  }
}
