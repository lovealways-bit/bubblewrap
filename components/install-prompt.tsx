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

    // Already installed / launched from home screen — never show.
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
      setVisible(true)
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    const onInstalled = () => dismiss()
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  async function handleInstall() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="empire-panel relative w-full max-w-md p-5 pr-10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="absolute right-3 top-3 rounded-full p-1 text-gold/60 transition-colors hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/40 bg-gold/[0.06]">
            <Download className="h-5 w-5 text-gold" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-gold-bright">
              Install Lunara
            </p>

            {isIOS ? (
              <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm leading-relaxed text-muted-foreground">
                <span>Tap</span>
                <Share className="inline h-4 w-4 text-gold" aria-label="the Share button" />
                <span>then</span>
                <span className="inline-flex items-center gap-1 text-surface-foreground">
                  <Plus className="h-3.5 w-3.5 text-gold" />
                  Add to Home Screen
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">
                Keep the sanctuary a tap away on your home screen.
              </p>
            )}

            {!isIOS && (
              <button
                type="button"
                onClick={handleInstall}
                className="empire-cta mt-3 inline-flex items-center gap-2 rounded-md px-5 py-2 font-display text-xs uppercase tracking-[0.2em]"
              >
                <Download className="h-4 w-4" />
                Add to device
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
