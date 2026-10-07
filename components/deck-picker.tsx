'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import {
  DECK_THEMES,
  type DeckThemeId,
  getDeckTheme,
  hasThemeArt,
  themeArtSrc,
} from '@/lib/tarot/decks'
import { proofSrc } from '@/lib/tarot/proofs'

const PREVIEW_CARD_ID = 'major-00'

interface Props {
  value: DeckThemeId
  onChange: (id: DeckThemeId) => void
  size?: 'default' | 'large'
}

export function DeckPicker({ value, onChange, size = 'default' }: Props) {
  const current = getDeckTheme(value)

  return (
    <div className="w-full">
      <div
        className={
          size === 'large'
            ? 'grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'
            : 'grid w-full grid-cols-2 gap-3 sm:grid-cols-4'
        }
        role="listbox"
        aria-label="Choose a live tarot deck"
      >
        {DECK_THEMES.map((theme) => {
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
              className={
                'relative min-w-0 rounded-xl border p-2 text-center transition-all ' +
                (active
                  ? 'border-gold bg-gold/10 shadow-[0_0_24px_-8px_rgba(212,175,55,0.8)]'
                  : 'border-gold/25 bg-background/25 hover:border-gold/55')
              }
            >
              {active && (
                <span className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-background/90 text-gold-bright">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              )}

              <span className="relative block aspect-[2/3] w-full overflow-hidden rounded-lg border border-gold/25 bg-black">
                <Image
                  src={previewSrc || '/placeholder.svg'}
                  alt={`${theme.name} deck preview`}
                  className="h-full w-full object-contain"
                  width={1024}
                  height={1536}
                  sizes="(max-width: 767px) 42vw, 180px"
                  draggable={false}
                />
              </span>

              <span className="mt-2 block truncate font-display text-[0.68rem] uppercase tracking-[0.08em] text-gold-bright sm:text-xs">
                {theme.name}
              </span>
              <span className="mt-1 inline-block rounded-full border border-gold/25 px-2 py-0.5 font-display text-[0.52rem] uppercase tracking-[0.18em] text-gold/60">
                Live
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
