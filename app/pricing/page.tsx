import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { ONE_TIME_OFFERS } from '@/lib/subscription/tiers'
import { PricingCards } from '@/components/pricing-cards'
import { OfferCheckoutCard } from '@/components/offer-checkout-card'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Membership & Pricing — Lunara',
  description: 'Choose your Lunara membership, or book a one-time birth chart or personal reading.',
}

export default async function PricingPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const tier = session?.user ? await getUserTier(session.user.id) : null

  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 font-display text-xs uppercase tracking-[0.4em] text-gold/70">
            Lunara membership
          </p>
          <h1 className="font-display text-4xl font-bold text-glow-gold sm:text-5xl">
            Choose how deep you want to go.
          </h1>
          <p className="mt-4 text-sm italic text-muted-foreground">
            Free access is supported by ads. Every paid membership is completely ad-free.
          </p>
        </div>

        <PricingCards currentTier={tier?.id ?? (session?.user ? 'free' : null)} signedIn={Boolean(session?.user)} />

        <div className="mt-16">
          <div className="mb-6 text-center">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-gold/70">
              Readings &amp; add-ons
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gold-bright">
              One-time experiences
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(ONE_TIME_OFFERS).map((offer) => (
              <OfferCheckoutCard key={offer.id} offer={offer} signedIn={Boolean(session?.user)} />
            ))}
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-xs text-muted-foreground">
          Checkout is currently in Stripe test mode. No real charges will occur until the owner
          connects a live Stripe account.
        </p>
      </section>
    </main>
  )
}
