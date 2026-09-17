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

  function toggleFocus(area: string) {
    setForm((f) => {
      const current = f.focusAreas ?? []
      return {
        ...f,
        focusAreas: current.includes(area)
          ? current.filter((a) => a !== area)
          : [...current, area],
      }
    })
    setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')
    try {
      const res = await saveCustomizationProfile(form)
      if (res.ok) {
        setStatus('saved')
        router.refresh()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">Birth date</span>
          <input
            type="date"
            value={form.birthDate ?? ''}
            onChange={(e) => update('birthDate', e.target.value)}
            className="lunara-input"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">Birth time</span>
          <input
            type="time"
            value={form.birthTime ?? ''}
            onChange={(e) => update('birthTime', e.target.value)}
            className="lunara-input"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">Birth place</span>
        <input
          type="text"
          value={form.birthPlace ?? ''}
          onChange={(e) => update('birthPlace', e.target.value)}
          placeholder="City, country"
          className="lunara-input"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        {(['sunSign', 'moonSign', 'risingSign'] as const).map((key) => (
          <label key={key} className="flex flex-col gap-1.5">
            <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">
              {key === 'sunSign' ? 'Sun' : key === 'moonSign' ? 'Moon' : 'Rising'}
            </span>
            <select
              value={form[key] ?? ''}
              onChange={(e) => update(key, e.target.value)}
              className="lunara-input"
            >
              <option value="">—</option>
              {ZODIAC.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">Focus areas</legend>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((area) => {
            const active = (form.focusAreas ?? []).includes(area)
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleFocus(area)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-gold bg-gold/15 text-gold-bright'
                    : 'border-gold/25 text-gold/60 hover:border-gold/50 hover:text-gold'
                }`}
              >
                {area}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-gold/60">Notes for your readings</span>
        <textarea
          value={form.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Anything you'd like Lunara to keep in mind."
          className="lunara-input resize-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="empire-cta h-10 rounded-lg px-6 font-display text-xs uppercase tracking-[0.24em] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save chart details'}
        </button>
        {status === 'saved' && (
          <span className="text-xs text-gold-bright">Saved. Your readings are now personalized.</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-teal">Could not save. Please try again.</span>
        )}
      </div>
    </form>
  )
}
