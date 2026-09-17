import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { AccountActions } from '@/components/account-actions'

export default async function AccountPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const isFree = tier.id === 'free'

  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-2xl">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">Your account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-glow-gold">{session.user.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>

        <div className="empire-panel mt-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
                Current membership
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">{tier.name}</h2>
              <p className="mt-1 text-sm italic text-muted-foreground">{tier.tagline}</p>
            </div>
            <span className="font-display text-lg font-bold">{tier.priceLabel}</span>
          </div>

          {isFree ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Ad-supported. Upgrade any time to go ad-free and unlock more of Lunara.
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">Ad-free membership. Thank you.</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="empire-cta h-10 rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em] leading-[2.5rem]"
            >
              {isFree ? 'View plans' : 'Change plan'}
            </Link>
            {!isFree && <AccountActions />}
          </div>
        </div>

        <div className="mt-10">
          <SignOutButton />
        </div>
      </section>
    </main>
  )
}

function SignOutButton() {
  return <AccountActions signOutOnly />
}
