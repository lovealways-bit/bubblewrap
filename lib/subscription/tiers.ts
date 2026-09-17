// Central definition of Lunara's membership plans + one-time offers.
// Pricing (names, amounts, feature sets) mirrors LUNARA_MONETIZATION_V0_DIRECTIVE.md.
// Price IDs below are test-mode Products/Prices created directly in this
// project's connected Stripe account (via STRIPE_SECRET_KEY) so Checkout
// actually works end-to-end here — the directive's own test IDs live in a
// separate "AllPath Edu. sandbox" Stripe account this project's key cannot
// see. Test-mode Price IDs are not secrets. Replace with live equivalents
// only after the owner connects a live Stripe account.

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
    stripePriceId: 'price_1UGjLAK2NOJSv83D4DYmZsgL',
    features: [
      'Everything in Free',
      'Personalized daily guidance',
      'Birth-chart insights',
      'Private moon & sun journal',
      'Celestial calendar with eclipses & sabbats',
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
    stripePriceId: 'price_1UGjLBK2NOJSv83D40mHcvnJ',
    features: [
      'Everything in Core',
      'All deep spreads including the Celtic Cross',
      'Unlimited synced reading history + Growth insights',
      'Design your own deck with professional AI card art',
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
    stripePriceId: 'price_1UGjLBK2NOJSv83D2N60MXAo',
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

export type OneTimeOfferId = 'birthChart' | 'personalReading'

export interface OneTimeOffer {
  id: OneTimeOfferId
  name: string
  priceLabel: string
  priceCents: number
  stripePriceId: string
  description: string
  /** Personal Reading requires picking how the reading is delivered. */
  requiresDeliveryPreference: boolean
}

export const ONE_TIME_OFFERS: Record<OneTimeOfferId, OneTimeOffer> = {
  birthChart: {
    id: 'birthChart',
    name: 'Birth Chart',
    priceLabel: '$33.33',
    priceCents: 3333,
    stripePriceId: 'price_1UGjLBK2NOJSv83D3yunl9HO',
    description: 'A bespoke natal chart reading, one time.',
    requiresDeliveryPreference: false,
  },
  personalReading: {
    id: 'personalReading',
    name: 'Personal Reading',
    priceLabel: '$49.99',
    priceCents: 4999,
    stripePriceId: 'price_1UGjLCK2NOJSv83DLgzLgT5w',
    description: 'A one-to-one reading with a live reader, delivered your way.',
    requiresDeliveryPreference: true,
  },
}
