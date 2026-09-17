'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookMarked, Clock, Sparkles, Trash2 } from 'lucide-react'
import {
  castRunes,
  getRuneMeaning,
  getRuneReadingSummary,
  getRuneSpread,
  RUNES,
  RUNE_SPREADS,
  type CastRune,
  type Rune,
  type RuneSpread,
} from '@/lib/runes/runes'
import {
  clearRuneHistory,
  deleteRuneReading,
  loadRuneHistory,
  saveRuneReading,
  type SavedRuneReading,
} from '@/lib/runes/history'

const STORAGE_KEY = 'empire-tarot-runes-v1'

interface PersistedCast {
  spreadId: string
  question: string
  cast: { runeId: string; orientation: 'upright' | 'merkstave' }[]
}

function serialize(spreadId: string, question: string, cast: CastRune[]): PersistedCast {
  return {
    spreadId,
    question,
    cast: cast.map((c) => ({ runeId: c.rune.id, orientation: c.orientation })),
  }
}

function hydrate(data: PersistedCast): CastRune[] {
  return data.cast
    .map(({ runeId, orientation }) => {
      const rune = RUNES.find((r) => r.id === runeId)
      return rune ? { rune, orientation } : null
    })
    .filter((c): c is CastRune => c !== null)
}

export function RuneOracle() {
  const [spreadId, setSpreadId] = useState<string>('single')
  const [question, setQuestion] = useState('')
  const [cast, setCast] = useState<CastRune[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [casting, setCasting] = useState(false)
  const [browseId, setBrowseId] = useState<string | null>(null)
  const [history, setHistory] = useState<SavedRuneReading[]>([])
  const [justSaved, setJustSaved] = useState(false)

  const spread = useMemo(() => getRuneSpread(spreadId), [spreadId])

  // Load the saved casts on mount.
  useEffect(() => {
    setHistory(loadRuneHistory())
  }, [])

  // Restore a prior cast so refreshing mid-reading does not lose it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as PersistedCast
      const runes = hydrate(data)
      if (runes.length > 0) {
        setSpreadId(data.spreadId)
        setQuestion(data.question ?? '')
        setCast(runes)
      }
    } catch {
      // Ignore malformed storage.
    }
  }, [])

  const persist = useCallback((sId: string, q: string, c: CastRune[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(sId, q, c)))
    } catch {
      // Storage may be unavailable; the cast still works in memory.
    }
  }, [])

  const handleCast = useCallback(() => {
    setSelectedIndex(null)
    setBrowseId(null)
    setJustSaved(false)
    setCasting(true)
    setTimeout(() => {
      const next = castRunes(spread.count)
      setCast(next)
      setCasting(false)
      persist(spreadId, question, next)
    }, 450)
  }, [spread.count, spreadId, question, persist])

  const handleReset = useCallback(() => {
    setCast([])
    setSelectedIndex(null)
    setBrowseId(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // no-op
    }
  }, [])

  const summary = useMemo(
    () => (cast.length > 0 ? getRuneReadingSummary(spread, cast, question) : ''),
    [spread, cast, question],
  )

  const handleSave = useCallback(() => {
    if (cast.length === 0) return
    const next = saveRuneReading({
      spreadId,
      spreadName: spread.name,
      question,
      cast: cast.map((c) => ({ runeId: c.rune.id, orientation: c.orientation })),
      summary,
    })
    setHistory(next)
    setJustSaved(true)
  }, [cast, spreadId, spread.name, question, summary])

  const handleOpenSaved = useCallback((saved: SavedRuneReading) => {
    const runes = saved.cast
      .map(({ runeId, orientation }) => {
        const rune = RUNES.find((r) => r.id === runeId)
        return rune ? { rune, orientation } : null
      })
      .filter((c): c is CastRune => c !== null)
    if (runes.length === 0) return
    setSpreadId(saved.spreadId)
    setQuestion(saved.question)
    setCast(runes)
    setSelectedIndex(null)
    setBrowseId(null)
    setJustSaved(false)
    document.getElementById('the-runes')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleDeleteSaved = useCallback((id: string) => {
    setHistory(deleteRuneReading(id))
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory(clearRuneHistory())
  }, [])

  // The detail panel: an explicit cast selection wins, else a browsed stave.
  const detail: { rune: Rune; orientation: 'upright' | 'merkstave'; text: string; label?: string } | null =
    useMemo(() => {
      if (selectedIndex !== null && cast[selectedIndex]) {
        const c = cast[selectedIndex]
        return {
          rune: c.rune,
          orientation: c.orientation,
          text: getRuneMeaning(c),
          label: spread.positions[selectedIndex]?.label,
        }
      }
      if (browseId) {
        const rune = RUNES.find((r) => r.id === browseId)
        if (rune) return { rune, orientation: 'upright', text: rune.upright }
      }
      return null
    }, [selectedIndex, cast, spread, browseId])

  const hasCast = cast.length > 0

  return (
    <section
      id="the-runes"
      className="relative z-10 mx-auto w-full max-w-4xl scroll-mt-8 px-6 pb-24 pt-16"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">
          The Elder Futhark
        </p>
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.12em] text-gold-bright text-glow-gold sm:text-4xl">
          Cast the Runes
        </h2>
        <p className="max-w-md text-sm italic leading-relaxed text-muted-foreground text-pretty">
          Twenty-four stones of the old alphabet. Choose a casting, ask if you wish, and let
          Lunara throw the stones.
        </p>
      </div>

      {/* ---- Spread selector ---- */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {RUNE_SPREADS.map((s: RuneSpread) => {
          const active = s.id === spreadId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSpreadId(s.id)
                handleReset()
              }}
              className={`flex min-w-[10rem] flex-col items-center gap-1 rounded-lg border px-5 py-3 text-center transition-all duration-300 ${
                active
                  ? 'border-gold bg-gold/15 shadow-[0_0_18px_-6px_var(--gold)]'
                  : 'border-gold/25 hover:border-gold/60 hover:bg-gold/5'
              }`}
            >
              <span
                className={`font-display text-sm uppercase tracking-[0.16em] ${active ? 'text-gold-bright' : 'text-gold/80'}`}
              >
                {s.name}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.12em] text-gold/45">
                {s.count} {s.count === 1 ? 'stone' : 'stones'}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-xs italic text-muted-foreground">{spread.tagline}</p>

      {/* ---- Question ---- */}
      <div className="mx-auto mt-6 max-w-md">
        <label
          htmlFor="rune-question"
          className="mb-2 block text-center font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold/60"
        >
          Ask the stones (optional)
        </label>
        <input
          id="rune-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What weighs on you?"
          className="w-full rounded-md border border-gold/30 bg-surface/50 px-4 py-2.5 text-center text-sm text-surface-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40"
        />
      </div>

      {/* ---- Cast control ---- */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={handleCast}
          disabled={casting}
          className="empire-cta group inline-flex items-center gap-2.5 rounded-md px-10 py-3.5 font-display text-sm uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Sparkles className={`h-4 w-4 ${casting ? 'animate-pulse' : ''}`} />
          {hasCast ? 'Cast again' : 'Cast the stones'}
        </button>
        {hasCast && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-gold/25 px-5 py-3 font-display text-xs uppercase tracking-[0.2em] text-gold/60 transition-colors hover:border-gold/50 hover:text-gold"
          >
            Clear
          </button>
        )}
      </div>

      {/* ---- Cast board ---- */}
      {hasCast && (
        <>
          <p className="mt-10 text-center font-display text-xs uppercase tracking-[0.35em] text-gold/60">
            {hasCast && detail === null ? 'Choose a stone to read it' : 'The stones are cast'}
          </p>
          <div
            className={`mx-auto mt-5 grid justify-center gap-4 ${
              spread.count === 1 ? 'max-w-[9rem] grid-cols-1' : 'max-w-lg grid-cols-3'
            }`}
          >
            {cast.map((c, i) => {
              const active = selectedIndex === i
              return (
                <button
                  key={`${c.rune.id}-${i}`}
                  type="button"
                  onClick={() => {
                    setBrowseId(null)
                    setSelectedIndex(active ? null : i)
                  }}
                  style={{ animation: `empire-rise 0.5s ease-out both`, animationDelay: `${i * 90}ms` }}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
                    active
                      ? 'border-gold bg-gold/15 shadow-[0_0_22px_-6px_var(--gold)]'
                      : 'border-gold/25 bg-surface/40 hover:border-gold/60 hover:bg-gold/5'
                  }`}
                >
                  <span className="font-display text-[0.6rem] uppercase tracking-[0.2em] text-gold/50">
                    {spread.positions[i]?.label}
                  </span>
                  <span
                    className={`font-runic text-5xl leading-none transition-transform ${
                      active ? 'text-gold-bright text-glow-gold' : 'text-gold/85'
                    } ${c.orientation === 'merkstave' ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    {c.rune.symbol}
                  </span>
                  <span className="font-display text-xs uppercase tracking-[0.14em] text-gold/80">
                    {c.rune.name}
                  </span>
                  {c.orientation === 'merkstave' && (
                    <span className="text-[0.55rem] uppercase tracking-[0.2em] text-gold/45">
                      Merkstave
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ---- Detail panel ---- */}
      {detail && (
        <div
          className="empire-panel mx-auto mt-8 flex max-w-md flex-col items-center gap-4 p-8 text-center"
          style={{ animation: 'empire-rise 0.4s ease-out both' }}
        >
          {detail.label && (
            <p className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold/55">
              {detail.label}
            </p>
          )}
          <span
            className={`font-runic text-7xl leading-none text-gold-bright text-glow-gold transition-transform ${
              detail.orientation === 'merkstave' ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          >
            {detail.rune.symbol}
          </span>
          <div>
            <p className="font-display text-xl uppercase tracking-[0.2em] text-gold-bright">
              {detail.rune.name}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gold/60">
              {detail.rune.phoneme} · {detail.rune.essence}
              {detail.orientation === 'merkstave' ? ' · Merkstave' : ''}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-surface-foreground/90 text-pretty">
            {detail.text}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {detail.rune.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-gold/25 px-3 py-0.5 text-[0.65rem] uppercase tracking-[0.15em] text-gold/70"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ---- Reading summary ---- */}
      {hasCast && summary && (
        <div className="empire-panel mx-auto mt-8 max-w-2xl p-7 text-center">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-gold/70">
            Lunara&apos;s Reading
          </p>
          <p className="mt-3 text-sm leading-relaxed text-surface-foreground/90 text-pretty">
            {summary}
          </p>
        </div>
      )}

      {/* ---- Save this cast ---- */}
      {hasCast && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={justSaved}
            className="inline-flex items-center gap-2.5 rounded-md border border-gold bg-gold/10 px-7 py-3 font-display text-sm uppercase tracking-[0.2em] text-gold-bright transition-all duration-300 hover:bg-gold/20 hover:shadow-[0_0_22px_-6px_var(--gold)] disabled:cursor-default disabled:border-gold/40 disabled:text-gold/60 disabled:shadow-none"
          >
            <BookMarked className="h-4 w-4" />
            {justSaved ? 'Saved to this device' : 'Save this casting'}
          </button>
        </div>
      )}

      {/* ---- Saved castings (on-device history) ---- */}
      {history.length > 0 && (
        <div className="mx-auto mt-14 max-w-2xl">
          <div className="flex items-center justify-between border-b border-gold/20 pb-3">
            <p className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.3em] text-gold/70">
              <Clock className="h-3.5 w-3.5" />
              Your saved castings ({history.length})
            </p>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-[0.65rem] uppercase tracking-[0.2em] text-gold/45 transition-colors hover:text-gold"
            >
              Clear all
            </button>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {history.map((saved) => (
              <li
                key={saved.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gold/20 bg-surface/40 p-4"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm uppercase tracking-[0.14em] text-gold-bright">
                    {saved.spreadName}
                  </p>
                  {saved.question && (
                    <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                      &ldquo;{saved.question}&rdquo;
                    </p>
                  )}
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold/45">
                    {saved.cast.length} {saved.cast.length === 1 ? 'stone' : 'stones'} ·{' '}
                    {new Date(saved.savedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenSaved(saved)}
                    className="rounded-md border border-gold/40 px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold-bright"
                  >
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSaved(saved.id)}
                    aria-label="Delete this casting"
                    className="rounded-md border border-gold/20 p-2 text-gold/50 transition-colors hover:border-teal/50 hover:text-teal"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- Selectable rune set (reference codex) ---- */}
      <p className="mt-16 text-center font-display text-xs uppercase tracking-[0.4em] text-gold/60">
        Or study any stave
      </p>
      <div className="mx-auto mt-6 grid max-w-2xl grid-cols-4 gap-3 sm:grid-cols-6">
        {RUNES.map((rune) => {
          const active = browseId === rune.id && selectedIndex === null
          return (
            <button
              key={rune.id}
              type="button"
              onClick={() => {
                setSelectedIndex(null)
                setBrowseId(active ? null : rune.id)
              }}
              title={rune.name}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border transition-all duration-300 ${
                active
                  ? 'border-gold bg-gold/15 shadow-[0_0_18px_-6px_var(--gold)]'
                  : 'border-gold/25 hover:border-gold/60 hover:bg-gold/5'
              }`}
            >
              <span
                className={`font-runic text-2xl ${active ? 'text-gold-bright' : 'text-gold/80'}`}
                aria-hidden="true"
              >
                {rune.symbol}
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.1em] text-gold/50">
                {rune.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
