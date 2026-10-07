'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shuffle, Sparkles, Hand, BookMarked, Trash2, FolderOpen, Clock, Sun, Star, Moon, Lock, Layers, LayoutGrid, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { drawCards } from '@/lib/tarot/engine'
import { getInterpretation, getReadingSummary } from '@/lib/tarot/interpretation'
import { getSpread, SPREADS } from '@/lib/tarot/spreads'
import {
  loadHistory,
  saveReading,
  deleteReading,
  clearHistory,
  type SavedReading,
} from '@/lib/tarot/history'
import type { DrawnCard } from '@/lib/tarot/types'
import { DECK_THEMES, type DeckThemeId, getDeckTheme } from '@/lib/tarot/decks'
import { DECK_THEME_STORAGE_KEY } from '@/lib/tarot/deck-preference'
import { TarotCard } from './tarot-card'
import { DeckPicker } from './deck-picker'
import { MobileSheet, SheetLauncher } from './mobile-sheet'

const STORAGE_KEY = 'empire-tarot-reading-v1'

const SUIT_ELEMENT: Record<string, string> = {
  wands: 'Fire',
  cups: 'Water',
  swords: 'Air',
  pentacles: 'Earth',
}

// Which phone sheet (page within a page) is open, if any.
type SheetId = 'deck' | 'spread' | 'card' | 'saved'

interface PersistedReading {
  spreadId: string
  cards: DrawnCard[]
  question: string
}

function gridClass(count: number): string {
  if (count === 1) return 'mx-auto max-w-[13rem] grid-cols-1'
  if (count <= 3) return 'grid-cols-3'
  /¶»§q«^