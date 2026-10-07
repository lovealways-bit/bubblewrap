import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier, canUseJournal } from '@/lib/subscription/entitlements'
import { listJournalEntries } from '@/app/actions/journal'
import { getMoonPhase } from '@/lib/celestial/moon'
import { Journal } from '@/components/journal'
import { Starfield } from '@/components/starfield'
import { AccountNav } from '@/components/account-nav'

export default async function JournalPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const allowed = canUseJournal(tier)
  const entries = allowed ? await listJournalEntries() : []
  const moon = getMoonPhase()

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

      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-10">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
          Moon &amp; Sun Journal
        </p>
        <h1 className="mt-1 font-display text-3xl font¶»§q«^