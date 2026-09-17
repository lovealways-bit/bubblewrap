// App-wide footer: brand line, copyright, and contact addresses.
// Shared between the entrance hero and the reading experience so the
// legal + contact information appears consistently across the app.
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-gold/15 px-6 py-10 text-center">
      <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-gold/50">
        Lunara Ascension · 78 cards · drawn by fate, read by you
      </p>

      <p className="mt-4 font-display text-[0.6rem] uppercase tracking-[0.32em] text-gold/40">
        {`© ${year} `}
        <a
          href="https://allpathproperties.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold/60 transition-colors hover:text-gold-bright"
        >
          AllPathProperties.com
        </a>
        {' · AllPath Edu'}
      </p>

      <div className="mt-3 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
        <a
          href="mailto:inquiry@allpathproperties.com"
          className="text-xs italic text-muted-foreground transition-colors hover:text-gold-bright"
        >
          inquiry@allpathproperties.com
        </a>
        <span aria-hidden className="hidden text-gold/30 sm:inline">
          ·
        </span>
        <a
          href="mailto:lovealways@allpathproperties.com"
          className="text-xs italic text-muted-foreground transition-colors hover:text-gold-bright"
        >
          lovealways@allpathproperties.com
        </a>
        <span aria-hidden className="hidden text-gold/30 sm:inline">
          ·
        </span>
        <a
          href="mailto:kj@allpathproperties.com"
          className="text-xs italic text-muted-foreground transition-colors hover:text-gold-bright"
        >
          kj@allpathproperties.com
        </a>
      </div>
    </footer>
  )
}
