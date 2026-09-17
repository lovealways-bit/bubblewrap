import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'

interface Props {
  searchParams: Promise<{ type?: string; tier?: string; offer?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { type, offer } = await searchParams
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  // Re-read entitlement from the server so the confirmation reflects the
  // freshly updated record rather than trusting the redirect query string.
  const tier = await getUserTier(session.user.id)

  const isMembership = type === 'membership'
  const isBirthChart = offer === 'birthChart'
  const isPersonalReading = offer === 'personalReading'
  const isCustomDeck = offer === 'customDeck'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground">
      <div className="empire-panel w-full max-w-md p-8 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-gold-bright text-glow-gold">
          {isMembership ? 'Welcome to the sanctuary' : 'Your purchase is confirmed'}
        </h1>

        {isMembership && (
          <p className="mt-3 text-sm text-muted-foreground">
            You&apos;re now on <span className="text-gold-bright">{tier.name}</span>. Ads are off and
            your new features are unlocked.
          </p>
        )}
        {isBirthChart && (
          <p className="mt-3 text-sm text-muted-foreground">
            Continue in-app to securely enter your birth date, time, and place so we can prepare
            your chart.
          </p>
        )}
        {isPersonalReading && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your reader will reach out using the delivery method you chose at checkout.
          </p>
        )}
        {isCustomDeck && (
          <p className="mt-3 text-sm text-muted-foreground">
            Your deck is unlocked. Head back to the atelier to paint the full 78-card set.
          </p>
        )}
        {!isMembership && !isBirthChart && !isPersonalReading && !isCustomDeck && (
          <p className="mt-3 text-sm text-muted-foreground">Thank you — your order is confirmed.</p>
        )}

        <div className="mt-7 flex flex-col gap-3">
          {isBirthChart ? (
            <Link href="/account?intake=birth-chart" className="empire-cta h-11 rounded-lg font-display text-xs uppercase tracking-[0.24em] leading-[2.75rem]">
              Enter my birth details
            </Link>
          ) : isCustomDeck ? (
            <Link href="/deck-designer" className="empire-cta h-11 rounded-lg font-display text-xs uppercase tracking-[0.24em] leading-[2.75rem]">
              Back to the atelier
            </Link>
          ) : (
            <Link href="/account" className="empire-cta h-11 rounded-lg font-display text-xs uppercase tracking-[0.24em] leading-[2.75rem]">
              Go to my account
            </Link>
          )}
          <Link href="/" className="text-sm text-gold-bright underline-offset-4 hover:underline">
            Return to Lunara
          </Link>
        </div>
      </div>
    </main>
  )
}
