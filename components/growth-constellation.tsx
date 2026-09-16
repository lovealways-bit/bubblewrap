'use client'

import { useEffect, useState } from 'react'
import { BookHeart, Compass, Sparkles, Star, Trophy } from 'lucide-react'
import { computeGrowth, realmSuit, type GrowthModel, type LessonRealm } from '@/lib/tarot/growth'
import { SunflowerCompass } from './sunflower-compass'
import { SuitEmblem } from './suit-emblem'

const STATUS_LABEL: Record<LessonRealm['status'], string> = {
  dormant: 'Untouched',
  exploring: 'Exploring',
  integrating: 'Integrating',
  integrated: 'Integrated',
}

const STATUS_TONE: Record<LessonRealm['status'], string> = {
  dormant: 'border-gold/15 text-gold/35',
  exploring: 'border-gold/40 text-gold/80',
  integrating: 'border-gold/60 text-gold-bright',
  integrated: 'border-teal/60 text-teal',
}

export function GrowthConstellation() {
  const [model, setModel] = useState<GrowthModel | null>(null)

  // Recompute from on-device history every time the screen opens.
  useEffect(() => {
    setModel(computeGrowth())
  }, [])

  if (!model) return null

  const empty = model.totalReadings === 0
  const milestonesReached = model.milestones.filter((m) => m.reached).length

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      {/* ---- Hero: the living compass ---- */}
      <div className="flex flex-col items-center text-center">
        <SunflowerCompass
          progress={model.progress}
          cardinal={model.cardinal}
          milestonesReached={milestonesReached}
          milestonesTotal={model.milestones.length}
          className="h-56 w-56 drop-shadow-[0_0_30px_-8px_var(--gold)]"
        />
        <h2 className="mt-4 font-display text-2xl uppercase tracking-[0.18em] text-gold-bright text-glow-gold">
          Growth Constellation
        </h2>
        <p className="mt-2 max-w-md text-sm italic leading-relaxed text-surface-foreground/85 text-pretty">
          {model.direction}
        </p>
        {!empty && (
          <p className="mt-3 font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold/55">
            {model.realmsExplored} of {model.realms.length} realms · {Math.round(model.progress * 100)}% integrated
          </p>
        )}
      </div>

      {empty ? (
        <div className="empire-panel mt-10 p-8 text-center">
          <Compass className="mx-auto h-8 w-8 text-gold/60" />
          <p className="mt-3 text-sm leading-relaxed text-surface-foreground/80 text-pretty">
            The map is empty for now. Draw and{' '}
            <span className="text-gold-bright">save a reading</span> — Lunara will begin to learn
            your recurring themes, the lessons you are working through, and the symbols that speak to
            you.
          </p>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-10">
          {/* ---- Current lesson ---- */}
          {model.currentLesson && (
            <Panel icon={<Sparkles className="h-4 w-4" />} title="Current lesson">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/[0.06]">
                  <SuitEmblem suit={realmSuit(model.currentLesson.id)} className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-display text-lg text-gold-bright">
                    {model.currentLesson.name}
                  </p>
                  <p className="text-sm leading-relaxed text-surface-foreground/85 text-pretty">
                    {model.currentLesson.lesson}.
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.2em] ${STATUS_TONE[model.currentLesson.status]}`}
                  >
                    {STATUS_LABEL[model.currentLesson.status]}
                  </span>
                </div>
              </div>
            </Panel>
          )}

          {/* ---- Realms explored ---- */}
          <Panel icon={<Star className="h-4 w-4" />} title="The seven realms">
            <ul className="flex flex-col gap-2">
              {model.realms.map((r) => (
                <li
                  key={r.id}
                  className="empire-row flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <SuitEmblem suit={realmSuit(r.id)} className="h-6 w-6 opacity-90" />
                    <div>
                      <p className="font-display text-sm text-gold-bright">{r.name}</p>
                      <p className="text-[0.7rem] text-muted-foreground">{r.symbol}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.55rem] uppercase tracking-[0.18em] ${STATUS_TONE[r.status]}`}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* ---- Recurring cards ---- */}
          {model.recurringCards.length > 0 && (
            <Panel icon={<Sparkles className="h-4 w-4" />} title="Cards that keep returning">
              <div className="flex flex-wrap gap-3">
                {model.recurringCards.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2.5 rounded-lg border border-gold/25 bg-surface/40 px-3 py-2"
                  >
                    <SuitEmblem suit={c.arcana === 'major' ? undefined : c.suit} className="h-6 w-6" />
                    <div>
                      <p className="font-display text-xs text-gold-bright">{c.name}</p>
                      <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold/50">
                        ×{c.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* ---- Emerging strengths ---- */}
          {model.strengths.length > 0 && (
            <Panel icon={<Trophy className="h-4 w-4" />} title="Emerging strengths">
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-gold/30 bg-gold/[0.05] px-3 py-1 text-xs text-gold/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Panel>
          )}

          {/* ---- Meaningful symbols ---- */}
          {model.symbols.length > 0 && (
            <Panel icon={<Star className="h-4 w-4" />} title="Meaningful symbols">
              <div className="flex flex-wrap gap-2">
                {model.symbols.map((s) => (
                  <span
                    key={`${s.kind}-${s.label}`}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      s.kind === 'rune'
                        ? 'border-teal/40 text-teal/90'
                        : 'border-gold/30 text-gold/85'
                    }`}
                  >
                    {s.label} · {s.count}
                  </span>
                ))}
              </div>
            </Panel>
          )}

          {/* ---- Milestones ---- */}
          <Panel icon={<Trophy className="h-4 w-4" />} title="The seven gates">
            <ul className="flex flex-col gap-2">
              {model.milestones.map((m) => (
                <li
                  key={m.threshold}
                  className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 ${
                    m.reached ? 'border-gold/45 bg-gold/[0.06]' : 'border-gold/12 bg-surface/20'
                  }`}
                >
                  <div>
                    <p className={`font-display text-sm ${m.reached ? 'text-gold-bright' : 'text-gold/40'}`}>
                      {m.name}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground">{m.detail}</p>
                  </div>
                  <span
                    className={`text-[0.55rem] uppercase tracking-[0.2em] ${
                      m.reached ? 'text-teal' : 'text-gold/30'
                    }`}
                  >
                    {m.reached ? 'Reached' : `${m.threshold} readings`}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* ---- Reflections tally ---- */}
          <Panel icon={<BookHeart className="h-4 w-4" />} title="Your practice">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat value={model.totalReadings} label="Readings" />
              <Stat value={model.totalCards} label="Cards drawn" />
              <Stat value={model.reflections} label="Reflections" />
            </div>
          </Panel>
        </div>
      )}
    </section>
  )
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 border-b border-gold/20 pb-2 font-display text-xs uppercase tracking-[0.3em] text-gold/70">
        {icon}
        {title}
      </p>
      {children}
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="empire-row py-4">
      <p className="font-display text-2xl text-gold-bright text-glow-gold">{value}</p>
      <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold/55">{label}</p>
    </div>
  )
}
