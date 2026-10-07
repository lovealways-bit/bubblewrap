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
                  ? 'border-gold bg-gold/10 shadow-[0_0_24px_-8px_rgba(212,175,55,0¶»§q«^