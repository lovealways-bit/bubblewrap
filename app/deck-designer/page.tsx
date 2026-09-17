import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier, canUseCustomDecks } from '@/lib/subscription/entitlements'
import { listMyDecks } from '@/app/actions/custom-deck'
import { DeckDesigner } from '@/components/deck-designer'
import { Starfield } from '@/components/starfield'
import { AccountNav } from '@/components/account-nav'

// Preview generation can take a little while (4 images).
export const maxDuration = 120

export default async function DeckDesignerPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const allowed = canUseCustomDecks(tier)
  const decks = allowed ? await listMyDecks() : []

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

      <div className="relative z-10 mx-auto max-w-4xl px-5 pb-24 pt-10">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
          Lunara Atelier
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-gold-bright text-balance">
          Design your own deck
        </h1>
        <p className="mt-2 max-w-xl text-sm italic text-muted-foreground text-pretty">
          Describe a visual world and Lunara paints a preview — the card back and
          three signature arcana. Save it, then commission the full 78 cards when
          you are ready.
        </p>

        {allowed ? (
          <DeckDesigner initialDecks={decks} />
        ) : (
          <div className="empire-panel mt-8 p-6">
            <p className="text-sm italic text-muted-foreground">
              The deck atelier is part of Lunara Plus and above.
            </p>
            <Link
              href="/pricing"
              className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
            >
              Unlock the atelier
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
