'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shuffle, Sparkles, Hand, BookMarked, Trash2, FolderOpen, Clock, Sun, Star, Moon, Lock } from 'lucide-react'
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
import { type DeckThemeId, getDeckTheme } from '@/lib/tarot/decks'
import { TarotCard } from './tarot-card'
import { DeckPicker } from './deck-picker'

const STORAGE_KEY = 'empire-tarot-reading-v1'
const DECK_THEME_STORAGE_KEY = 'empire-tarot-deck-theme-v1'

const SUIT_ELEMENT: Record<string, string> = {
  wands: 'Fire',
  cups: 'Water',
  swords: 'Air',
  pentacles: 'Earth',
}

interface PersistedReading {
  spreadId: string
  cards: DrawnCard[]
  question: string
}

function gridClass(count: number): string {
  if (count === 1) return 'mx-auto max-w-[13rem] grid-cols-1'
  if (count <= 3) return 'grid-cols-3'
  // Celtic Cross and other large spreads: 5 across, 2 rows
  return 'grid-cols-3 sm:grid-cols-5'
}

// Celestial glyphs cycled across the labeled result rows, echoing the
// sun / star / moon rhythm of the reveal.
const CELESTIAL: LucideIcon[] = [Sun, Star, Moon]

// A single evocative line for each row: the card's essence when present,
// otherwise the first sentence of its oriented meaning.
function oneLine(d: DrawnCard): string {
  if (d.card.essence) return d.card.essence
  const text = d.orientation === 'upright' ? d.card.upright : d.card.reversed
  return text.split('. ')[0].replace(/\.$/, '') + '.'
}

