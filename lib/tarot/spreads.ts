import type { Spread } from './types'

// Spread definitions live here so new spreads can be added as data
// without changing the engine or UI.

export const SPREADS: Spread[] = [
  {
    id: 'quick-pull',
    name: 'The Single Draw',
    tagline: 'One card. One truth. Lunara wastes no words.',
    positions: [
      {
        id: 'focus',
        label: 'The Focus',
        hint: 'What the Empire wants you to see right now.',
      },
    ],
  },
  {
    id: 'three-card',
    name: 'The Threefold Path',
    tagline: 'Past, present, future. The shape of your thread.',
    positions: [
      { id: 'past', label: 'Past', hint: 'The root that brought you here.' },
      { id: 'present', label: 'Present', hint: 'The force moving through you now.' },
      { id: 'future', label: 'Future', hint: 'Where the current is carrying you.' },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'The Celtic Cross',
    tagline: 'Ten layers deep. Lunara lays your whole map bare.',
    positions: [
      { id: 'heart', label: 'The Heart', hint: 'The matter at the center of it all.' },
      { id: 'crossing', label: 'The Crossing', hint: 'What challenges or crosses you.' },
      { id: 'foundation', label: 'The Foundation', hint: 'The root beneath the situation.' },
      { id: 'recent-past', label: 'The Recent Past', hint: 'What is now passing away.' },
      { id: 'crown', label: 'The Crown', hint: 'What could be, your best possible aim.' },
      { id: 'near-future', label: 'The Near Future', hint: 'What approaches next.' },
      { id: 'self', label: 'The Self', hint: 'How you stand within it all.' },
      { id: 'environment', label: 'The Environment', hint: 'How others and the world press in.' },
      { id: 'hopes-fears', label: 'Hopes & Fears', hint: 'What you long for and what you dread.' },
      { id: 'outcome', label: 'The Outcome', hint: 'Where this road resolves.' },
    ],
  },
]

export function getSpread(id: string): Spread | undefined {
  return SPREADS.find((s) => s.id === id)
}
