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
    detail: 'Cross-quarter fire festival - first stirrings of spring, a time for cleansing and new intentions.',
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
    detail: 'A blood moon - the full moon slips fully into Earth\u2019s shadow. Culminations and emotional reckonings.',
    emblem: '●',
  },
  {
    date: '2026-03-20',
    kind: 'equinox',
    title: 'March Equinox',
    detail: 'Day an���q�^