// Central definition of Lunara's membership plans + one-time offers.
// Pricing (names, amounts, feature sets) mirrors LUNARA_MONETIZATION_V0_DIRECTIVE.md.
// Price IDs below are test-mode Products/Prices created directly in this
// project's connected Stripe account (via STRIPE_SECRET_KEY) so Checkout
// actually works end-to-end here - the directive's own test IDs live in a
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
  /** Private moon & sun journal - paid members only. */
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
 ¶»§q«^