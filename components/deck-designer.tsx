'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Trash2, Loader2, Plus, X, Lock, Check } from 'lucide-react'
import { CheckoutDisclosure } from '@/components/checkout-disclosure'
import { CUSTOM_DECK_UNLOCK_PRICE_CENTS } from '@/lib/subscription/tiers'
import {
  createCustomDeckPreview,
  deleteCustomDeck,
  unlockDeck,
  generateFullDeckBatch,
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
  fullCardArt: unknown
  status: string
}

const BORDER_OPTIONS = ['Thin gilded frame', 'Ornate baroque', 'Minimal none', 'Art-nouveau vines']

export function DeckDesigner({
  initialDecks,
  entitledFree,
  unlockPriceLabel,
  fullDeckSize,
}: {
  initialDecks: Deck[]
  entitledFree: boolean
  unlockPriceLabel: string
  fullDeckSize: number
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [stylePrompt, setStylePrompt] = useState('')
  const [borderStyle, setBorderStyle] = useState(BORDER_OPTIONS[0])
  const [palette, setPalette] = useState<string[]>(['#d4af37', '#150a26'])
  const [colorDraft, setColorDraft] = useState('#7c5cbf')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Per-deck busy state so unlock / ¶»§q«^