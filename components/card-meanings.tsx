'use client'

import { useMemo, useState } from 'react'
import { Crown, Search } from 'lucide-react'
import { buildDeck } from '@/lib/tarot/deck'
import type { Suit } from '@/lib/tarot/types'
import { SuitEmblem } from './suit-emblem'
import { Wings } from './wings'

const DECK = buildDeck()

type Arcana = 'major' | 'minor'

const ROMAN = [
  'O', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
]
const COURT = ['', '', '', '', '', '', '', '', '', '', '', 'P', 'Kn', 'Q', 'K']

// A miniature of the drawn-card art: the Empire's wingset behind the suit
// emblem, badged with the card's number so the list matches the real card.
function CardThumb({ card }: { card: (typeof DECK)[number] }) {
  const isMajor = card.arcana === 'major'
  const isCourt = !isMajor && card.number >= 11
  const pipCount = !isMajor && card.number <= 10 ? card.number : 0
  const badge = isMajor ? ROMAN[card.number] : isCourt ? COURT[card.number] : String(pipCount)

  return (
    <div className="relative flex h-11 w-11 items-center justify-center">
      <Wings className="pointer-events-none absolute left-1/2 top-1/2 w-11 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90" />
      <div className="relative flex flex-col items-center">
        {isCourt && <Crown className="h-2.5 w-2.5 text-gold-bright" />}
        <SuitEmblem suit={isMajor ? undefined : card.suit} className="relative h-6 w-6" />
      </div>
      <span className="absolute -bottom-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-gold/70 bg-black/60 px-1 font-display text-[0.55rem] font-semibold leading-none text-gold-bright backdrop-blur-sm">
        {badge}
      </span>
    </div>
  )
}

const SUITS: { id: Suit; label: string; sign: string }[] = [
  { id: 'wands', label: 'Wands', sign: 'Ignum · Will' },
  { id: 'cups', label: 'Cups', sign: 'Aquum · Heart' },
  { id: 'swords', label: 'Swords', sign: 'Aerum · Mind' },
  { id: 'pentacles', label: 'Pentacles', sign: 'Terrum · Craft' },
]

function CardEntry({ card }: { card: (typeof DECK)[number] }) {
  return (
    <article className="empire-row flex gap-4 p-4">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <CardThumb card={card} />
        <span className="text-[0.55rem] uppercase tracking-[0.15em] text-gold/40">
          {card.layer}/78
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-sm uppercase tracking-[0.1em] text-gold-bright">
          {card.name}
        </h3>
        {card.essence && (
          <p className="mt-1 text-xs italic leading-relaxed text-gold/75 text-pretty">
            {card.essence}
          </p>
        )}
        <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-surface-foreground/85">
          <p>
            <span className="font-display uppercase tracking-[0.15em] text-teal">Upright. </span>
            {card.upright}
          </p>
          <p>
            <span className="font-display uppercase tracking-[0.15em] text-gold/70">Reversed. </span>
            {card.reversed}
          </p>
        </div>
      </div>
    </article>
  )
}

export function CardMeanings() {
  const [arcana, setArcana] = useState<Arcana>('major')
  const [suit, setSuit] = useState<Suit>('wands')
  const [query, setQuery] = useState('')

  const searching = query.trim().length > 0

  // Global search across the whole deck, ignoring the current section.
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return DECK.filter(
      (card) =>
        card.name.toLowerCase().includes(q) ||
        card.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (card.essence?.toLowerCase().includes(q) ?? false),
    )
  }, [query])

  // The cards shown for the active section when not searching.
  const sectionCards = useMemo(() => {
    if (arcana === 'major') return DECK.filter((c) => c.arcana === 'major')
    return DECK.filter((c) => c.suit === suit)
  }, [arcana, suit])

  const activeSuit = SUITS.find((s) => s.id === suit)!

  return (
    <section className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 pt-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">The Codex</p>
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.12em] text-gold-bright text-glow-gold sm:text-4xl">
          Card Meanings
        </h2>
        <p className="max-w-md text-sm italic leading-relaxed text-muted-foreground text-pretty">
          Every layer of the magik world, laid bare. Study a card upright and reversed before
          Lunara ever deals it.
        </p>
      </div>

      {/* ---- Search ---- */}
      <div className="mx-auto mt-8 flex max-w-sm items-center gap-2 rounded-md border border-gold/30 bg-surface/50 px-4 py-2.5 focus-within:border-gold/60">
        <Search className="h-4 w-4 shrink-0 text-gold/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all 78 cards"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          aria-label="Search cards"
        />
        {searching && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="shrink-0 font-display text-[0.6rem] uppercase tracking-[0.15em] text-gold/50 transition-colors hover:text-gold"
          >
            Clear
          </button>
        )}
      </div>

      {searching ? (
        <>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-gold/40">
            {searchResults.length} {searchResults.length === 1 ? 'card' : 'cards'} found
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {searchResults.map((card) => (
              <CardEntry key={card.id} card={card} />
            ))}
          </div>
          {searchResults.length === 0 && (
            <p className="mt-10 text-center text-sm italic text-muted-foreground">
              Lunara holds no such card. Try another word.
            </p>
          )}
        </>
      ) : (
        <>
          {/* ---- Tier 1: Major / Minor ---- */}
          <div className="mt-8 flex justify-center gap-2">
            {(['major', 'minor'] as Arcana[]).map((a) => {
              const active = a === arcana
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArcana(a)}
                  className={`rounded-md border px-6 py-2 font-display text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                    active
                      ? 'border-gold bg-gold/15 text-gold-bright shadow-[0_0_16px_-6px_var(--gold)]'
                      : 'border-gold/25 text-gold/70 hover:border-gold/60 hover:text-gold'
                  }`}
                >
                  {a === 'major' ? 'Major Arcana' : 'Minor Arcana'}
                </button>
              )
            })}
          </div>

          {/* ---- Tier 2: suit picker (Minor only) ---- */}
          {arcana === 'minor' && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUITS.map((s) => {
                const active = s.id === suit
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSuit(s.id)}
                    className={`flex items-center gap-2 rounded-md border px-4 py-1.5 transition-all duration-300 ${
                      active
                        ? 'border-gold bg-gold/10 shadow-[0_0_16px_-6px_var(--gold)]'
                        : 'border-gold/25 hover:border-gold/60'
                    }`}
                    aria-pressed={active}
                  >
                    <SuitEmblem suit={s.id} className="h-5 w-5" />
                    <span
                      className={`font-display text-[0.65rem] uppercase tracking-[0.15em] ${
                        active ? 'text-gold-bright' : 'text-gold/70'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ---- Section caption ---- */}
          <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-gold/40">
            {arcana === 'major'
              ? `The 22 Major Arcana`
              : `${activeSuit.label} · ${activeSuit.sign} · 14 cards`}
          </p>

          {/* ---- Meaning grid ---- */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sectionCards.map((card) => (
              <CardEntry key={card.id} card={card} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
