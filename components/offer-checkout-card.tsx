'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOneTimeCheckout } from '@/app/actions/subscription'
import { DELIVERY_PREFERENCES, type OneTimeOffer, type DeliveryPreference } from '@/lib/subscription/tiers'

interface Props {
  offer: OneTimeOffer
  signedIn: boolean
}

export function OfferCheckoutCard({ offer, signedIn }: Props) {
  const router = useRouter()
  const [delivery, setDelivery] = useState<DeliveryPreference | ''>('')
  const [legalAccepted, setLegalAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setError(null)
    if (!signedIn) {
      router.push('/sign-up')
      return
    }
    if (offer.requiresDeliveryPreference && !delivery) {
      setError('Please choose how you would like your reading delivered.')
      return
    }
    if (!legalAccepted) {
      setError('Please accept the Terms and Privacy Notice before purchasing.')
      return
    }
    setLoading(true)
    try {
      const url = await createOneTimeCheckout(offer.id, delivery || undefined, legalAccepted)
      if (url) window.location.href = url
      else setError('Checkout is not configured yet. Please try again shortly.')
    } catch (e) {
      setError((e as Error).message ?? 'Could not start checkout.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="empire-panel flex flex-col p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-bold uppercase tracking-[0.1em] text-gold-bright">
          {offer.name}
        </h3>
        <span className="font-display text-2xl font-bold text-foreground">{offer.priceLabel}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{offer.description}</p>

      {offer.requiresDeliveryPreference && (
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
            How should we deliver your reading?
          </span>
          <select
            value={delivery}
            onChange={(e) => setDelivery(e.target.value as DeliveryPreference)}
            className="lunara-input"
          >
            <option value="" disabled>
              Choose one
            </option>
            {DELIVERY_PREFERENCES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs text-foreground/80">
        <input
          type="checkbox"
          checked={legalAccepted}
          onChange={(e) => setLegalAccepted(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--gold)]"
        />
        <span>
          I agree to the{' '}
          <Link href="/terms" className="text-gold-bright underline underline-offset-4">Terms</Link>
          {' '}and acknowledge the{' '}
          <Link href="/privacy" className="text-gold-bright underline underline-offset-4">Privacy Notice</Link>.
          I understand this is a one-time digital service and that tarot, astrology, and AI content are reflective/informational rather than professional advice or guaranteed predictions.
        </span>
      </label>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="empire-cta mt-5 h-11 w-full rounded-lg font-display text-xs uppercase tracking-[0.24em] disabled:opacity-60"
      >
        {loading ? 'Opening checkout…' : `Purchase ${offer.name}`}
      </button>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
    </article>
  )
}
