'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Trash2, Loader2, Plus, X } from 'lucide-react'
import {
  createCustomDeckPreview,
  deleteCustomDeck,
} from '@/app/actions/custom-deck'

interface DeckArt {
  cardId: string
  cardName: string
  pathname: string
}

interface Deck {
  id: string
  name: string
  stylePrompt: string | null
  borderStyle: string | null
  palette: unknown
  cardArt: unknown
  status: string
}

const BORDER_OPTIONS = ['Thin gilded frame', 'Ornate baroque', 'Minimal none', 'Art-nouveau vines']

export function DeckDesigner({ initialDecks }: { initialDecks: Deck[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [stylePrompt, setStylePrompt] = useState('')
  const [borderStyle, setBorderStyle] = useState(BORDER_OPTIONS[0])
  const [palette, setPalette] = useState<string[]>(['#d4af37', '#150a26'])
  const [colorDraft, setColorDraft] = useState('#7c5cbf')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function addColor() {
    if (palette.length >= 5) return
    if (palette.includes(colorDraft)) return
    setPalette([...palette, colorDraft])
  }

  function removeColor(c: string) {
    setPalette(palette.filter((x) => x !== c))
  }

  function handleGenerate() {
    setError(null)
    if (!name.trim()) {
      setError('Give your deck a name first.')
      return
    }
    startTransition(async () => {
      const res = await createCustomDeckPreview({
        name,
        stylePrompt,
        palette,
        borderStyle,
      })
      if (!res.ok) {
        setError(
          res.error === 'upgrade-required'
            ? 'This feature requires Lunara Plus.'
            : res.error,
        )
        return
      }
      setName('')
      setStylePrompt('')
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCustomDeck(id)
      router.refresh()
    })
  }

  return (
    <div className="mt-8 space-y-10">
      <section className="empire-panel p-6">
        <div className="space-y-4">
          <div>
            <label className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold/70">
              Deck name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The Aurora Deck"
              className="lunara-input mt-1.5"
              maxLength={60}
            />
          </div>

          <div>
            <label className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold/70">
              Visual style
            </label>
            <textarea
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              placeholder="Dreamy watercolor, celestial, soft gold light, art-nouveau linework"
              rows={3}
              className="lunara-input mt-1.5 resize-none"
              maxLength={300}
            />
          </div>

          <div>
            <label className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold/70">
              Palette
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {palette.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-black/30 py-1 pl-1.5 pr-2 text-xs text-foreground"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                  {c}
                  <button
                    type="button"
                    onClick={() => removeColor(c)}
                    aria-label={`Remove ${c}`}
                    className="text-muted-foreground hover:text-gold-bright"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {palette.length < 5 && (
                <span className="inline-flex items-center gap-1.5">
                  <input
                    type="color"
                    value={colorDraft}
                    onChange={(e) => setColorDraft(e.target.value)}
                    aria-label="Choose a color to add"
                    className="h-7 w-9 cursor-pointer rounded border border-gold/30 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-1 text-xs text-gold/80 hover:text-gold-bright"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-gold/70">
              Border
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {BORDER_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBorderStyle(b)}
                  className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    borderStyle === b
                      ? 'border-gold bg-gold/15 text-gold-bright'
                      : 'border-gold/25 text-gold/70 hover:border-gold/50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={pending}
            className="empire-cta inline-flex h-11 items-center gap-2 rounded-lg px-6 font-display text-xs uppercase tracking-[0.24em] disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Lunara is painting…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate preview
              </>
            )}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm uppercase tracking-[0.24em] text-gold/70">
          Your decks
        </h2>
        {initialDecks.length === 0 ? (
          <p className="mt-3 text-sm italic text-muted-foreground">
            No decks yet. Describe a style above to paint your first preview.
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {initialDecks.map((deck) => {
              const art = Array.isArray(deck.cardArt)
                ? (deck.cardArt as DeckArt[])
                : []
              return (
                <div key={deck.id} className="empire-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-gold-bright">
                        {deck.name}
                      </h3>
                      {deck.stylePrompt && (
                        <p className="mt-0.5 text-xs italic text-muted-foreground">
                          {deck.stylePrompt}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(deck.id)}
                      disabled={pending}
                      aria-label={`Delete ${deck.name}`}
                      className="text-muted-foreground transition-colors hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {art.map((c) => (
                      <figure key={c.cardId} className="space-y-1.5">
                        <div className="overflow-hidden rounded-lg border border-gold/25 bg-black/40 aspect-[2/3]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/file?pathname=${encodeURIComponent(c.pathname)}`}
                            alt={`${deck.name} — ${c.cardName}`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <figcaption className="text-center text-[0.65rem] uppercase tracking-[0.15em] text-gold/60">
                          {c.cardName}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