function formatWhen(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export function ReadingBoard({ premiumSpreads = false }: { premiumSpreads?: boolean }) {
  const router = useRouter()
  const [spreadId, setSpreadId] = useState<string>(SPREADS[0].id)
  const [cards, setCards] = useState<DrawnCard[]>([])
  const [question, setQuestion] = useState('')
  const [interpretations, setInterpretations] = useState<Record<number, string>>({})
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [history, setHistory] = useState<SavedReading[]>([])
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deckTheme, setDeckTheme] = useState<DeckThemeId>('classic')

  const spread = getSpread(spreadId) ?? SPREADS[0]

  // ---- Load any in-progress reading + saved history + deck choice on mount ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedReading
        if (getSpread(parsed.spreadId) && Array.isArray(parsed.cards)) {
          setSpreadId(parsed.spreadId)
          setCards(parsed.cards)
          if (typeof parsed.question === 'string') setQuestion(parsed.question)
          const firstRevealed = parsed.cards.findIndex((c) => c.revealed)
          if (firstRevealed >= 0) setSelectedIndex(firstRevealed)
        }
      }
      const storedTheme = localStorage.getItem(DECK_THEME_STORAGE_KEY)
      if (storedTheme) setDeckTheme(getDeckTheme(storedTheme).id)
    } catch {
      /* ignore corrupt storage */
    }
    setHistory(loadHistory())
    setHydrated(true)
  }, [])

  // ---- Persist the chosen deck theme (a display preference, not account data) ----
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(DECK_THEME_STORAGE_KEY, deckTheme)
  }, [deckTheme, hydrated])

  // ---- Persist the in-progress reading whenever it changes ----
  useEffect(() => {
    if (!hydrated) return
    if (cards.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ spreadId, cards, question }))
  }, [spreadId, cards, question, hydrated])

  // ---- Recompute interpretations for whatever is revealed ----
  useEffect(() => {
    const activeSpread = getSpread(spreadId) ?? SPREADS[0]
    let cancelled = false
    ;(async () => {
      const next: Record<number, string> = {}
      await Promise.all(
        cards.map(async (drawn, i) => {
          if (!drawn.revealed) return
          const result = await getInterpretation(drawn, activeSpread.positions[i], question)
          next[i] = result.text
        }),
      )
      if (!cancelled) setInterpretations(next)
    })()
    return () => {
      cancelled = true
    }
  }, [cards, spreadId, question])

  const handleDraw = useCallback(() => {
    const activeSpread = getSpread(spreadId) ?? SPREADS[0]
    setDrawing(true)
    setInterpretations({})
    setSelectedIndex(null)
    setSavedId(null)
    // brief beat so the shuffle reads as deliberate
    setTimeout(() => {
      setCards(drawCards({ count: activeSpread.positions.length }))
      setDrawing(false)
    }, 450)
  }, [spreadId])

  const handleReveal = useCallback((index: number) => {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, revealed: true } : c)))
    setSelectedIndex(index)
  }, [])

  const handleReset = useCallback(() => {
    setCards([])
    setInterpretations({})
    setSelectedIndex(null)
    setSavedId(null)
  }, [])

  const hasReading = cards.length > 0
  const allRevealed = hasReading && cards.every((c) => c.revealed)
  const anyRevealed = hasReading && cards.some((c) => c.revealed)
  const askedQuestion = question.trim()
  const compact = spread.positions.length > 1

  const summary = useMemo(
    () => (allRevealed ? getReadingSummary({ spread, cards, question }) : ''),
    [allRevealed, spread, cards, question],
  )

  const handleSave = useCallback(() => {
    if (!allRevealed) return
    const next = saveReading({
      spreadId,
      spreadName: spread.name,
      question,
      cards,
      summary,
    })
    setHistory(next)
    setSavedId(next[0]?.id ?? null)
  }, [allRevealed, spreadId, spread.name, question, cards, summary])

  const handleOpenSaved = useCallback((r: SavedReading) => {
    setSpreadId(r.spreadId)
    setCards(r.cards)
    setQuestion(r.question)
    setInterpretations({})
    const firstRevealed = r.cards.findIndex((c) => c.revealed)
    setSelectedIndex(firstRevealed >= 0 ? firstRevealed : 0)
    setSavedId(r.id)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleDeleteSaved = useCallback(
    (id: string) => {
      setHistory(deleteReading(id))
      setSavedId((cur) => (cur === id ? null : cur))
    },
    [],
  )

  const handleClearHistory = useCallback(() => {
    setHistory(clearHistory())
    setSavedId(null)
  }, [])

  const selected = selectedIndex !== null ? cards[selectedIndex] : null
  const selectedPosition = selectedIndex !== null ? spread.positions[selectedIndex] : null

  return (
    <section className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      {/* ---- Hero header ---- */}
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">The Cards</p>
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.12em] text-gold-bright text-glow-gold sm:text-4xl">
          Draw Your Cards
        </h2>
        <p className="max-w-md text-sm italic leading-relaxed text-muted-foreground text-pretty">
          Seventy-eight cards of the arcana. Choose a spread, name your question, and let the cards
          fall as they may.
        </p>
      </div>

      {/* ---- Deck theme selector ---- */}
      <div className="mb-10">
        <DeckPicker value={deckTheme} onChange={setDeckTheme} />
      </div>

      {/* ---- Spread selector ---- */}
      <div className="flex flex-col items-center gap-4">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">
          Choose your spread
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SPREADS.map((s) => {
            const active = s.id === spreadId
            const locked = !!s.premium && !premiumSpreads
            return (
              <button
                key={s.id}
                type="button"
                aria-label={locked ? `${s.name} — unlock with Lunara Plus` : s.name}
                onClick={() => {
                  if (locked) {
                    router.push('/pricing')
                    return
                  }
                  setSpreadId(s.id)
                  handleReset()
                }}
                className={`inline-flex items-center gap-2 rounded-md border px-5 py-2 font-display text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                  active
                    ? 'border-gold bg-gold/15 text-gold-bright shadow-[0_0_18px_-6px_var(--gold)]'
                    : locked
                      ? 'border-gold/20 text-gold/40 hover:border-gold/40 hover:text-gold/70'
                      : 'border-gold/30 text-gold/70 hover:border-gold/60 hover:text-gold'
                }`}
              >
                {locked && <Lock className="h-3 w-3" aria-hidden="true" />}
                {s.name}
              </button>
            )
          })}
        </div>
        <p className="max-w-sm text-center text-sm italic text-muted-foreground text-pretty">
          {spread.tagline}
        </p>
        {SPREADS.some((s) => s.premium) && !premiumSpreads && (
          <button
            type="button"
            onClick={() => router.push('/pricing')}
            className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.25em] text-gold/55 transition-colors hover:text-gold"
          >
            <Lock className="h-3 w-3" aria-hidden="true" />
            The Celtic Cross is part of Lunara Plus
          </button>
        )}
      </div>

      {/* ---- Ask a question (situational) ---- */}
      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2">
        <label
          htmlFor="empire-question"
          className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-gold/60"
        >
          Ask the cards a question
        </label>
        <input
          id="empire-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What am I not seeing? (optional)"
          maxLength={140}
          className="w-full rounded-md border border-gold/30 bg-surface/50 px-4 py-2.5 text-center text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
        />
        <p className="text-[0.7rem] italic text-muted-foreground/70">
          Name your situation and the reading is drawn around it.
        </p>
      </div>

      {/* ---- Draw / shuffle control ---- */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleDraw}
          disabled={drawing}
          className="empire-cta group inline-flex items-center gap-2.5 rounded-md px-10 py-3.5 font-display text-sm uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Shuffle
            className={`h-4 w-4 transition-transform duration-500 ${drawing ? 'animate-spin' : 'group-hover:rotate-180'}`}
          />
          {hasReading ? 'Shuffle & draw again' : 'Draw my cards'}
        </button>
      </div>

      {/* ---- The reading ---- */}
      {hasReading && (
        <div className="mt-12" style={{ animation: 'empire-rise 0.6s ease-out both' }}>
          {askedQuestion && (
            <div className="empire-panel mx-auto mb-6 max-w-lg px-6 py-4 text-center">
              <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-gold/50">
                Lunara weighs your question
              </p>
              <p className="mt-2 text-base italic text-gold-bright text-pretty">
                &ldquo;{askedQuestion}&rdquo;
              </p>
            </div>
          )}

          <p className="mb-8 text-center font-display text-lg uppercase tracking-[0.2em] text-gold-bright text-glow-gold sm:text-xl">
            {allRevealed ? 'Lunara has drawn your cards' : 'The cards are dealt. Turn them.'}
          </p>

          {/* the board: all cards visible at once */}
          <div className={`grid gap-x-2 gap-y-5 ${gridClass(cards.length)}`}>
            {cards.map((drawn, i) => (
              <TarotCard
                key={`${drawn.card.id}-${i}`}
                drawn={drawn}
                positionLabel={spread.positions[i]?.label ?? 'The Card'}
                onReveal={() => handleReveal(i)}
                onSelect={() => setSelectedIndex(i)}
                selected={selectedIndex === i}
                compact={compact}
                deckTheme={deckTheme}
              />
            ))}
          </div>

          {/* the labeled path: each position as a signature gold-framed row */}
          {allRevealed && (
            <div
              className="empire-panel mx-auto mt-10 max-w-2xl p-6 sm:p-8"
              style={{ animation: 'empire-rise 0.5s ease-out both' }}
            >
              <p className="text-center font-display text-[0.65rem] uppercase tracking-[0.35em] text-gold/70">
                Your message from Lunara
              </p>
              <h3 className="mt-3 text-center font-display text-3xl text-gold-bright text-glow-gold text-balance sm:text-4xl">
                {spread.name}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-center text-sm italic leading-relaxed text-muted-foreground text-pretty">
                {spread.tagline}
              </p>

              <div className="mt-7 flex flex-col gap-4">
                {cards.map((drawn, i) => {
                  const Icon = CELESTIAL[i % CELESTIAL.length]
                  const pos = spread.positions[i]
                  const isSelected = selectedIndex === i
                  return (
                    <button
                      key={`row-${drawn.card.id}-${i}`}
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`empire-row flex items-center gap-4 p-4 text-left ${
                        isSelected ? 'border-gold/60' : ''
                      }`}
                    >
                      <span className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border border-gold/40 bg-gold/[0.04]">
                        <Icon className="h-5 w-5 text-gold" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">
                          {pos?.label ?? 'The Card'}
                        </span>
                        <span className="mt-1 flex items-baseline gap-2">
                          <span className="font-display text-lg text-surface-foreground">
                            {drawn.card.name}
                          </span>
                          {drawn.orientation === 'reversed' && (
                            <span className="shrink-0 font-display text-[0.55rem] uppercase tracking-[0.2em] text-teal">
                              Reversed
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm italic leading-relaxed text-muted-foreground text-pretty">
                          {oneLine(drawn)}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* the detail panel: independent explanation of the tapped card */}
          {anyRevealed && (
            <div className="mt-10">
              {selected && selected.revealed && selectedPosition ? (
                <div
                  key={selectedIndex}
                  className="empire-panel p-6"
                  style={{ animation: 'empire-rise 0.4s ease-out both' }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gold/20 pb-3">
                    <div>
                      <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-gold/55">
                        {selectedPosition.label}
                      </p>
                      <h3 className="mt-1 font-display text-xl text-gold-bright text-glow-gold">
                        {selected.card.name}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.2em] ${
                        selected.orientation === 'reversed'
                          ? 'border-teal/50 text-teal'
                          : 'border-gold/50 text-gold/80'
                      }`}
                    >
                      {selected.orientation}
                    </span>
                  </div>

                  <p className="mt-1 text-xs italic text-muted-foreground">
                    {selectedPosition.hint}
                  </p>

                  {/* the card's own core meaning, independent of orientation */}
                  {selected.card.essence && (
                    <p className="mt-3 border-l-2 border-gold/40 pl-3 text-sm italic text-gold/85 text-pretty">
                      {selected.card.essence}
                    </p>
                  )}

                  {/* the framed reading */}
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-surface-foreground/95 text-pretty">
                    {interpretations[selectedIndex!] ??
                      (selected.orientation === 'upright'
                        ? selected.card.upright
                        : selected.card.reversed)}
                  </p>

                  {/* both meanings for reference, active one lit */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div
                      className={`rounded-lg border p-3 ${
                        selected.orientation === 'upright'
                          ? 'border-gold/50 bg-gold/5'
                          : 'border-gold/15 opacity-60'
                      }`}
                    >
                      <p className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-gold/70">
                        Upright
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-surface-foreground/85">
                        {selected.card.upright}
                      </p>
                    </div>
                    <div
                      className={`rounded-lg border p-3 ${
                        selected.orientation === 'reversed'
                          ? 'border-teal/50 bg-teal/5'
                          : 'border-gold/15 opacity-60'
                      }`}
                    >
                      <p className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-teal/80">
                        Reversed
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-surface-foreground/85">
                        {selected.card.reversed}
                      </p>
                    </div>
                  </div>

                  {/* keywords + meta */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {selected.card.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-gold/25 px-2.5 py-0.5 text-[0.65rem] text-gold/75"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gold/15 pt-2 text-[0.6rem] uppercase tracking-[0.25em] text-gold/50">
                    <span>{selected.card.suit ? SUIT_ELEMENT[selected.card.suit] : 'Arcanum'}</span>
                    {selected.card.layer && <span>Layer {selected.card.layer} / 78</span>}
                  </div>
                </div>
              ) : (
                <p className="flex items-center justify-center gap-2 text-center text-sm italic text-muted-foreground">
                  <Hand className="h-4 w-4 text-gold/60" />
                  Tap any turned card to hear Lunara read it.
                </p>
              )}
            </div>
          )}

          {/* the reading summary */}
          {allRevealed && summary && (
            <div
              className="empire-panel mt-8 p-6 text-center"
              style={{ animation: 'empire-rise 0.5s ease-out both' }}
            >
              <p className="flex items-center justify-center gap-2 font-display text-sm uppercase tracking-[0.3em] text-gold-bright">
                <Sparkles className="h-4 w-4 text-gold" />
                The Reading Speaks
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-surface-foreground/95 text-pretty">
                {summary}
              </p>
            </div>
          )}

          {allRevealed && (
            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={savedId !== null}
                className="inline-flex items-center gap-2 rounded-md border border-gold bg-gold/10 px-6 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-gold-bright transition-all duration-300 hover:bg-gold/20 hover:shadow-[0_0_22px_-6px_var(--gold)] disabled:cursor-default disabled:opacity-60"
              >
                <BookMarked className="h-4 w-4" />
                {savedId ? 'Saved to this device' : 'Save this reading'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="font-display text-xs uppercase tracking-[0.25em] text-gold/60 underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                Clear the table
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---- Saved readings, stored on this device ---- */}
      {history.length > 0 && (
        <div className="mt-16 border-t border-gold/15 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.35em] text-gold/70">
              <Clock className="h-4 w-4 text-gold/60" />
              Your saved readings
              <span className="text-gold/40">({history.length})</span>
            </p>
            <button
              type="button"
              onClick={handleClearHistory}
              className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-gold/45 underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Clear all
            </button>
          </div>

          <p className="mt-2 text-xs italic text-muted-foreground/80">
            Kept only on this device. Open one to return to that draw.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {history.map((r) => {
              const isOpen = r.id === savedId
              return (
                <li
                  key={r.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    isOpen ? 'border-gold/60 bg-gold/5' : 'border-gold/20 bg-surface/50 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-sm uppercase tracking-[0.12em] text-gold-bright">
                      {r.spreadName}
                    </p>
                    <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-gold/45">
                      {formatWhen(r.savedAt)}
                    </span>
                  </div>
                  {r.question.trim() ? (
                    <p className="mt-1.5 truncate text-xs italic text-muted-foreground">
                      &ldquo;{r.question.trim()}&rdquo;
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs italic text-muted-foreground/60">No question asked</p>
                  )}
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold/40">
                    {r.cards.length} {r.cards.length === 1 ? 'card' : 'cards'}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleOpenSaved(r)}
                      className="inline-flex items-center gap-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-bright"
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      Open
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(r.id)}
                      className="inline-flex items-center gap-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold/45 transition-colors hover:text-teal"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
