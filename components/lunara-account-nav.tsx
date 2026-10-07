import Link from 'next/link'
import { CircleUserRound, Gem } from 'lucide-react'

export function LunaraAccountNav({
  signedIn,
  userName,
}: {
  signedIn: boolean
  userName: string | null
}) {
  const accountLabel = signedIn ? userName?.trim().split(/\s+/)[0] || 'Account' : 'Log In'

  return (
    <nav
      aria-label="Lunara account and subscriptions"
      className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-[55] flex items-center gap-1.5"
    >
      <Link
        href={signedIn ? '/account' : '/sign-in'}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-gold/35 bg-background/90 px-3 font-display text-[0.6rem] uppercase tracking-[0.14em] text-gold-bright shadow-[0_6px_24px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:border-gold/70 hover:bg-surface/95 sm:text-[0.65rem]"
      >
        <CircleUserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="max-w-20 truncate">{accountLabel}</span>
      </Link>
      <Link
        href="/pricing"
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-gold/45 bg-background/90 px-3 font-display text-[0.6rem] uppercase tracking-[0.14em] text-gold-bright shadow-[0_6px_24px_-10px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:border-gold/80 hover:bg-gold/10 sm:text-[0.65rem]"
      >
        <Gem className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Subscriptions</span>
      </Link>
    </nav>
  )
}
