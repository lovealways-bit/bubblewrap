'use client'

import { Check } from 'lucide-react'
import { DECK_THEMES, type DeckThemeId, hasThemeArt, themeArtSrc } from '@/lib/tarot/decks'
import { proofSrc } from '@/lib/tarot/proofs'

// Representative preview card shown on each theme's swatch: The Fool for
// every theme, since it is the first card every theme's rollout includes.
const PREVIEW_CARD_ID = 'major-00'

interface Props {
  value: DeckThemeId
  onChange: (id: DeckThemeId) => void
}

export function DeckPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">Choose your deck</p>
      <div className="flex flex-wrap justify-center gap-4">
        {DECK_THEMES.map((theme) => {
          const active = theme.id === value
          const previewSrc = hasThemeArt(theme.id, PREVIEW_CARD_ID)
            ? themeArtSrc(theme.id, PREVIEW_CARD_ID)
            : proofSrc(PREVIEW_CARD_ID)
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              aria-pressed={active}
              className={`group relative flex w-28 flex-col items-center gap-2 rounded-lg border p-2.5 text-center transition-all duration-300 ${
                active
                  ? 'border-gold bg-gold/10 shadow-[0_0_18px_-6px_var(--gold)]'
                  : 'border-gold/25 hover:border-gold/50'
              }`}
            >
              {active && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-gold bg-background text-gold-bright">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="relative aspect-[2/3] w-full overflow-hidden rounded-md border border-gold/30 bg-black">
                <img
                  src={previewSrc || '/placeholder.svg'}
                  alt={`${theme.name} deck preview`}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </span>
              <span
                className={`font-display text-[0.6rem] uppercase leading-tight tracking-[0.1em] ${
                  active ? 'text-gold-bright' : 'text-gold/70'
                }`}
              >
                {theme.name}
              </span>
            </button>
          )
        })}
      </div>
      <p className="max-w-sm text-center text-xs italic text-muted-foreground text-pretty">
        {DECK_THEMES.find((t) => t.id === value)?.tagline}
      </p>
    </div>
  )
}
