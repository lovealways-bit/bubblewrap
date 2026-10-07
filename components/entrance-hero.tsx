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
              className="mt-4 max-w-full font-display text-[clamp(2.65rem,13vw,4.8rem)] font-bold u¶»§q«^