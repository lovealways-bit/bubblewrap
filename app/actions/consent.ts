'use server'

import { db } from '@/lib/db'
import { consent } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface ConsentInput {
  dataPersonalization: boolean
  dataAnalytics: boolean
  marketingEmails: boolean
  acceptedTerms: boolean
}

export async function getConsent() {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(consent)
    .where(eq(consent.userId, userId))
    .orderBy(desc(consent.updatedAt))
    .limit(1)
  return rows[0] ?? null
}

export async function saveConsent(input: ConsentInput) {
  const userId = await getUserId()
  const now = new Date()
  const existing = await db
    .select()
    .from(consent)
    .where(eq(consent.userId, userId))
    .orderBy(desc(consent.updatedAt))
    .limit(1)

  const values = {
    dataPersonalization: input.dataPersonalization,
    dataAnalytics: input.dataAnalytics,
    marketingEmails: input.marketingEmails,
    acceptedTermsAt: input.acceptedTerms ? now : null,
    updatedAt: now,
  }

  if (existing[0]) {
    await db.update(consent).set(values).where(eq(consent.id, existing[0].id))
  } else {
    await db.insert(consent).values({
      id: crypto.randomUUID(),
      userId,
      ...values,
      createdAt: now,
    })
  }
  revalidatePath('/account')
  return { ok: true as const }
}
