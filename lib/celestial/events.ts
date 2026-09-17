import { upcomingPrincipalPhases } from './moon'

export type CelestialKind =
  | 'moon'
  | 'eclipse-solar'
  | 'eclipse-lunar'
  | 'solstice'
  | 'equinox'
  | 'sabbat'

export interface CelestialEvent {
  date: string // ISO date (YYYY-MM-DD), UTC
  kind: CelestialKind
  title: string
  detail: string
  emblem: string
}

// Curated astronomical events (UTC dates), sourced from NASA eclipse tables and
// standard solstice/equinox almanacs. Extend this list as years roll forward.
const FIXED_EVENTS: CelestialEvent[] = [
  // ── 2026 ──────────────────────────────────────────────────────────────
  {
    date: '2026-02-01',
    kind: 'sabbat',
    title: 'Imbolc',
    detail: 'Cross-quarter fire festival — first stirrings of spring, a time for cleansing and new intentions.',
    emblem: '✦',
  },
  {
    date: '2026-02-17',
    kind: 'eclipse-solar',
    title: 'Annular Solar Eclipse',
    detail: 'A ring of fire eclipse across the southern hemisphere. Powerful new-moon energy for release and reset.',
    emblem: '◎',
  },
  {
    date: '2026-03-03',
    kind: 'eclipse-lunar',
    title: 'Total Lunar Eclipse',
    detail: 'A blood moon — the full moon slips fully into Earth\u2019s shadow. Culminations and emotional reckonings.',
    emblem: '●',
  },
  {
    date: '2026-03-20',
    kind: 'equinox',
    title: 'March Equinox',
    detail: 'Day and night in balance. The astrological new year as the Sun enters Aries.',
    emblem: '♈',
  },
  {
    date: '2026-05-01',
    kind: 'sabbat',
    title: 'Beltane',
    detail: 'Cross-quarter festival of fertility and fire. Passion, union, and the flowering of intent.',
    emblem: '✦',
  },
  {
    date: '2026-06-21',
    kind: 'solstice',
    title: 'June Solstice',
    detail: 'The longest day. Peak solar power as the Sun enters Cancer — a threshold of light.',
    emblem: '☀',
  },
  {
    date: '2026-08-01',
    kind: 'sabbat',
    title: 'Lughnasadh',
    detail: 'The first harvest. Gratitude, reaping what was sown, and honoring effort.',
    emblem: '✦',
  },
  {
    date: '2026-08-12',
    kind: 'eclipse-solar',
    title: 'Total Solar Eclipse',
    detail: 'Totality sweeps across the Arctic, Greenland, Iceland, and Spain. A profound new beginning.',
    emblem: '◎',
  },
  {
    date: '2026-08-28',
    kind: 'eclipse-lunar',
    title: 'Partial Lunar Eclipse',
    detail: 'The full moon is partly shadowed. A moment to adjust course and shed what no longer fits.',
    emblem: '◗',
  },
  {
    date: '2026-09-23',
    kind: 'equinox',
    title: 'September Equinox',
    detail: 'Balance returns as the Sun enters Libra. Harvest\u2019s midpoint and a turn toward introspection.',
    emblem: '♎',
  },
  {
    date: '2026-10-31',
    kind: 'sabbat',
    title: 'Samhain',
    detail: 'The veil thins. The witches\u2019 new year — ancestor work, divination, and endings honored.',
    emblem: '✦',
  },
  {
    date: '2026-12-21',
    kind: 'solstice',
    title: 'December Solstice',
    detail: 'The longest night. The Sun\u2019s rebirth as it enters Capricorn — stillness and deep renewal.',
    emblem: '❄',
  },
  // ── 2027 ──────────────────────────────────────────────────────────────
  {
    date: '2027-02-01',
    kind: 'sabbat',
    title: 'Imbolc',
    detail: 'Cross-quarter fire festival — first stirrings of spring, a time for cleansing and new intentions.',
    emblem: '✦',
  },
  {
    date: '2027-02-06',
    kind: 'eclipse-solar',
    title: 'Annular Solar Eclipse',
    detail: 'A ring of fire across South America, the Atlantic, and Africa. New-moon energy for bold resets.',
    emblem: '◎',
  },
  {
    date: '2027-03-20',
    kind: 'equinox',
    title: 'March Equinox',
    detail: 'Day and night in balance. The astrological new year as the Sun enters Aries.',
    emblem: '♈',
  },
  {
    date: '2027-05-01',
    kind: 'sabbat',
    title: 'Beltane',
    detail: 'Cross-quarter festival of fertility and fire. Passion, union, and the flowering of intent.',
    emblem: '✦',
  },
  {
    date: '2027-06-21',
    kind: 'solstice',
    title: 'June Solstice',
    detail: 'The longest day. Peak solar power as the Sun enters Cancer — a threshold of light.',
    emblem: '☀',
  },
  {
    date: '2027-08-01',
    kind: 'sabbat',
    title: 'Lughnasadh',
    detail: 'The first harvest. Gratitude, reaping what was sown, and honoring effort.',
    emblem: '✦',
  },
  {
    date: '2027-08-02',
    kind: 'eclipse-solar',
    title: 'Great Total Solar Eclipse',
    detail: 'One of the longest totalities of the century, crossing North Africa and the Middle East. A landmark reset.',
    emblem: '◎',
  },
  {
    date: '2027-08-17',
    kind: 'eclipse-lunar',
    title: 'Penumbral Lunar Eclipse',
    detail: 'A subtle shadow crosses the full moon. Quiet emotional recalibration.',
    emblem: '◔',
  },
  {
    date: '2027-09-23',
    kind: 'equinox',
    title: 'September Equinox',
    detail: 'Balance returns as the Sun enters Libra. Harvest\u2019s midpoint and a turn toward introspection.',
    emblem: '♎',
  },
  {
    date: '2027-10-31',
    kind: 'sabbat',
    title: 'Samhain',
    detail: 'The veil thins. The witches\u2019 new year — ancestor work, divination, and endings honored.',
    emblem: '✦',
  },
  {
    date: '2027-12-22',
    kind: 'solstice',
    title: 'December Solstice',
    detail: 'The longest night. The Sun\u2019s rebirth as it enters Capricorn — stillness and deep renewal.',
    emblem: '❄',
  },
]

