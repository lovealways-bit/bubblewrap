'use server'

import { db } from '@/lib/db'
import { savedReading } from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { and, count, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface SaveReadingInput {
  spreadId: string
  question?: string
  deckTheme: string
  cards: unknown
}

export async function saveReading(input: SaveReadingInput) {
  const session = await getSession()
  if (!session?.user) return { ok: false as const, error: 'sign-in-required' }
  const userId = session.user.id

  const tier = await getUserTier(userId)
  if (tier.historyLimit !== null) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(savedReading)
      .where(eq(savedReading.userId, userId))
    if (value >= tier.historyLimit) {
      return { ok: false as const, error: 'history-limit', limit: tier.historyLimit }
    }
  }

  await db.insert(savedReading).values({
    id: crypto.randomUUID(),
    userId,
    spreadId: input.spreadId,
    question: input.question ?? null,
    deckTheme: input.deckTheme,
    cards: input.cards as never,
    createdAt: new Date(),
  })
  revalidatePath('/account')
  return { ok: true as const }
}

export async function getSavedReadings() {
  const session = await getSession()
  if (!session?.user) return []
  return db
    .select()
    .from(savedReading)
    .where(eq(savedReading.userId, session.user.id))
    .orderBy(desc(savedReading.createdAt))
}

export async function deleteSavedReading(id: string) {
  const session = await getSession()
  if (!session?.user) return { ok: false as const }
  await db
    .delete(savedReading)
    .where(and(eq(savedReading.id, id), eq(savedReading.userId, session.user.id)))
  revalidatePath('/account')
  return { ok: true as const }
}
