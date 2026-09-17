// Self-contained lunar math. No external astronomy dependency: the synodic
// approximation below is accurate to well under a day for phase naming and
// illumination, which is all this feature needs. All calculations run in UTC.

const SYNODIC_MONTH = 29.53058867 // days between identical phases
// A known new moon: 2000-01-06 18:14 UTC (Meeus reference epoch).
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0)
const DAY_MS = 86_400_000

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent'

export interface MoonPhase {
  /** 0..1 position through the synodic cycle (0 = new, 0.5 = full). */
  cyclePosition: number
  /** 0..1 illuminated fraction of the disc. */
  illumination: number
  name: MoonPhaseName
  /** Whether the moon is growing toward full. */
  waxing: boolean
  emblem: string
}

// Position through the current lunar cycle for any date.
function cyclePositionFor(date: Date): number {
  const days = (date.getTime() - KNOWN_NEW_MOON_MS) / DAY_MS
  const pos = (days % SYNODIC_MONTH) / SYNODIC_MONTH
  return (pos + 1) % 1 // normalize into 0..1
}

function nameFor(position: number): MoonPhaseName {
  // Narrow bands (~1 day) around the four principal phases; wide bands between.
  const p = position
  if (p < 0.02 || p >= 0.98) return 'New Moon'
  if (p < 0.23) return 'Waxing Crescent'
  if (p < 0.27) return 'First Quarter'
  if (p < 0.48) return 'Waxing Gibbous'
  if (p < 0.52) return 'Full Moon'
  if (p < 0.73) return 'Waning Gibbous'
  if (p < 0.77) return 'Last Quarter'
  return 'Waning Crescent'
}

const EMBLEMS: Record<MoonPhaseName, string> = {
  'New Moon': '●',
  'Waxing Crescent': '☽',
  'First Quarter': '◑',
  'Waxing Gibbous': '◒',
  'Full Moon': '○',
  'Waning Gibbous': '◓',
  'Last Quarter': '◐',
  'Waning Crescent': '☾',
}

export function getMoonPhase(date: Date = new Date()): MoonPhase {
  const cyclePosition = cyclePositionFor(date)
  // Illuminated fraction is a smooth cosine over the cycle.
  const illumination = (1 - Math.cos(2 * Math.PI * cyclePosition)) / 2
  const name = nameFor(cyclePosition)
  return {
    cyclePosition,
    illumination,
    name,
    waxing: cyclePosition < 0.5,
    emblem: EMBLEMS[name],
  }
}

export interface UpcomingPhase {
  name: 'New Moon' | 'First Quarter' | 'Full Moon' | 'Last Quarter'
  date: Date
}

// Walk forward from `from` and find the next occurrence of each principal
// phase by detecting when the cycle position crosses each target.
export function upcomingPrincipalPhases(from: Date = new Date()): UpcomingPhase[] {
  const targets: { name: UpcomingPhase['name']; pos: number }[] = [
    { name: 'New Moon', pos: 0 },
    { name: 'First Quarter', pos: 0.25 },
    { name: 'Full Moon', pos: 0.5 },
    { name: 'Last Quarter', pos: 0.75 },
  ]
  const found: UpcomingPhase[] = []

  for (const target of targets) {
    // Step in 6-hour increments up to ~1.2 cycles ahead and bisect the crossing.
    let prev = new Date(from)
    let prevDelta = signedDistance(cyclePositionFor(prev), target.pos)
    const stepMs = DAY_MS / 4
    for (let i = 1; i <= 4 * 36; i++) {
      const cur = new Date(from.getTime() + i * stepMs)
      const curDelta = signedDistance(cyclePositionFor(cur), target.pos)
      if (prevDelta <= 0 && curDelta >= 0 && curDelta - prevDelta < 0.5) {
        found.push({ name: target.name, date: bisect(prev, cur, target.pos) })
        break
      }
      prev = cur
      prevDelta = curDelta
    }
  }

  return found.sort((a, b) => a.date.getTime() - b.date.getTime())
}

// Shortest signed distance from position to target on the 0..1 ring, in -0.5..0.5.
function signedDistance(position: number, target: number): number {
  let d = position - target
  if (d > 0.5) d -= 1
  if (d < -0.5) d += 1
  return d
}

function bisect(lo: Date, hi: Date, target: number): Date {
  let a = lo.getTime()
  let b = hi.getTime()
  for (let i = 0; i < 24; i++) {
    const mid = (a + b) / 2
    const d = signedDistance(cyclePositionFor(new Date(mid)), target)
    if (d < 0) a = mid
    else b = mid
  }
  return new Date((a + b) / 2)
}
