'use server'

import { db } from '@/lib/db'
import { customizationProfile } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface CustomizationInput {
  birthDate?: string
  birthTime?: string
  birthPlace?: string
  sunSign?: string
  moonSign?: string
  risingSign?: string
  focusAreas?: string[]
  notes?: string
}

export async function getCustomizationProfile() {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(customizationProfile)
    .where(eq(customizationProfile.userId, userId))
    .orderBy(desc(customizationProfile.updatedAt))
    .limit(1)
  return rows[0] ?? null
}

export async function saveCustomizationProfile(input: CustomizationInput) {
  const userId = await getUserId()

  // Gate: personalization requires the Astral tier or above.
  const tier = await getUserTier(userId)
  if (!tier.customization) {
    return { ok: false as const, error: 'upgrade-required' }
  }

  const now = new Date()
  const existing = await db
    .select()
    .from(customizationProfile)
    .where(eq(customizationProfile.userId, userId))
    .orderBy(desc(customizationProfile.updatedAt))
    .limit(1)

  const values = {
    birthDate: input.birthDate ?? null,
    birthTime: input.birthTime ?? null,
    birthPlace: input.birthPlace ?? null,
    sunSign: input.sunSign ?? null,
    moonSign: input.moonSign ?? null,
    risingSign: input.risingSign ?? null,
    focusAreas: (input.focusAreas ?? []) as never,
    notes: input.notes ?? null,
    updatedAt: now,
  }

  if (existing[0]) {
    await db
      .update(customizationProfile)
      .set(values)
      .where(eq(customizationProfile.id, existing[0].id))
  } else {
    await db.insert(customizationProfile).values({
      id: crypto.randomUUID(),
      userId,
      ...values,
      createdAt: now,
    })
  }
  revalidatePath('/account')
  return { ok: true as const }
}
