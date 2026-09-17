'use client'

import { useState } from 'react'
import { CardMeanings } from './card-meanings'
import { GradientDefs } from './gradient-defs'
import { GrowthConstellation } from './growth-constellation'
import { ReadingBoard } from './reading-board'
import { RuneOracle } from './rune-oracle'

type TabId = 'cards' | 'runes' | 'codex' | 'growth'

const TABS: { id: TabId; label: string }[] = [
  { id: 'cards', label: 'The Cards' },
  { id: 'runes', label: 'The Runes' },
  { id: 'codex', label: 'Card Meanings' },
  { id: 'growth', label: 'Growth' },
]

export function ExperienceTabs({ premiumSpreads = false }: { premiumSpreads?: boolean }) {
  const [tab, setTab] = useState<TabId>('cards')

  return (
    <div id="oracle" className="relative z-10 scroll-mt-6">
      {/* Shared SVG gradients so emblems render in every tab */}
      <GradientDefs />

      {/* ---- Tab bar ---- */}
      <div className="sticky top-0 z-20 flex justify-center border-y border-gold/15 bg-background/80 py-3 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Choose an oracle"
          className="flex flex-wrap justify-center gap-2 px-4"
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
                className={`rounded-md border px-5 py-2 font-display text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
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

      {/* ---- Active panel ---- */}
      {tab === 'cards' && <ReadingBoard premiumSpreads={premiumSpreads} />}
      {tab === 'runes' && <RuneOracle />}
      {tab === 'codex' && <CardMeanings />}
      {tab === 'growth' && <GrowthConstellation />}
    </div>
  )
}
