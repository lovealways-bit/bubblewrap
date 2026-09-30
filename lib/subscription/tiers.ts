// Central definition of Lunara's membership plans + one-time offers.
// Pricing (names, amounts, feature sets) mirrors LUNARA_MONETIZATION_V0_DIRECTIVE.md.
// Stripe Price IDs are environment-resolved so sandbox/live account changes do not
// require source edits. The existing test IDs remain fallbacks until the Google/Firebase
// migration preview is fully configured. Price IDs are public identifiers; Stripe secret
// and webhook keys remain server-only. STRIPE_SECRET_KEY and the selected Price IDs must
// always belong to the same Stripe account.

const STRIPE_PRICE_CORE = process.env.NEXT_PUBLIC_STRIPE_PRICE_CORE ?? 'price_1UGjLAK2NOJSv83D4DYmZsgL'
const STRIPE_PRICE_PLUS = process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS ?? 'price_1UGjLBK2NOJSv83D40mHcvnJ'
const STRIPE_PRICE_PERSONAL = process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL ?? 'price_1UGjLBK2NOJSv83D2N60MXAo'
const STRIPE_PRICE_BIRTH_CHART = process.env.NEXT_PUBLIC_STRIPE_PRICE_BIRTH_CHART ?? 'price_1UGjLBK2NOJSv83D3yunl9HO'
const STRIPE_PRICE_PERSONAL_READING = process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL_READING ?? 'price_1UGjLCK2NOJSv83DLgzLgT5w'
const STRIPE_PRICE_CUSTOM_DECK = process.env.NEXT_PUBLIC_STRIPE_PRICE_CUSTOM_DECK ?? 'price_1UGk9gK2NOJSv83Daswx7RtK'

export type TierId = 'free' | 'core' | 'plus' | 'personal'

export interface Tier {
  id: TierId
  name: string
  tagline: string
  priceLabel: string
  /** Monthly price in USD cents; null for the free tier. */
  priceCents: number | null
  /** Test-mode Stripe Price ID backing this plan's subscription. */
  stripePriceId: string | null
  features: string[]
  /** Max readings kept in synced history; null = unlimited. */
  historyLimit: number | null
  premiumSpreads: boolean
  customization: boolean
  customDecks: boolean
  personalConsult: boolean
  /** Private moon & sun journal — paid members only. */
  journal: boolean
  /** Celestial calendar: moon/sun phases, eclipses, esoteric events. */
  celestial: boolean
  /** Free is ad-supported; every paid plan is ad-free. */
  adsEnabled: boolean
  rewardedAdsEnabled: boolean
}

export const TIERS: Record<TierId, Tier> = {
  free: {
    id: 'free',
    name: 'Lunara Free',
    tagline: 'Begin the path.',
    priceLabel: 'Free',
    priceCents: null,
    stripePriceId: null,
    features: [
      'Single-card and three-card spreads',
      'All four preset deck themes',
      'Design a deck — free preview, $5 to unlock the full set',
      'Up to 10 saved readings, synced across devices',
      'Ad-supported, with optional rewarded-ad bonus content',
    ],
    historyLimit: 10,
    premiumSpreads: false,
    customization: false,
    customDecks: false,
    personalConsult: false,
    journal: false,
    celestial: false,
    adsEnabled: true,
    rewardedAdsEnabled: true,
  },
  core: {
    id: 'core',
    name: 'Lunara Core',
    tagline: 'Personalized daily guidance.',
    priceLabel: '$9.99 / mo',
    priceCents: 999,
    stripePriceId: STRIPE_PRICE_CORE,
    features: [
      'Everything in Free',
      'Personalized daily guidance',
      'Birth-chart insights',
      'Private moon & sun journal',
      'Celestial calendar with eclipses & sabbats',
      'Design a deck — free preview, $5 to unlock the full set',
      'Ad-free',
    ],
    historyLimit: null,
    premiumSpreads: false,
    customization: true,
    customDecks: false,
    personalConsult: false,
    journal: true,
    celestial: true,
    adsEnabled: false,
    rewardedAdsEnabled: false,
  },
  plus: {
    id: 'plus',
    name: 'Lunara Plus',
    tagline: 'Readings shaped to your stars.',
    priceLabel: '$19.99 / mo',
    priceCents: 1999,
    stripePriceId: STRIPE_PRICE_PLUS,
    features: [
      'Everything in Core',
      'All deep spreads including the Celtic Cross',
      'Unlimited synced reading history + Growth insights',
      'Design unlimited decks — full AI card art included (no $5 unlock)',
      'Ad-free',
    ],
    historyLimit: null,
    premiumSpreads: true,
    customization: true,
    customDecks: true,
    personalConsult: false,
    journal: true,
    celestial: true,
    adsEnabled: false,
    rewardedAdsEnabled: false,
  },
  personal: {
    id: 'personal',
    name: 'Lunara Personal',
    tagline: 'Guidance, one to one.',
    priceLabel: '$49.99 / mo',
    priceCents: 4999,
    stripePriceId: STRIPE_PRICE_PERSONAL,
    features: [
      'Everything in Plus',
      'Direct personal consults with a live reader',
      'Priority booking for one-to-one sessions',
      'Bespoke birth-chart readings written for you',
      'Ad-free',
    ],
    historyLimit: null,
    premiumSpreads: true,
    customization: true,
    customDecks: true,
    personalConsult: true,
    journal: true,
    celestial: true,
    adsEnabled: false,
    rewardedAdsEnabled: false,
  },
}

