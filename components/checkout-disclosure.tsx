import Link from 'next/link'

// Plain-language billing disclosure shown next to every checkout or buy button.
// kind 'monthly' = auto-renewing subscription, 'one-time' = single charge.
export function formatDisclosurePrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

interface Props {
  kind: 'monthly' | 'one-time'
  priceCents: number
  className?: string
}

export function CheckoutDisclosure({ kind, priceCents, className }: Props) {
  const price = formatDisclosurePrice(priceCents)
  return (
    <div className={`text-xs leading-relaxed text-muted-foreground ${className ?? ''}`}>
      {kind === 'monthly' ? (
        <p>
          Your plan renews automatically every month at {price} until you cancel. You can cancel
          anytime online in My Account, and canceling stops the next charge.
        </p>
      ) : (
        <p>One-time charge of {price}. This is not a subscription.</p>
      )}
      <p className="mt-1">
        Readings are for entertainment and personal reflection only, not advice.
      </p>
      <LegalLinks className="mt-1" />
    </div>
  )
}

export function LegalLinks({ className }: { className?: string }) {
  return (
    <p className={className}>
      <Link href="/terms" className="underline underline-offset-2 hover:text-gold-bright">
        Terms
      </Link>
      {' · '}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-gold-bright">
        Privacy
      </Link>
      {' · '}
      <Link href="/refund" className="underline underline-offset-2 hover:text-gold-bright">
        Refund policy
      </Link>
    </p>
  )
}
