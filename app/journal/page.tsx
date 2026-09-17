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
        <h1 className="mt-1 font-display text-3xl font-bold text-gold-bright text-balance">
          Your reflections
        </h1>
        <p className="mt-2 max-w-xl text-sm italic text-muted-foreground text-pretty">
          A private record of what the cards and the sky stir in you. Every entry
          is stamped with the moon it was written under.
        </p>

        {allowed ? (
          <Journal
            initialEntries={entries.map((e) => ({
              ...e,
              createdAt: e.createdAt.toISOString(),
              updatedAt: e.updatedAt.toISOString(),
            }))}
            currentMoon={{
              name: moon.name,
              emblem: moon.emblem,
              illumination: Math.round(moon.illumination * 100),
            }}
          />
        ) : (
          <div className="empire-panel mt-8 p-6">
            <p className="text-sm italic text-muted-foreground">
              The journal is a Lunara membership ritual — available on Core and above.
            </p>
            <Link
              href="/pricing"
              className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
            >
              Unlock the journal
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
