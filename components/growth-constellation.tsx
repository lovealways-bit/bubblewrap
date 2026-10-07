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
  ¶»§q«^