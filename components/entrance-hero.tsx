import Link from 'next/link'
import { AccountNav } from '@/components/account-nav'

// The moonlit entrance to Lunara Ascension. The altar photograph carries the
// atmosphere; layered scrims keep the left-anchored text legible at any aspect
// ratio, and the copy invites the seeker across the threshold into the reading.
export function EntranceHero() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <img
        src="/altar-bg.png"
        alt="Three gilded tarot cards on violet velvet amid amethyst crystals and candlelight beneath a starlit cosmos"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
      />

      {/* Legibility scrims: bottom rise on mobile, left column on wider screens */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-background via-background/55 to-transparent md:block" />
      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 200px 40px rgba(21, 10, 38, 0.85)' }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Hero copy, anchored low-left over the open sky */}
        <div className="mt-auto px-6 pb-14 md:px-14 md:pb-24">
          <div className="max-w-xl">
            <div
              className="flex items-center gap-3"
              style={{ animation: 'empire-rise 0.8s ease-out both' }}
            >
              <span className="h-px w-8 bg-gold/60" />
              <p className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-gold/80 sm:text-xs">
                A Moonlit Divination Sanctuary
              </p>
            </div>

            <h1
              className="mt-5 max-w-full font-display text-[clamp(2.65rem,13vw,4.8rem)] font-bold uppercase leading-[0.93] tracking-[0.025em] text-gold-bright text-glow-gold sm:tracking-[0.06em] md:text-7xl"
              style={{ animation: 'empire-rise 0.9s ease-out 0.1s both' }}
            >
              Lunara
              <br />
              Ascension
            </h1>

            <p
              className="mt-6 max-w-md text-lg italic leading-relaxed text-foreground/85 text-pretty sm:text-xl"
              style={{ animation: 'empire-rise 1s ease-out 0.25s both' }}
            >
              Still your mind and rise by moonlight. Cut the deck, and let the cosmos
              reveal the path written among your stars.
            </p>

            <div
              className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
              style={{ animation: 'empire-rise 1.05s ease-out 0.4s both' }}
            >
              <Link
                href="/reading"
                className="group inline-flex min-h-12 w-full max-w-md items-center justify-center gap-3 rounded-lg border border-gold bg-gold/15 px-5 py-3.5 font-display text-[0.7rem] uppercase tracking-[0.2em] text-gold-bright shadow-[0_0_28px_-8px_var(--gold)] transition-all duration-300 hover:bg-gold/25 hover:shadow-[0_0_34px_-4px_var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.28em]"
              >
                Enter the Sanctum
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <p className="font-display text-[0.6rem] uppercase tracking-[0.32em] text-gold/45">
                78 cards · drawn by fate
              </p>
            </div>

            <div className="mt-5">
              <AccountNav />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
