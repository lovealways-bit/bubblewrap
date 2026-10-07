import 'server-only'
import { generateImage } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { put } from '@vercel/blob'

export interface DeckCard {
  id: string
  name: string
  motif: string
}

// A small, curated preview set: the card back plus three iconic faces.
// Free for everyone - the teaser before a $5 full-deck unlock.
export const PREVIEW_CARDS: DeckCard[] = [
  {
    id: 'back',
    name: 'Card Back',
    motif:
      'an ornate symmetrical tarot card back, centered mandala, no figures, no text',
  },
  {
    id: 'the-fool',
    name: 'The Fool',
    motif:
      'The Fool tarot card: a carefree wanderer stepping toward a cliff edge at dawn, a small dog at their heels, a white rose in hand',
  },
  {
    id: 'the-sun',
    name: 'The Sun',
    motif:
      'The Sun tarot card: a radiant sun with a serene face above a child on a white horse, sunflowers and a garden wall',
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    motif:
      'The Moon tarot card: a luminous moon between two towers, a winding path rising from water, a wolf and a dog howling',
  },
]

// The 22 Major Arcana, in order. These carry the strongest imagery in any
// deck and anchor the paid full set.
const MAJOR_ARCANA: DeckCard[] = [
  { id: 'the-fool', name: 'The Fool', motif: 'The Fool: a carefree wanderer stepping toward a cliff edge at dawn, a small dog at their heels, a white rose in hand' },
  { id: 'the-magician', name: 'The Magician', motif: 'The Magician: a figure wit¶»§q«^