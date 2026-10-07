'use client'

import { useState } from 'react'
import { BookOpen, Layers, Moon, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CardMeanings } from './card-meanings'
import { GradientDefs } from './gradient-defs'
import { GrowthConstellation } from './growth-constellation'
import { MobileSheet } from './mobile-sheet'
import { ReadingBoard } from './reading-board'
import { RuneOracle } from './rune-oracle'

type TabId = 'cards' | 'runes' | 'codex' | 'growth'

const TABS: { id: TabId; label: string; hint: string; icon: LucideIcon }[] = [
  { id: 'cards', label: 'The Cards', hint: 'Draw a reading', icon: Layers },
  { id: 'runes', label: 'The Runes', hint: 'Open the rune oracle', icon: Moon },
  { id: 'codex', label: 'Card Meanings', hint: 'Browse the codex', icon: BookOpen },
  { id: 'growth', label: 'Growth', hint: 'Open your constellation', icon: Star },
]

function Panel({
  id,
  premiumSpreads,
  signedIn,
  userName,
}: {
  id: TabId
  premiumSpreads: boolean
  signedIn: boolean
  userName: string | null
}) {
  if (id === 'cards') {
    return <ReadingBoard premiumSpreads={premiumSpreads} signedIn={signedIn} userName={userName} />
  }
  if (id === 'runes') return <RuneOracle signedIn={signedIn} userName={userName} />
  if (id === 'codex') return <CardMeanings />
  return <GrowthConstellation signedIn={signedIn} userName={userName} />
}

export function ExperienceTabs({
  premiumSpreads = false,
  signedIn = false,
  userName = null,
}: {
  premiumSpreads?: boolean
  signedIn?: boolean
  userName?: string | null
}) {
  const [tab, setTab] = useState<TabId>('cards')
  const [mobilePanel, setMobilePanel] = useState<TabId | null>(null)

  return (
    <div id="oracle" className="relative z-10 min-h-0 flex-1 scroll-mt-6">
      {/* Shared SVG gradients so emblems render in every experience. */}
      <GradientDefs />

      {/* Mobile front door: the app stays compact and each experience opens
          as its own page-within-a-page instead of stacking into one long scroll. */}
      <div className="flex h-full min-h-0 flex-col px-4 py-5 md:hidden">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-5 text-center">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.38em] text-gold/60">
              Lunara Ascension
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.06em] text-gold-bright text-glow-gold">
              Choose your path
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm italic leading-relaxed text-muted-foreground">
              Open one experience at a time. Your reading tools stay inside their own pages.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3" aria-label="Lunara experiences">
            {TABS.map(({ id, label, hint, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobilePanel(id)}
                className="lunara-sheet-launcher flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl px-3 py-4 text-center"
              >
                <Icon className="h-5 w-5 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.55)]" aria-hidden="true" />
                <span className="font-display text-xs uppercase tracking-[0.16em] text-gold-bright">
                  {label}
                </span>
                <span className="text-[0.7rem] italic leading-tight text-muted-foreground">
                  {hint}
                </span>
              </button>
            ))}
          </div>

          <p className="mx-auto mt-4 max-w-sm text-center text-[0.7rem] leading-relaxed text-muted-foreground">
            Readings are for entertainment and personal reflection only, not advice.
          </p>
        </div>

        {TABS.map(({ id, label }) => (
          <MobileSheet
            key={id}
            open={mobilePanel === id}
            onClose={() => setMobilePanel(null)}
            eyebrow="Lunara Ascension"
            title={label}
            backLabel="Lunara"
            desktopInline={false}
          >
            <Panel id={id} premiumSpreads={premiumSpreads} signedIn={signedIn} userName={userName} />
          </MobileSheet>
        ))}
      </div>

      {/* Desktop keeps the approved tabbed experience. */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-20 flex justify-center border-y border-gold/15 bg-background/80 py-3 backdrop-blur-md">
          <div
            role="tablist"
            aria-label="Choose an oracle"
            className="flex w-auto flex-wrap justify-center gap-2 px-4"
          >
            {TABS.map((t) => {
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`min-h-11 rounded-md border px-5 py-2 font-display text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                    active
                      ? 'border-gold bg-gold/15 text-gold-bright shadow-[0_0_18px_-6px_var(--gold)]'
                      : 'border-transparent text-gold/60 hover:text-gold'
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <p className="mx-auto max-w-2xl px-5 pt-4 text-center text-xs text-muted-foreground">
          Readings are for entertainment and personal reflection only, not advice.
        </p>

        <Panel id={tab} premiumSpreads={premiumSpreads} signedIn={signedIn} userName={userName} />
      </div>
    </div>
  )
}
