'use client'

import { useState, useTransition } from 'react'
import { Trash2, Moon, Save, PenLine } from 'lucide-react'
import {
  createJournalEntry,
  deleteJournalEntry,
} from '@/app/actions/journal'

const MOODS = ['radiant', 'calm', 'tender', 'restless', 'shadowed', 'hopeful'] as const

interface Entry {
  id: string
  title: string | null
  body: string
  mood: string | null
  moonPhase: string | null
  moonIllumination: number | null
  entryDate: string
  createdAt: string
  updatedAt: string
}

interface CurrentMoon {
  name: string
  emblem: string
  illumination: number
}

export function Journal({
  initialEntries,
  currentMoon,
}: {
  initialEntries: Entry[]
  currentMoon: CurrentMoon
}) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mood, setMood] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSave() {
    setError(null)
    if (!body.trim()) {
      setError('Write something before saving.')
      return
    }
    startTransition(async () => {
      const res = await createJournalEntry({
        title: title || undefined,
        body,
        mood: mood || undefined,
      })
      if (!res.ok) {
        setError(
          res.error === 'upgrade-required'
            ? 'Your plan no longer includes the journal.'
            : res.error,
        )
        return
      }
      // Optimistically prepend a snapshot stamped with the current moon.
      const now = new Date()
      setEntries((prev) => [
        {
          id: `tmp-${now.getTime()}`,
          title: title.trim() || null,
          body: body.trim(),
          mood: mood || null,
          moonPhase: currentMoon.name,
          moonIllumination: currentMoon.illumination,
          entryDate: now.toISOString().slice(0, 10),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        ...prev,
      ])
      setTitle('')
      setBody('')
      setMood('')
    })
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    startTransition(async () => {
      await deleteJournalEntry(id)
    })
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      <section className="empire-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-[0.24em] text-gold/70">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            New entry
          </p>
          <p
            className="inline-flex items-center gap-1.5 font-display text-[0.65rem] uppercase tracking-[0.2em] text-gold/60"
            title={`${currentMoon.name} · ${currentMoon.illumination}% lit`}
          >
            <span aria-hidden="true" className="text-base leading-none text-gold-bright">
              {currentMoon.emblem}
            </span>
            {currentMoon.name}
          </p>
        </div>

        <label htmlFor="j-title" className="sr-only">
          Title
        </label>
        <input
          id="j-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A title for this moon (optional)"
          maxLength={200}
          className="mt-4 w-full rounded-lg border border-gold/25 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold/60 focus:outline-none"
        />

        <label htmlFor="j-body" className="sr-only">
          Reflection
        </label>
        <textarea
          id="j-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did the cards stir in you tonight?"
          rows={5}
          maxLength={20000}
          className="mt-3 w-full resize-y rounded-lg border border-gold/25 bg-background/60 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-gold/60 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.22em] text-gold/50">
            Mood
          </span>
          {MOODS.map((m) => {
            const active = mood === m
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMood(active ? '' : m)}
                className={`rounded-full border px-3 py-1 text-[0.7rem] capitalize tracking-wide transition-colors ${
                  active
                    ? 'border-gold bg-gold/15 text-gold-bright'
                    : 'border-gold/25 text-gold/60 hover:border-gold/50 hover:text-gold'
                }`}
              >
                {m}
              </button>
            )
          })}
        </div>

        {error && (
          <p className="mt-3 text-xs italic text-red-300/80" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="empire-cta mt-5 inline-flex h-10 items-center gap-2 rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em] disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save entry'}
        </button>
      </section>

      <section className="flex flex-col gap-4">
        {entries.length === 0 ? (
          <p className="text-center text-sm italic text-muted-foreground">
            No reflections yet. The first page of your moon journal awaits.
          </p>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="empire-panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {entry.title && (
                    <h3 className="font-display text-lg font-bold text-gold-bright text-balance">
                      {entry.title}
                    </h3>
                  )}
                  <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-[0.6rem] uppercase tracking-[0.2em] text-gold/50">
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {entry.moonPhase && (
                      <span className="inline-flex items-center gap-1 text-gold/60">
                        <Moon className="h-3 w-3" aria-hidden="true" />
                        {entry.moonPhase}
                        {typeof entry.moonIllumination === 'number' &&
                          ` · ${entry.moonIllumination}%`}
                      </span>
                    )}
                    {entry.mood && (
                      <span className="capitalize text-gold/60">{entry.mood}</span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  aria-label={`Delete entry${entry.title ? ` ${entry.title}` : ''}`}
                  className="shrink-0 rounded-md border border-gold/20 p-2 text-gold/50 transition-colors hover:border-red-400/40 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {entry.body}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
