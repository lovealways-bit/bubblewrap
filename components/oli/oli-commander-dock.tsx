'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { Bot, ChevronRight, Loader2, Send, Sparkles, X } from 'lucide-react'
import type { OliCommandResponse } from '@/lib/oli/types'

export function OliCommanderDock({ appId }: { appId?: string }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<OliCommandResponse | null>(null)

  async function submit(event: FormEvent) {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed || loading) return

    setLoading(true)
    try {
      const result = await fetch('/api/oli/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          appId,
          pathname: window.location.pathname,
        }),
      })
      const data = (await result.json()) as OliCommandResponse | { error?: string }
      if (!result.ok || !('message' in data)) {
        setResponse({
          kind: 'blocked',
          title: 'I hit a routing snag',
          message: 'The local Oli command route did not return a valid response. No external provider call was made.',
          appId: appId || 'oli-hub',
          capabilityIds: ['support.first-line'],
          provenance: ['local runtime'],
        })
      } else {
        setResponse(data)
      }
    } catch {
      setResponse({
        kind: 'blocked',
        title: 'Local connection unavailable',
        message: 'I could not reach the local Oli command route. No paid AI or search provider was called.',
        appId: appId || 'oli-hub',
        capabilityIds: ['support.first-line'],
        provenance: ['local runtime'],
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      {open && (
        <section className="w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-amber-300/25 bg-white/95 text-slate-950 shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
          <header className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-white via-purple-50 to-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-amber-400/40 bg-slate-950 text-xs font-bold tracking-[0.18em] text-amber-200 shadow-sm">
                OLI
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide">Oli Commander</p>
                <p className="text-xs text-slate-500">First-line guide · governed runtime</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Close Oli"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="space-y-4 px-5 py-5">
            <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-700">
                <Sparkles className="h-3.5 w-3.5" /> Local Oli
              </div>
              <p className="text-sm leading-6 text-slate-700">
                Ask about the app, support, Commander context, plans, feedback, navigation, or a task you want routed.
              </p>
            </div>

            {response && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-1 text-sm font-semibold text-slate-950">{response.title}</p>
                <p className="text-sm leading-6 text-slate-600">{response.message}</p>
                {response.links?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {response.links.map((link) => (
                      <Link
                        key={`${link.label}-${link.href}`}
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-purple-300 hover:text-purple-700"
                      >
                        {link.label}<ChevronRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                ) : null}
                {response.needsProvider ? (
                  <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
                    This request needs an approved provider/connector before Oli can execute the external step.
                  </p>
                ) : null}
              </div>
            )}

            <form onSubmit={submit} className="flex items-end gap-2">
              <label className="sr-only" htmlFor="oli-message">Ask Oli</label>
              <textarea
                id="oli-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={2}
                placeholder="Ask Oli…"
                className="min-h-[54px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-2xl bg-slate-950 text-amber-200 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send to Oli"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Local routing first</span>
              <Link href="/oli" className="font-medium text-purple-700 hover:underline">Open training hub</Link>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex h-16 items-center gap-3 rounded-full border border-white/70 bg-white/95 p-2 pr-5 text-slate-950 shadow-2xl shadow-purple-950/20 backdrop-blur-xl transition hover:-translate-y-1"
        aria-expanded={open}
        aria-label={open ? 'Close Oli Commander' : 'Open Oli Commander'}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-amber-200 shadow-inner ring-1 ring-amber-300/30">
          <Bot className="h-5 w-5" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-semibold leading-none">Ask Oli</span>
          <span className="mt-1 block text-[11px] text-slate-500">Commander guide</span>
        </span>
      </button>
    </div>
  )
}
