'use client'

import { useEffect } from 'react'

/**
 * A mobile sheet intentionally locks body scrolling while it is open.
 * If navigation lands on /pricing before that sheet has fully unmounted,
 * Android can retain the inline overflow lock and freeze the membership page.
 * Pricing is a normal document page, so always clear that stale lock on mount.
 */
export function PricingScrollGuard() {
  useEffect(() => {
    document.body.style.removeProperty('overflow')
    document.documentElement.style.removeProperty('overflow')
  }, [])

  return null
}
