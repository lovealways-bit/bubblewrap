'use client'

import { useState, type ReactNode } from 'react'
import { BookHeart, CalendarDays, Layers, Palette, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MobileSheet, SheetLauncher } from './mobile-sheet'

const ICONS: Record<string, LucideIcon> = {
  deck: Layers,
  chart: Sparkles,
  atelier: Palette,
  journal: BookHeart,
  calendar: CalendarDays,
}

export interface AccountSection {
  id: string
  eyebrow: string
  title: string
  /** One line shown on the phone launcher row. */
  summary: string
  content: ReactNode
}

// Account page sections. Desktop shows every panel stacked as before; phones
// show a short menu, and each row opens its panel in a bottom sheet with
// Back and Close, instead of one long scroll.
export function AccountSections({ sections }: { sections: AccountSection[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const close = () => setOpen(null)

  return (
    <>
      <nav aria-label="Account sections" className="mt-8 flex flex-col gap-2.5 md:hidden">
        {sections.map((s) => (
          <SheetLauncher
            key={s.id}
            icon={ICONS[s.id]}
            label={s.eyebrow}
            value={s.title}
            hint={s.summary}
            onOpen={() => setOpen(s.id)}
          />
        ))}
      </nav>
      {sections.map((s) => (
        <MobileSheet
          key={s.id}
          open={open === s.id}
          onClose={close}
          eyebrow={s.eyebrow}
          title={s.title}
          backLabel="Account"
        >
          {s.content}
        </MobileSheet>
      ))}
    </>
  )
}
