import { db } from '@/lib/db'
import { subscription } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { getTier, type Tier, type TierId } from './tiers'

// Reads the user's active tier from the subscription table. Falls back to the
// free tier when there is no active paid subscription. Server-only; every
// gate that matters must call this rather than trusting client state.
export async function getUserTier(userId: string): Promise<Tier> {
  const rows = await db
    .select()
    .from(subscription)
    .where(and(eq(subscription.userId, userId), eq(subscription.status, 'active')))
    .orderBy(desc(subscription.updatedAt))
    .limit(1)

  const tierId = (rows[0]?.tier ?? 'free') as TierId
  return getTier(tierId)
}

export function canUseCustomization(tier: Tier) {
  return tier.customization
}

export function canUsePersonalConsult(tier: Tier) {
  return tier.personalConsult
}

export function canUseCustomDecks(tier: Tier) {
  return tier.customDecks
}

export function canUsePremiumSpreads(tier: Tier) {
  return tier.premiumSpreads
}
