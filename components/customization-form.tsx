'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveCustomizationProfile, type CustomizationInput } from '@/app/actions/customization'

const ZODIAC = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const FOCUS_OPTIONS = ['Love', 'Career', 'Growth', 'Health', 'Family', 'Purpose', 'Money', 'Creativity']

interface Props {
  initial: {
    birthDate?: string | null
    birthTime?: string | null
    birthPlace?: string | null
    sunSign?: string | null
    moonSign?: string | null
    risingSign?: string | null
    focusAreas?: string[] | null
    notes?: string | null
  } | null
}

export function CustomizationForm({ initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<CustomizationInput>({
    birthDate: initial?.birthDate ?? '',
    birthTime: initial?.birthTime ?? '',
    birthPlace: initial?.birthPlace ?? '',
    sunSign: initial?.sunSign ?? '',
    moonSign: initial?.moonSign ?? '',
    risingSign: initial?.risingSign ?? '',
    focusAreas: initial?.focusAreas ?? [],
    notes: initial?.notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')

  function update<K extends keyof CustomizationInput>(key: K, value: CustomizationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setStatus('idle')
  }

  function toggleFo¶»§q«^