const MOON_DETAIL: Record<string, string> = {
  'New Moon': 'Plant seeds. A dark-sky reset for intentions and fresh starts.',
  'First Quarter': 'A decision point. Push through resistance and commit.',
  'Full Moon': 'Illumination and release. What was hidden comes to light.',
  'Last Quarter': 'Let go and clear space. Forgiveness and completion.',
}

const MOON_EMBLEM: Record<string, string> = {
  'New Moon': '●',
  'First Quarter': '◑',
  'Full Moon': '○',
  'Last Quarter': '◐',
}

// Build a chronological feed of upcoming celestial events from `from`, spanning
// `days` ahead: fixed events (eclipses, solstices, sabbats) merged with the
// computed principal moon phases.
export function upcomingCelestialEvents(
  from: Date = new Date(),
  days = 120,
): CelestialEvent[] {
  const start = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()))
  const end = new Date(start.getTime() + days * 86_400_000)

  const events: CelestialEvent[] = []

  // Fixed events within the window.
  for (const e of FIXED_EVENTS) {
    const d = new Date(`${e.date}T00:00:00Z`)
    if (d >= start && d <= end) events.push(e)
  }

  // Moon phases: walk cycle-by-cycle until we pass the window end.
  let cursor = new Date(start)
  const seen = new Set<string>()
  for (let i = 0; i < 6; i++) {
    for (const phase of upcomingPrincipalPhases(cursor)) {
      if (phase.date < start || phase.date > end) continue
      const iso = phase.date.toISOString().slice(0, 10)
      const key = `${iso}-${phase.name}`
      if (seen.has(key)) continue
      seen.add(key)
      events.push({
        date: iso,
        kind: 'moon',
        title: phase.name,
        detail: MOON_DETAIL[phase.name] ?? '',
        emblem: MOON_EMBLEM[phase.name] ?? '☾',
      })
    }
    // Advance ~29.6 days to the next cycle.
    cursor = new Date(cursor.getTime() + 30 * 86_400_000)
    if (cursor > end) break
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}
