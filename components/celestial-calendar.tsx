import type { CelestialEvent, CelestialKind } from '@/lib/celestial/events'

interface CurrentMoon {
  name: string
  emblem: string
  illumination: number
}

const KIND_LABEL: Record<CelestialKind, string> = {
  moon: 'Moon',
  'eclipse-solar': 'Solar Eclipse',
  'eclipse-lunar': 'Lunar Eclipse',
  solstice: 'Solstice',
  equinox: 'Equinox',
  sabbat: 'Sabbat',
}

// Accent tint per event kind. Eclipses are the signature moments, so they get
// the brightest treatment; everything else stays quiet gold.
const KIND_CLASS: Record<CelestialKind, string> = {
  moon: 'text-gold/70 border-gold/20',
  'eclipse-solar': 'text-amber-300 border-amber-300/40',
  'eclipse-lunar': 'text-rose-300 border-rose-300/40',
  solstice: 'text-gold-bright border-gold/30',
  equinox: 'text-gold-bright border-gold/30',
  sabbat: 'text-violet-300/80 border-violet-300/30',
}

function monthKey(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function dayNum(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    day: '2-digit',
    timeZone: 'UTC',
  })
}

function weekday(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: 'short',
    timeZone: 'UTC',
  })
}

export function CelestialCalendar({
  events,
  currentMoon,
}: {
  events: CelestialEvent[]
  currentMoon: CurrentMoon
}) {
  // Group chronological events by month for readable sections.
  const groups: { month: string; items: CelestialEvent[] }[] = []
  for (const e of events) {
    const m = monthKey(e.date)
    const last = groups[groups.length - 1]
    if (last && last.month === m) last.items.push(e)
    else groups.push({ month: m, items: [e] })
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      <section className="empire-panel flex items-center gap-4 p-5">
        <span
          aria-hidden="true"
          className="font-display text-4xl leading-none text-gold-bright"
        >
          {currentMoon.emblem}
        </span>
        <div>
          <p className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold/60">
            Tonight
          </p>
          <p className="font-display text-lg font-bold text-gold-bright">
            {currentMoon.name}
          </p>
          <p className="text-xs italic text-muted-foreground">
            {currentMoon.illumination}% illuminated
          </p>
        </div>
      </section>

      {groups.length === 0 ? (
        <p className="text-center text-sm italic text-muted-foreground">
          No events on the horizon just now. Check back as the sky turns.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.month}>
            <h2 className="mb-3 font-display text-xs uppercase tracking-[0.3em] text-gold/60">
              {group.month}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {group.items.map((e, i) => (
                <li
                  key={`${e.date}-${e.title}-${i}`}
                  className={`empire-panel flex items-start gap-4 border-l-2 p-4 ${KIND_CLASS[e.kind]}`}
                >
                  <div className="flex w-12 shrink-0 flex-col items-center">
                    <span className="font-display text-xl font-bold leading-none text-gold-bright">
                      {dayNum(e.date)}
                    </span>
                    <span className="mt-0.5 font-display text-[0.55rem] uppercase tracking-[0.15em] text-gold/50">
                      {weekday(e.date)}
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 pt-0.5 text-2xl leading-none"
                  >
                    {e.emblem}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {e.title}
                      </h3>
                      <span className="font-display text-[0.55rem] uppercase tracking-[0.18em] opacity-70">
                        {KIND_LABEL[e.kind]}
                      </span>
                    </div>
                    {e.detail && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
                        {e.detail}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
