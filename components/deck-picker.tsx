'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DECK_THEMES,
  FULL_DECK_CARD_COUNT,
  type DeckThemeId,
  getDeckTheme,
  hasThemeArt,
  themeArtSrc,
} from '@/lib/tarot/decks'
import { proofSrc } from '@/lib/tarot/proofs'

// Representative preview card shown on each theme's swatch: The Fool for
// every theme, since it is the first card every theme's rollout includes.
// Only decks switched on in lib/tarot/decks.ts (DECK_THEMES) are listed.
const PREVIEW_CARD_ID = 'major-00'

// Full 78-card vault order for side-swipe browsing of the chosen LIVE deck.
const VAULT_CARD_IDS: string[] = [
  ...Array.from({ length: 22 }, (_, i) => `major-${String(i).padStart(2, '0')}`),
  ...(['cups', 'pentacles', 'swords', 'wands'] as const).flatMap((suit) =>
    Array.from({ length: 14 }, (_, i) => `${suit}-${String(i + 1).padStart(2, '0')}`),
  ),
]

interface Props {
  value: DeckThemeId
  onChange: (id: DeckThemeId) => void
  /** Larger swatches, used on the dedicated deck page. */
  size?: 'default' | 'large'
}

export function DeckPicker({ value, onChange, size = 'default' }: Props) {
  const current = getDeckTheme(value)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      DECK_THEMES.findIndex((t) => t.id === current.id),
    ),
  )

  // Keep the snap carousel centered on the selected deck.
  useEffect(() => {
    const idx = DECK_THEMES.findIndex((t) => t.id === current.id)
    if (idx < 0) return
    setActiveIndex(idx)
    const el = scrollerRef.current
    if (!el) return
    const child = el.children[idx] as HTMLElement | undefined
    if (!child) return
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2
    el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [current.id])

  // Browsing the carousel never commits a deck or closes the phone drawer.
  // Only a deliberate tap selects it.
  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const bounds = el.getBoundingClientRect()
    const center = bounds.left + bounds.width / 2
    let best = 0
    let bestDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const rect = child.getBoundingClientRect()
      const dist = Math.abs(rect.left + rect.width / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setActiveIndex(best)
  }

  const selectIndex = (idx: number) => {
    const theme = DECK_THEMES[idx]
    if (!theme) return
    onChange(theme.id)
  }

  const slideBy = (delta: number) => {
    const next = Math.min(DECK_THEMES.length - 1, Math.max(0, activeIndex + delta))
    selectIndex(next)
  }

  const cardW = size === 'large' ? 'w-[11.5rem]' : 'w-[8.5rem]'

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">Choose your deck</p>

      <div className="relative w-full">
        {DECK_THEMES.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous deck"
              onClick={() => slideBy(-1)}
              disabled={activeIndex <= 0}
              className="lunara-sheet-chrome absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-background/80 text-gold md:inline-flex disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next deck"
              onClick={() => slideBy(1)}
              disabled={activeIndex >= DECK_THEMES.length - 1}
              className="lunara-sheet-chrome absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-background/80 text-gold md:inline-flex disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Horizontal snap swipe across LIVE decks. */}
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="lunara-deck-swipe flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[18%] pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="listbox"
          aria-label="LIVE decks"
        >
          {DECK_THEMES.map((theme, idx) => {
            const active = theme.id === current.id
            const previewSrc = hasThemeArt(theme.id, PREVIEW_CARD_ID)
              ? themeArtSrc(theme.id, PREVIEW_CARD_ID)
              : proofSrc(PREVIEW_CARD_ID)
            return (
              <button
                key={theme.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onChange(theme.id)}
                className={`group relative ${cardW} shrink-0 snap-center flex-col items-center gap-2 rounded-lg border p-2.5 text-center transition-all duration-300 ${
                  active
                    ? 'border-gold bg-gold/10 shadow-[0_0_22px_-6px_rgba(212,175,55,0.75),0_0_28px_-10px_rgba(63,214,200,0.45)]'
                    : 'border-gold/25 hover:border-gold/50'
                } flex`}
              >
                {active && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-background text-gold-bright shadow-[0_0_12px_-2px_rgba(212,175,55,0.7)]">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <span className="relative aspect-[2/3] w-full overflow-hidden rounded-md border border-gold/30 bg-black">
                  <Image
                    src={previewSrc || '/placeholder.svg'}
                    alt={`${theme.name} deck preview`}
                    className="h-full w-full object-contain"
                    width={1024}
                    height={1536}
                    sizes={size === 'large' ? '184px' : '136px'}
                    draggable={false}
                  />
                </span>
                <span
                  className={`font-display text-xs uppercase leading-tight tracking-[0.1em] ${
                    active ? 'text-gold-bright text-glow-gold' : 'text-gold/70'
                  }`}
                >
                  {theme.name}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-gold/45">
                  {theme.id === 'hallow-court' || theme.id === 'summer-court' ? 'LIVE · 78 cards' : theme.cardCount === FULL_DECK_CARD_COUNT ? '78 cards' : `${theme.cardCount} cards`}
                </span>
                <span className="sr-only">
                  Deck {idx + 1} of {DECK_THEMES.length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {DECK_THEMES.length > 1 && (
        <div className="flex items-center gap-1.5">
          {DECK_THEMES.map((theme, i) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              aria-pressed={theme.id === current.id}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                theme.id === current.id ? 'border-gold bg-gold/20 text-gold-bright' : 'border-gold/25 text-gold/70'
              }`}
              aria-label={`Choose ${theme.name}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <p className="max-w-sm text-center text-xs italic text-muted-foreground text-pretty">
        {current.tagline}
      </p>

      {/* In-app Lunara vault: side-swipe a few cards from the chosen LIVE deck. */}
      <LunaraVaultStrip themeId={current.id} size={size} />
    </div>
  )
}

function LunaraVaultStrip({
  themeId,
  size,
}: {
  themeId: DeckThemeId
  size: 'default' | 'large'
}) {
  const theme = getDeckTheme(themeId)
  const ids = VAULT_CARD_IDS.filter((id) => hasThemeArt(themeId, id))
  if (ids.length === 0) return null

  return (
    <div className="mt-1 w-full">
      <p className="mb-2 text-center font-display text-xs uppercase tracking-[0.35em] text-gold/55">
        Lunara vault · {theme.name}
      </p>
      <div
        className="lunara-deck-swipe flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label={`${theme.name} vault preview`}
      >
        {ids.map((id) => {
          const src = themeArtSrc(themeId, id)
          return (
            <div
              key={id}
              role="listitem"
              className={`relative ${size === 'large' ? 'w-20' : 'w-16'} shrink-0 snap-center overflow-hidden rounded-md border border-gold/35 bg-black shadow-[0_0_18px_-8px_rgba(212,175,55,0.55)]`}
            >
              <div className="aspect-[2/3] w-full">
                <Image
                  src={src}
                  alt={`${theme.name} ${id}`}
                  className="h-full w-full object-contain"
                  width={1024}
                  height={1536}
                  sizes={size === 'large' ? '80px' : '64px'}
                  draggable={false}
                  loading="lazy"
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-sm italic text-muted-foreground/80">
        Swipe sideways to browse. Only LIVE decks appear here.
      </p>
    </div>
  )
}
