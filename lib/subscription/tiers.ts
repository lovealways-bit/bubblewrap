// Central definition of subscription tiers and what each one unlocks.
// Entitlement checks throughout the app read from here so gating stays in one place.

export type TierId = 'free' | 'customization' | 'consult'

export interface Tier {
  id: TierId
  name: string
  tagline: string
  priceLabel: string
  /** Monthly price in USD cents; null for the free tier. */
  priceCents: number | null
  features: string[]
  /** Max readings kept in synced history; null = unlimited. */
  historyLimit: number | null
  /** Spread ids unlocked beyond the always-free basics. */
  premiumSpreads: boolean
  /** Birth-chart customization + personalized readings. */
  customization: boolean
  /** In-app custom deck designer (AI art). */
  customDecks: boolean
  /** Direct personal consults / booked readings with a reader. */
  personalConsult: boolean
}

export const TIERS: Record<TierId, Tier> = {
  free: {
    id: 'free',
    name: 'Seeker',
    tagline: 'Begin the path.',
    priceLabel: 'Free',
    priceCents: null,
    features: [
      'Single-card and three-card spreads',
      'All four preset deck themes',
      'Up to 10 saved readings, synced across devices',
      'The full card codex and rune oracle',
    ],
    historyLimit: 10,
    premiumSpreads: false,
    customization: false,
    customDecks: false,
    personalConsult: false,
  },
  customization: {
    id: 'customization',
    name: 'Astral',
    tagline: 'Readings shaped to your stars.',
    priceLabel: '$9 / mo',
    priceCents: 900,
    features: [
      'Everything in Seeker',
      'All deep spreads including the Celtic Cross',
      'Unlimited synced reading history + Growth insights',
      'Birth-chart personalization (sun, moon, rising)',
      'Design your own deck with professional AI card art',
    ],
    historyLimit: null,
    premiumSpreads: true,
    customization: true,
    customDecks: true,
    personalConsult: false,
  },
  consult: {
    id: 'consult',
    name: 'Oracle',
    tagline: 'Guidance, one to one.',
    priceLabel: '$49 / mo',
    priceCents: 4900,
    features: [
      'Everything in Astral',
      'Direct personal consults with a live reader',
      'Priority booking for one-to-one sessions',
      'Bespoke birth-chart readings written for you',
    ],
    historyLimit: null,
    premiumSpreads: true,
    customization: true,
    customDecks: true,
    personalConsult: true,
  },
}

export const TIER_ORDER: TierId[] = ['free', 'customization', 'consult']

export function getTier(id: string | null | undefined): Tier {
  if (id && id in TIERS) return TIERS[id as TierId]
  return TIERS.free
}

// Which Stripe price env var backs each paid tier. Set these in project env
// (or wire to Stripe price IDs created via the Stripe MCP/dashboard).
export const TIER_PRICE_ENV: Record<Exclude<TierId, 'free'>, string> = {
  customization: 'STRIPE_PRICE_CUSTOMIZATION',
  consult: 'STRIPE_PRICE_CONSULT',
}
