'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Page-within-a-page pattern for small screens.
//
// On phones (below the md breakpoint) a section lives inside a bottom sheet
// that slides up over the current page, with a Back button and a Close
// button, instead of being stacked into one long scroll. On md and wider the
// same children render inline exactly where they always did, so the desktop
// layout is unchanged.

const MOBILE_QUERY = '(max-width: 767px)'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: ReactNode
  /** Label for the left button. Defaults to "Back". */
  backLabel?: string
  /** On desktop, render the children inline (default) or not at all. */
  desktopInline?: boolean
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return mobile
}

export function MobileSheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  backLabel = 'Back',
  desktopInline = true,
}: SheetProps) {
  const isMobile = useIsMobile()
  const showSheet = open && isMobile

  // Escape closes, and the page underneath stops scrolling while a sheet is
  // up on a phone.
  useEffect(() => {
    if (!showSheet) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [showSheet, onClose])

  if (!showSheet) {
    // Desktop (or a closed sheet on a phone): inline content, hidden on phones.
    return desktopInline ? <div className="hidden md:block">{children}</div> : null
  }

  // Portaled to <body> so no transformed or blurred ancestor can trap the
  // fixed positioning.
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={`Close ${title}`}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-2xl border-t border-gold/40 bg-background shadow-[0_-12px_40px_-10px_rgba(0,0,0,0.8)]"
        style={{ animation: 'lunara-sheet-up 0.28s ease-out both' }}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-gold/30" aria-hidden="true" />
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gold/20 px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold/80 hover:text-gold-bright"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </button>
          <div className="min-w-0 flex-1 text-center">
            {eyebrow && (
              <p className="truncate font-display text-[0.55rem] uppercase tracking-[0.3em] text-gold/55">
                {eyebrow}
              </p>
            )}
            <p className="truncate font-display text-sm uppercase tracking-[0.12em] text-gold-bright">
              {title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gold/80 hover:text-gold-bright"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-5 pb-10 pt-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

interface LauncherProps {
  label: string
  value?: string
  hint?: string
  icon?: LucideIcon
  onOpen: () => void
}

/** A full-width row that opens a sheet. Phones only; hidden on md and wider. */
export function SheetLauncher({ label, value, hint, icon: Icon, onOpen }: LauncherProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-14 w-full items-center gap-3 rounded-lg border border-gold/30 bg-surface/50 px-4 py-3 text-left transition-colors hover:border-gold/60 active:bg-gold/10 md:hidden"
    >
      {Icon && <Icon className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">
          {label}
        </span>
        {value && (
          <span className="mt-0.5 block truncate font-display text-sm text-gold-bright">{value}</span>
        )}
        {hint && <span className="mt-0.5 block text-xs italic text-muted-foreground">{hint}</span>}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-gold/70" aria-hidden="true" />
    </button>
  )
}
