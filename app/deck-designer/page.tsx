import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier, canUseCustomDecks } from '@/lib/subscription/entitlements'
import { CUSTOM_DECK_UNLOCK_PRICE_LABEL } from '@/lib/subscription/tiers'
import { FULL_DECK_SIZE } from '@/lib/deck/preview'
import { listMyDecks } from '@/app/actions/custom-deck'
import { DeckDesigner } from '@/components/deck-designer'
import { Starfield } from '@/components/starfield'
import { AccountNav } from '@/components/account-nav'

// Preview and full-deck batches each generate several images.
export const maxDuration = 300

export default async function DeckDesignerPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const entitledFree = canUseCustomDecks(tier)
  const decks = await listMyDecks()

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
          Describe a visual world and Lunara paints a free preview — the card back
          and three signature arcana. Love it? Unlock the full{' '}
          {FULL_DECK_SIZE}-card deck for {CUSTOM_DECK_UNLOCK_PRICE_LABEL}
          {entitledFree ? ' — included with your membership.' : ', one time per deck.'}
        </p>

        <DeckDesigner
          initialDecks={decks}
          entitledFree={entitledFree}
          unlockPriceLabel={CUSTOM_DECK_UNLOCK_PRICE_LABEL}
          fullDeckSize={FULL_DECK_SIZE}
        />
      </div>
    </main>
  )
}
