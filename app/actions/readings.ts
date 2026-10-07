'use server'

import { db } from '@/lib/db'
import { savedReading } from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { and, count, desc, eq, like, notLike } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const RUNE_PREFIX = 'rune:'
const RUNE_THEME = '__runes__'

export interface SaveReadingInput {
  spreadId: string
  question?: string
  deckTheme: string
  cards: unknown
}

export interface SaveRuneReadingInput {
  spreadId: string
  question?: string
  cast: unknown
}

async function userOrNull() {
  const session = await getSession()
  return session?.user ?? null
}

async function historyLimitReached(userId: string) {
  const tier = await getUserTier(userId)
  if (tier.historyLimit === null) return null
  const [{ value }] = await db
    .select({ value: count() })
    .from(savedReading)
    .where(eq(savedReading.userId, userId))
  return value >= tier.historyLimit ? tier.historyLimit : null
}

function savedAt(value: Date | null | undefined) {
  return value instanceof Date ? value.getTime() : Date.now()
}

export async function saveReading(input: SaveReadingInput) {
  const user = await userOrNull()
  if (!user) return { ok: false as const, error: 'sign-in-required' as const }

  const limit = await historyLimitReached(user.id)
  if (limit !== null) return { ok: false as const, error: 'history-limit' as const, limit }

  const id = crypto.randomUUID()
  await db.insert(savedReading).values({
    id,
    userId: user.id,
    spreadId: input.spreadId,
    question: input.question ?? null,
    deckTheme: input.deckTheme,
    cards: input.cards as never,
    createdAt: new Date(),
  })
  revalidatePath('/account')
  return { ok: true as const, id }
}

export async function getSavedReadings() {
  const user = await userOrNull()
  if (!user) return []

  const rows = await db
    .select()
    .from(savedReading)
    .where(and(eq(savedReading.userId, user.id), notLike(savedReading.spreadId, `${RUNE_PREFIX}%`)))
    .orderBy(desc(savedReading.createdAt))

  return rows.map((row) => ({
    id: row.id,
    savedAt: savedAt(row.createdAt),
    spreadId: row.spreadId,
    question: row.question ?? '',
    deckTheme: row.deckTheme,
    cards: row.cards,
  }))
}

export async function deleteSavedReading(id: string) {
  const user = await userOrNull()
  if (!user) return { ok: false as const }
  await db
    .delete(savedReading)
    .where(
      and(
        eq(savedReading.id, id),
        eq(savedReading.userId, user.id),
        notLike(savedReading.spreadId, `${RUNE_PREFIX}%`),
      ),
    )
  revalidatePath('/account')
  return { ok: true as const }
}

export async function clearSavedReadings() {
  const user = await userOrNull()
  if (!user) return { ok: false as const }
  await db
    .delete(savedReading)
    .where(and(eq(savedReading.userId, user.id), notLike(savedReading.spreadId, `${RUNE_PREFIX}%`)))
  revalidatePath('/account')
  return { ok: true as const }
}

export async function saveRuneReading(input: SaveRuneReadingInput) {
  const user = await userOrNull()
  if (!user) return { ok: false as const, error: 'sign-in-required' as const }

  const limit = await historyLimitReached(user.id)
  if (limit !== null) return { ok: false as const, error: 'history-limit' as const, limit }

  const id = crypto.randomUUID()
  await db.insert(savedReading).values({
    id,
    userId: user.id,
    spreadId: `${RUNE_PREFIX}${input.spreadId}`,
    question: input.question ?? null,
    deckTheme: RUNE_THEME,
    cards: input.cast as never,
    createdAt: new Date(),
  })
  revalidatePath('/account')
  return { ok: true as const, id }
}

export async function getSavedRuneReadings() {
  const user = await userOrNull()
  if (!user) return []

  const rows = await db
    .select()
    .from(savedReading)
    .where(and(eq(savedReading.userId, user.id), like(savedReading.spreadId, `${RUNE_PREFIX}%`)))
    .orderBy(desc(savedReading.createdAt))

  return rows.map((row) => ({
    id: row.id,
    savedAt: savedAt(row.createdAt),
    spreadId: row.spreadId.slice(RUNE_PREFIX.length),
    question: row.question ?? '',
    cast: row.cards,
  }))
}

export async function deleteSavedRuneReading(id: string) {
  const user = await userOrNull()
  if (!user) return { ok: false as const }
  await db
    .delete(savedReading)
    .where(
      and(
        eq(savedReading.id, id),
        eq(savedReading.userId, user.id),
        like(savedReading.spreadId, `${RUNE_PREFIX}%`),
      ),
    )
  revalidatePath('/account')
  return { ok: true as const }
}

export async function clearSavedRuneReadings() {
  const user = await userOrNull()
  if (!user) return { ok: false as const }
  await db
    .delete(savedReading)
    .where(and(eq(savedReading.userId, user.id), like(savedReading.spreadId, `${RUNE_PREFIX}%`)))
  revalidatePath('/account')
  return { ok: true as const }
}

export async function getGrowthHistory() {
  const user = await userOrNull()
  if (!user) return { tarot: [], runes: [] }

  const rows = await db
    .select()
    .from(savedReading)
    .where(eq(savedReading.userId, user.id))
    .orderBy(desc(savedReading.createdAt))

  const tarot = rows
    .filter((row) => !row.spreadId.startsWith(RUNE_PREFIX))
    .map((row) => ({
      savedAt: savedAt(row.createdAt),
      question: row.question ?? '',
      cards: row.cards,
    }))

  const runes = rows
    .filter((row) => row.spreadId.startsWith(RUNE_PREFIX))
    .map((row) => ({
      savedAt: savedAt(row.createdAt),
      question: row.question ?? '',
      cast: row.cards,
    }))

  return { tarot, runes }
}
