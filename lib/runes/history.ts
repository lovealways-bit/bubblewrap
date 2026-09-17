// On-device store for saved rune casts, kept in localStorage so a seeker can
// return to any past casting. Mirrors the tarot history store's shape.

const HISTORY_KEY = 'empire-tarot-rune-history-v1'
const MAX_HISTORY = 40

export interface SavedCastRune {
  runeId: string
  orientation: 'upright' | 'merkstave'
}

export interface SavedRuneReading {
  id: string
  savedAt: number
  spreadId: string
  spreadName: string
  question: string
  cast: SavedCastRune[]
  summary: string
}

export function loadRuneHistory(): SavedRuneReading[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SavedRuneReading[]) : []
  } catch {
    return []
  }
}

function persist(list: SavedRuneReading[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
  } catch {
    /* storage full or unavailable; fail quietly */
  }
}

/** Prepend a new saved cast, cap the list, and return the updated history. */
export function saveRuneReading(
  reading: Omit<SavedRuneReading, 'id' | 'savedAt'>,
): SavedRuneReading[] {
  const entry: SavedRuneReading = {
    ...reading,
    id: `rn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: Date.now(),
  }
  const next = [entry, ...loadRuneHistory()].slice(0, MAX_HISTORY)
  persist(next)
  return next
}

export function deleteRuneReading(id: string): SavedRuneReading[] {
  const next = loadRuneHistory().filter((r) => r.id !== id)
  persist(next)
  return next
}

export function clearRuneHistory(): SavedRuneReading[] {
  persist([])
  return []
}
