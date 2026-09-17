import Link from 'next/link'
import { getSession } from '@/lib/session'

// Session-aware top nav shown on the entrance and inside the sanctum header.
// Signed-out seekers get a path to pricing and sign-in; signed-in seekers get
// their account. Rendered as an async server component so it reflects the
// real session without a client round-trip.
export async function AccountNav() {
  const session = await getSession()
  const signedIn = !!session?.user

  return (
    <nav
      aria-label="Account"
      className="flex items-center gap-4 font-display text-[0.6rem] uppercase tracking-[0.32em] sm:text-xs"
    >
      <Link
        href="/pricing"
        className="text-gold/70 transition-colors hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        Pricing
      </Link>
      {signedIn ? (
        <Link
          href="/account"
          className="rounded-md border border-gold/40 bg-gold/[0.06] px-3 py-1.5 text-gold-bright transition-colors hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          Account
        </Link>
      ) : (
        <Link
          href="/sign-in"
          className="rounded-md border border-gold/40 bg-gold/[0.06] px-3 py-1.5 text-gold-bright transition-colors hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        >
          Sign in
        </Link>
      )}
    </nav>
  )
}
