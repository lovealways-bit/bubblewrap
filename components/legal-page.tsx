import Link from 'next/link'
import type { ReactNode } from 'react'

export const LEGAL_CONTACT_EMAIL = 'dlf@allpathproperties.com'

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <article className="mx-auto max-w-2xl space-y-5 text-sm leading-relaxed text-foreground/85">
        <h1 className="font-display text-3xl font-bold text-gold-bright">{title}</h1>
        <p className="text-xs text-muted-foreground">Last updated {updated}</p>
        {children}
        <p className="pt-6 text-xs text-muted-foreground">
          <Link href="/terms" className="underline underline-offset-2">Terms</Link>
          {' · '}
          <Link href="/privacy" className="underline underline-offset-2">Privacy</Link>
          {' · '}
          <Link href="/refund" className="underline underline-offset-2">Refund policy</Link>
          {' · '}
          <Link href="/" className="underline underline-offset-2">Home</Link>
        </p>
      </article>
    </main>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="pt-2 font-display text-lg font-bold text-gold-bright">{children}</h2>
}
