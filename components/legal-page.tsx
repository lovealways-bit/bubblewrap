import Link from 'next/link'
import type { ReactNode } from 'react'

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-background px-5 py-14 text-foreground">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-gold-bright hover:underline">
          ← Back to Lunara
        </Link>
        <div className="mt-8 empire-panel p-7 sm:p-10">
          <p className="font-display text-[0.65rem] uppercase tracking-[0.36em] text-gold/70">{eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gold-bright sm:text-4xl">{title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">Effective / last updated: {updated}</p>
          <div className="prose prose-invert mt-8 max-w-none text-sm leading-7 text-foreground/85 prose-headings:font-display prose-headings:text-gold-bright prose-a:text-gold-bright prose-strong:text-foreground">
            {children}
          </div>
        </div>
      </article>
    </main>
  )
}
