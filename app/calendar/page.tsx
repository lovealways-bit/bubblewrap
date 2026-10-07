import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier, canUseCelestial } from '@/lib/subscription/entitlements'
import { getMoonPhase } from '@/lib/celestial/moon'
import { upcomingCelestialEvents } from '@/lib/celestial/events'
import { CelestialCalendar } from '@/components/celestial-calendar'
import { Starfield } from '@/components/starfield'
import { AccountNav } from '@/components/account-nav'

export const metadata = {
  title: 'Celestial Calendar Â· Lunara',
  description:
    'Moon phases, eclipses, solstices, equinoxes, and the old sabbats - the turning sky mapped ahead.',
}

export default async function CalendarPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const allowed = canUseCelestial(tier)
  const now = new Date()
  const moon = getMoonPhase(now)
  const events = allowed ? upcomingCelestialEvents(now, 150) : []

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Starfield />
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-14">
        <Link
          href="/account"
          className="font-display text-[0.6rem] uppercase tracking-[0.42em] text-gold/70 transition-colors hover:text-gold-bright sm:text-xs"
        >
          Back to account
        </Link>
        <AccountNav />
      </header>

      <di¶»§q«^