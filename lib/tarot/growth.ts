// The Reader Growth Model: a self-learning layer derived from the seeker's
// own on-device history (tarot + runes). It is intentionally reflective, not
// predictive - it summarizes what has recurred, what is being explored, and
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
¶»§q«^