export const TIER_ORDER: TierId[] = ['free', 'core', 'plus', 'personal']

export function getTier(id: string | null | undefined): Tier {
  if (id && id in TIERS) return TIERS[id as TierId]
  return TIERS.free
}

export type DeliveryPreference = 'zoom' | 'phone' | 'text' | 'email' | 'social' | 'in_app'

export const DELIVERY_PREFERENCES: { id: DeliveryPreference; label: string }[] = [
  { id: 'zoom', label: 'Zoom' },
  { id: 'phone', label: 'Phone' },
  { id: 'text', label: 'Text' },
  { id: 'email', label: 'Email' },
  { id: 'social', label: 'Social media' },
  { id: 'in_app', label: 'In app' },
]

// A single custom deck's full-art unlock, charged once per deck. Plus &
// Personal members get this included and never hit checkout. Test-mode price
// created in this project's connected Stripe account.
export const CUSTOM_DECK_UNLOCK_PRICE_ID = STRIPE_PRICE_CUSTOM_DECK
export const CUSTOM_DECK_UNLOCK_PRICE_CENTS = 500
export const CUSTOM_DECK_UNLOCK_PRICE_LABEL = '$5'

export type OneTimeOfferId = 'birthChart' | 'personalReading' | 'customDeck'

export interface OneTimeOffer {
  id: OneTimeOfferId
  name: string
  priceLabel: string
  priceCents: number
  stripePriceId: string
  description: string
  /** Personal Reading requires picking how the reading is delivered. */
  requiresDeliveryPreference: boolean
  /**
   * When set, the pricing card links here instead of starting Stripe checkout
   * directly. Used by the custom deck offer, which is purchased per-deck from
   * inside the atelier rather than as a standalone product.
   */
  ctaHref?: string
  ctaLabel?: string
}

export const ONE_TIME_OFFERS: Record<OneTimeOfferId, OneTimeOffer> = {
  birthChart: {
    id: 'birthChart',
    name: 'Birth Chart',
    priceLabel: '$33.33',
    priceCents: 3333,
    stripePriceId: STRIPE_PRICE_BIRTH_CHART,
    description: 'A bespoke natal chart reading, one time.',
    requiresDeliveryPreference: false,
  },
  personalReading: {
    id: 'personalReading',
    name: 'Personal Reading',
    priceLabel: '$49.99',
    priceCents: 4999,
    stripePriceId: STRIPE_PRICE_PERSONAL_READING,
    description: 'A one-to-one reading with a live reader, delivered your way.',
    requiresDeliveryPreference: true,
  },
  customDeck: {
    id: 'customDeck',
    name: 'Custom Deck',
    priceLabel: CUSTOM_DECK_UNLOCK_PRICE_LABEL,
    priceCents: CUSTOM_DECK_UNLOCK_PRICE_CENTS,
    stripePriceId: CUSTOM_DECK_UNLOCK_PRICE_ID,
    description:
      'Design your own deck with AI card art. Preview it free, then unlock the full deck for $5 — one time, per deck. Included free with Plus and Personal.',
    requiresDeliveryPreference: false,
    ctaHref: '/deck-designer',
    ctaLabel: 'Open the atelier',
  },
}
