// On-device store for saved readings, kept in localStorage so a seeker can
// return to any past draw. Framework-agnostic; the UI imports these helpers.

import type { DrawnCard } from './types'

const HISTORY_KEY = 'empire-tarot-history-v1'
const MAX_HISTORY = 40

export interface SavedReading {
  id: string
  savedAt: number
  spreadId: string
  spreadName: string
  question: string
  cards: DrawnCard[]
  summary: string
}

export function loadHistory(): SavedReading[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedReading[]) : []
  } catch {
    return []
  }
}

function persist(list: SavedReading[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  } catch {
    /* storage full or unavailable; fail quietly */
  }
}

/** Prepend a new saved reading, cap the list, and return the updated history. */
export function saveReading(reading: Omit<SavedReading, 'id' | 'savedAt'>): SavedReading[] {
  const entry: SavedReading = {
    ...reading,
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: Date.now(),
  }
  const next = [entry, ...loadHistory()].slice(0, MAX_HISTORY)
  persist(next)
  return next
}

export function deleteReading(id: string): SavedReading[] {
  const next = loadHistory().filter((r) => r.id !== id)
  persist(next)
  return next
}

export function clearHistory(): SavedReading[] {
  persist([])
  return []
}
