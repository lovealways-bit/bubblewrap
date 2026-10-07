import Link from 'next/link'

export function EntranceHero() {
  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] overflow-hidden bg-background">
      <img
        src="/altar-bg.png"
        alt="Three gilded tarot cards on violet velvet amid amethyst crystals and candlelight beneath a starlit cosmos"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-background via-background/55 to-transparent md:block" />
      <div
        className="absolute inset-0"
        style={{ boxShadow: 'inset 0 0 180px 30px rgba(21, 10, 38, 0.82)' }}
      />

      <div className="relative z-10 flex w-full items-end">
        <div className="w-full px-5 pb-10 pt-8 sm:px-8 md:px-14 md:pb-20">
          <div className="max-w-xl">
            <div
              className="flex items-center gap-3"
              style={{ animation: 'empire-rise 0.8s ease-out both' }}
            >
              <span className="h-px w-8 bg-gold/60" />
              <p className="font-display text-[0.58rem] uppercase tracking-[0.28em] text-gold/80 sm:text-xs sm:tracking-[0.4em]">
                A Moonlit Divination Sanctuary
              </p>
            </div>

            <h1
              className="mt-4 max-w-full font-display text-[clamp(2.65rem,13vw,4.8rem)] font-bold uppercase leading-[0.93] tracking-[0.025em] text-gold-bright text-glow-gold sm:tracking-[0.06em]"
              style={{ animation: 'empire-rise 0.9s ease-out 0.1s both' }}
            >
              <span className="block">Lunara</span>
              <span className="block">Ascension</span>
            </h1>

            <p
              className="mt-5 max-w-md text-base italic leading-relaxed text-foreground/85 text-pretty sm:text-xl"
              style={{ animation: 'empire-rise 1s ease-out 0.25s both' }}
            >
              Still your mind and rise by moonlight. Cut the deck, and let the cosmos reveal the path written among your stars.
            </p>

            <Link
              href="/reading"
              className="group mt-7 inline-flex min-h-12 w-full max-w-md items-center justify-center gap-3 rounded-xl border border-gold bg-gold/15 px-5 py-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-gold-bright shadow-[0_0_28px_-8px_var(--gold)] transition-all hover:bg-gold/25 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.28em]"
            >
              Enter the Sanctum
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
