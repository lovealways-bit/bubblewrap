'use client'

import { useEffect, useState } from 'react'
import { Download, Share, Plus, X } from 'lucide-react'

// Chrome/Android fires this before offering to install; we capture it so we
// can trigger the native prompt from our own button. iOS never fires it.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'lunara-install-dismissed'

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already installed / launched from home screen - never show.
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS exposes this non-standard flag when launched from the home screen.
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return

    // Respect an earlier dismissal for this browser.
    if (localStorage.getItem(DISMISS_KEY) === '1') return

    const ua = window.navigator.userAgent
    const iOS = /iphone|ipad|ipod/i.test(ua)
    // Only Safari can Add to Home Screen on iOS; Chrome/Firefox iOS cannot.
    const iOSSafari = iOS && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua)

    if (iOSSafari) {
      setIsIOS(true)
      setVisibl¶»§q«^