'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TIER_ORDER, TIERS, type TierId } from '@/lib/subscription/tiers'
import { createCheckout } from '@/app/actions/subscription'

interface Props {
  currentTier: TierId | null
  signedIn: boolean
}

export function PricingCards({ currentTier, signedIn }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<TierId | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function choose(tierId: TierId) {
    setError(null)
    if (!signedIn) {
      router.push('/sign-up')
      return
    }
    if (tierId === 'free') {
      router.push('/account')
      return
    }
    setLoading(tierId)
    try {
      const url = await createCheckout(tierId as Exclude<TierId, 'free'>)
      if (url) window.location.href = url
      else setError('Checkout is not configured yet. Please try again shortly.')
    } catch (e) {
      setError((e as Error).message ?? 'Could not start checkout.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {TIER_ORDER.map((id) => {
          const tier = TIERS[id]
          const isCurrent = currentTier === id
          const featured = id === 'plus'
          return (
            <div
              key={id}
              className={`empire-panel relative flex flex-col p-7 ${
                featured ? 'ring-1 ring-gold/50' : ''
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 font-display text-[0.55rem] uppercase tracking-[0.28em] text-background">
                  Most chosen
                </span>
              )}
              <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-gold-bright">
                {tier.name}
              </h2>
              <p className="mt-1 text-sm italic text-muted-foreground">{tier.tagline}</p>
              <p className="mt-4 font-display text-3xl font-bold text-foreground">
                {tier.priceLabel}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span aria-hidden className="mt-0.5 text-gold">
                      ✦
                    </span>
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => choose(id)}
                disabled={isCurrent || loading === id}
                className={`mt-7 h-11 w-full rounded-lg font-display text-xs uppercase tracking-[0.24em] transition-all disabled:opacity-60 ${
                  featured
                    ? 'empire-cta'
                    : 'border border-gold/50 bg-gold/10 text-gold-bright hover:bg-gold/20'
                }`}
              >
                {isCurrent
                  ? 'Your current plan'
                  : loading === id
                    ? 'Opening checkout…'
                    : id === 'free'
                      ? 'Start free'
                      : `Choose ${tier.name.replace('Lunara ', '')}`}
              </button>
            </div>
          )
        })}
      </div>
      {error && <p className="mt-6 text-center text-sm text-destructive">{error}</p>}
    </div>
  )
}
