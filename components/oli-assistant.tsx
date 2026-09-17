'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

type Source = { title: string; url: string }
type ChatMessage = {
  role: 'user' | 'oli'
  text: string
  sources?: Source[]
  searchedWeb?: boolean
}

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL

export function OliAssistant() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'chat' | 'feedback'>('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'oli',
      text: 'I’m Oli, your Lunara guide. Ask me about a card, a spread, how the app works, your plan, or something you want me to research.',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [feedbackCategory, setFeedbackCategory] = useState('idea')
  const [feedback, setFeedback] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null)

  const canRate = useMemo(() => Boolean(APP_STORE_URL || PLAY_STORE_URL), [])

  async function askOli() {
    const message = input.trim()
    if (!message || loading) return
    setMessages((items) => [...items, { role: 'user', text: message }])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/oli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, page: pathname }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Oli could not answer that right now.')
      setMessages((items) => [
        ...items,
        {
          role: 'oli',
          text: data.answer,
          sources: Array.isArray(data.sources) ? data.sources : [],
          searchedWeb: Boolean(data.searchedWeb),
        },
      ])
    } catch (error) {
      setMessages((items) => [
        ...items,
        { role: 'oli', text: (error as Error).message || 'I hit a snag. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function sendFeedback() {
    const message = feedback.trim()
    if (!message) return
    setFeedbackStatus('Sending…')
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: feedbackCategory, message, page: pathname }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error || 'Could not save feedback.')
      setFeedback('')
      setFeedbackStatus('Thank you. Your feedback was saved.')
    } catch (error) {
      setFeedbackStatus((error as Error).message || 'Could not save feedback.')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full border border-gold/60 bg-background/95 font-display text-sm font-bold text-gold-bright shadow-[0_0_30px_-8px_var(--gold)] backdrop-blur transition-transform hover:scale-105"
        aria-expanded={open}
        aria-controls="oli-panel"
        aria-label="Open Oli assistant"
      >
        OLI
      </button>

      {open && (
        <aside
          id="oli-panel"
          className="fixed bottom-24 right-4 z-50 flex max-h-[72vh] w-[min(94vw,390px)] flex-col overflow-hidden rounded-2xl border border-gold/30 bg-background/95 shadow-2xl backdrop-blur-xl"
        >
          <header className="border-b border-gold/15 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xs uppercase tracking-[0.32em] text-gold/70">Commander guide</p>
                <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">Oli</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tarot meanings · app help · web research</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-xl text-muted-foreground" aria-label="Close Oli">×</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('chat')}
                className={`rounded-lg px-3 py-2 text-xs ${mode === 'chat' ? 'bg-gold/20 text-gold-bright' : 'bg-muted/30 text-muted-foreground'}`}
              >
                Ask Oli
              </button>
              <button
                type="button"
                onClick={() => setMode('feedback')}
                className={`rounded-lg px-3 py-2 text-xs ${mode === 'feedback' ? 'bg-gold/20 text-gold-bright' : 'bg-muted/30 text-muted-foreground'}`}
              >
                Feedback
              </button>
            </div>
          </header>

          {mode === 'chat' ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-xl px-3 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'ml-8 bg-gold/15 text-foreground' : 'mr-4 bg-muted/25 text-foreground/90'}`}
                  >
                    <p>{message.text}</p>
                    {message.searchedWeb && (
                      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-gold/60">Web researched</p>
                    )}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.sources.map((source) => (
                          <a
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-xs text-gold-bright underline underline-offset-2"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {loading && <p className="text-xs italic text-muted-foreground">Oli is checking that…</p>}
              </div>

              <div className="border-t border-gold/15 p-4">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void askOli()
                      }
                    }}
                    rows={2}
                    maxLength={4000}
                    placeholder="Ask about this card, the app, your plan, or anything you want researched…"
                    className="lunara-input min-h-16 flex-1 resize-none"
                  />
                  <button type="button" onClick={() => void askOli()} disabled={loading} className="empire-cta rounded-lg px-4 text-xs disabled:opacity-60">
                    Send
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <Link href="/pricing" className="hover:text-gold-bright">Plans</Link>
                  <Link href="/account" className="hover:text-gold-bright">Account</Link>
                  <Link href="/terms" className="hover:text-gold-bright">Terms</Link>
                  <Link href="/privacy" className="hover:text-gold-bright">Privacy</Link>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 p-5">
              <p className="text-sm text-foreground/85">
                Tell Oli what worked, what broke, what confused you, or what you want Lunara to build next.
              </p>
              <select value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value)} className="lunara-input w-full">
                <option value="bug">Bug</option>
                <option value="idea">Feature idea</option>
                <option value="tarot">Tarot/readings</option>
                <option value="oli">Oli</option>
                <option value="billing">Billing/subscription</option>
                <option value="other">Other</option>
              </select>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} maxLength={3000} className="lunara-input w-full resize-none" placeholder="Your feedback…" />
              <button type="button" onClick={() => void sendFeedback()} className="empire-cta h-10 w-full rounded-lg text-xs uppercase tracking-[0.18em]">Send feedback</button>
              {feedbackStatus && <p className="text-xs text-muted-foreground">{feedbackStatus}</p>}

              {canRate && (
                <div className="border-t border-gold/15 pt-4">
                  <p className="text-xs text-muted-foreground">Enjoying Lunara? Public reviews are always optional and separate from feedback.</p>
                  <div className="mt-3 flex gap-2">
                    {APP_STORE_URL && <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold/40 px-3 py-2 text-xs text-gold-bright">Rate on App Store</a>}
                    {PLAY_STORE_URL && <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gold/40 px-3 py-2 text-xs text-gold-bright">Rate on Google Play</a>}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      )}
    </>
  )
}
