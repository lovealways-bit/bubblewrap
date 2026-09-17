'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdSenseSlotProps {
  /** Pass the viewer's ad entitlement (false for every paid tier). */
  enabled: boolean
  slot?: string
  className?: string
  format?: string
}

// Guarded AdSense unit. Renders nothing — and never initializes an ad
// request — unless the viewer is ad-eligible AND both the publisher client
// ID and slot ID are configured. No fake IDs are ever shipped: until the
// owner adds NEXT_PUBLIC_ADSENSE_CLIENT_ID / _SLOT env vars in Vercel after
// AdSense site approval, this renders null everywhere in the app.
export function AdSenseSlot({
  enabled,
  slot = process.env.NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT,
  className,
  format = 'auto',
}: AdSenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  const canRender = enabled && Boolean(client) && Boolean(slot)

  useEffect(() => {
    if (!canRender) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ad blockers, consent state, or inventory availability can prevent rendering.
    }
  }, [canRender])

  if (!canRender) return null

  return (
    <div className={className} aria-label="Advertisement">
      <Script
        id="lunara-adsense"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
