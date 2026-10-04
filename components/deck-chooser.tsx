'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { DeckPicker } from './deck-picker'
import { DECK_THEMES, type DeckThemeId, getDeckTheme } from '@/lib/tarot/decks'
import { DECK_THEME_STORAGE_KEY } from '@/lib/tarot/deck-preference'

// The first stop after a membership or account opens: pick the deck you will
// read with, then go straight to the cards. Only decks that are switched on
// in lib/tarot/decks.ts appear here.
export function DeckChooser({ welcome }: { welcome: string }) {
  const router = useRouter()
  const [deck, setDeck] = useState<DeckThemeId>(DECK_THEMES[0].id)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DECK_THEME_STORAGE_KEY)
      if (stored) setDeck(getDeckTheme(stored).id)
    } catch {
      /* storage unavailable: keep the default */
    }
  }, [])

  const choose = (id: DeckThemeId) => {
    setDeck(id)
    try {
      localStorage.setItem(DECK_THEME_STORAGE_KEY, id)
    } catch {
      /* storage unavailable: the reading page falls back to the main deck */
    }
  }

  const begin = () => {
    choose(deck)
    router.push('/reading')
  }

  return (
    <div className="empire-panel w-full max-w-md p-7 text-center">
      <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-gold/70">{welcome}</p>
      <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.14em] text-gold-bright text-glow-gold">
        Choose your deck
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-sm italic text-muted-foreground text-pretty">
        This is the deck your readings are drawn from. You can change it any time from the cards
        page.
      </p>

      <div className="mt-7">
        <DeckPicker value={deck} onChange={choose} size="large" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={begin}
          className="empire-cta inline-flex h-12 items-center justify-center gap-2 rounded-lg font-display text-xs uppercase tracking-[0.24em]"
        >
          Read with {getDeckTheme(deck).name}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <Link href="/account" className="text-sm text-gold-bright underline-offset-4 hover:underline">
          Go to my account instead
        </Link>
      </div>
    </div>
  )
}
