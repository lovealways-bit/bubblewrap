'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdSenseSlotProps = {
  enabled: boolean
  slot?: string
  className?: string
  format?: string
}

export function AdSenseSlot({
  enabled,
  slot = process.env.NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT,
  className,
  format = 'auto',
}: AdSenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!enabled || !client || !slot) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // Ad blockers, consent state, or inventory availability can prevent rendering.
    }
  }, [enabled, client, slot])

  if (!enabled || !client || !slot) return null

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
