import { LUNARA_ONE_TIME_OFFERS, LUNARA_PLANS } from '@/lib/monetization'

const planOrder = ['free', 'core', 'plus', 'personal'] as const

const planFeatures = {
  free: ['Basic app access', 'Introductory guidance', 'Ad-supported', 'Optional rewarded-ad access'],
  core: ['Personalized daily guidance', 'Birth-chart insights', 'Monthly overview', 'Ad-free'],
  plus: ['Everything in Core', 'Expanded personalized readings', 'Deeper monthly guidance', 'Ad-free'],
  personal: ['Everything in Plus', 'Ongoing customized readings', 'High-touch guidance', 'Ad-free'],
} as const

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <section className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-muted-foreground">Lunara membership</p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">Choose how deep you want to go.</h1>
          <p className="mt-4 text-sm text-muted-foreground">Free access is supported by ads. Every paid membership is ad-free.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {planOrder.map((key) => {
            const plan = LUNARA_PLANS[key]
            return (
              <article key={key} className="flex min-h-[390px] flex-col rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{plan.name}</p>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="font-serif text-4xl font-semibold">${plan.monthlyPrice.toFixed(2)}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/ month</span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3 text-sm">
                  {planFeatures[key].map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden="true">✦</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {plan.checkoutUrl ? (
                    <a
                      href={plan.checkoutUrl}
                      className="block rounded-full border border-border bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition hover:opacity-90"
                    >
                      Choose {plan.name.replace('Lunara ', '')}
                    </a>
                  ) : (
                    <a
                      href="/"
                      className="block rounded-full border border-border px-5 py-3 text-center text-sm font-semibold transition hover:bg-muted"
                    >
                      Continue Free
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-14">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Readings & add-ons</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">One-time experiences</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {Object.values(LUNARA_ONE_TIME_OFFERS).map((offer) => (
              <article key={offer.name} className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">{offer.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">One-time purchase</p>
                  </div>
                  <p className="font-serif text-3xl font-semibold">${offer.price.toFixed(2)}</p>
                </div>
                <a
                  href={offer.checkoutUrl}
                  className="mt-6 block rounded-full border border-border bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition hover:opacity-90"
                >
                  Book with Stripe
                </a>
              </article>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Stripe links on this branch are TEST MODE only. Replace them with live links after the live Stripe account is connected.
          </p>
        </div>
      </section>
    </main>
  )
}
