import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="relative z-10 flex flex-col items-center px-6 pt-14 text-center">
      <p className="font-display text-[0.65rem] uppercase tracking-[0.5em] text-gold/70">
        AllPath Edu · SynchPathways
      </p>

      <Link
        href="/"
        className="mt-4 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      >
        <h1 className="font-display text-4xl font-bold uppercase tracking-[0.12em] text-gold-bright text-glow-gold sm:text-6xl">
          Lunara Ascension
        </h1>
      </Link>

      <p className="mt-5 max-w-md text-lg italic leading-relaxed text-muted-foreground text-pretty sm:text-xl">
        Still the noise. Cut the deck. Rise by moonlight and read what you were meant to see.
      </p>
    </header>
  )
}
