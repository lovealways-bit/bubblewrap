'use client'

import { useEffect, useState } from 'react'
import { Download, MoreVertical, Plus, Share, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const SESSION_DISMISS_KEY = 'lunara-install-dismissed-session'

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showManual, setShowManual] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    if (standalone) {
      setInstalled(true)
      return
    }

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/lunara-sw.js', { scope: '/' }).catch(() => {})
    }

    const ua = window.navigator.userAgent
    setIsIOS(/iphone|ipad|ipod/i.test(ua))

    if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') return

    const showTimer = window.setTimeout(() => setVisible(true), 650)

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    const onInstalled = () => {
      setInstalled(true)
      setVisible(false)
      setDeferred(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.clearTimeout(showTimer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    try { sessionStorage.setItem(SESSION_DISMISS_KEY, '1') } catch {}
  }

  async function handleInstall() {
    if (deferred) {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice.outcome === 'accepted') {
        setInstalled(true)
        setVisible(false)
      } else {
        setDeferred(null)
        setShowManual(true)
      }
      return
    }

    setShowManual(true)
  }

  if (installed || !visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="empire-panel relative w-full max-w-md p-5 pr-10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-gold/60 transition-colors hover:text-gold"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/40 bg-gold/[0.06]">
            <Download className="h-5 w-5 text-gold" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-gold-bright">
              Install Lunara
            </p>
            <p className="mt-1.5 text-sm italic leading-relaxed text-muted-foreground">
              Keep the sanctuary a tap away and open Lunara like its own app.
            </p>

            {!showManual && (
              <button
                type="button"
                onClick={() => void handleInstall()}
                className="empire-cta mt-3 inline-flex min-h-11 items-center gap-2 rounded-md px-5 py-3 font-display text-xs uppercase tracking-[0.2em]"
              >
                <Download className="h-4 w-4" />
                Install Lunara
              </button>
            )}

            {showManual && (
              <div className="mt-3 rounded-lg border border-gold/25 bg-background/55 p-3 text-sm leading-relaxed text-muted-foreground">
                {isIOS ? (
                  <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span>Tap</span>
                    <Share className="inline h-4 w-4 text-gold" aria-label="the Share button" />
                    <span>then</span>
                    <span className="inline-flex items-center gap-1 text-surface-foreground">
                      <Plus className="h-3.5 w-3.5 text-gold" />
                      Add to Home Screen
                    </span>
                  </p>
                ) : (
                  <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <MoreVertical className="inline h-4 w-4 text-gold" />
                    <span>Open the browser menu, then choose</span>
                    <span className="text-surface-foreground">Install app</span>
                    <span>or</span>
                    <span className="text-surface-foreground">Add to Home screen</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
