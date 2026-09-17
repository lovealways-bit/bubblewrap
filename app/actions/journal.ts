'use server'

import { db } from '@/lib/db'
import { journalEntry } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { getUserTier, canUseJournal } from '@/lib/subscription/entitlements'
import { getMoonPhase } from '@/lib/celestial/moon'
import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const MOODS = ['radiant', 'calm', 'tender', 'restless', 'shadowed', 'hopeful'] as const
export type Mood = (typeof MOODS)[number]

export interface JournalInput {
  title?: string
  body: string
  mood?: string
  readingId?: string
}

export async function listJournalEntries() {
  const userId = await getUserId()
  return db
    .select()
    .from(journalEntry)
    .where(eq(journalEntry.userId, userId))
    .orderBy(desc(journalEntry.createdAt))
}

export async function createJournalEntry(input: JournalInput) {
  const userId = await getUserId()

  const tier = await getUserTier(userId)
  if (!canUseJournal(tier)) {
    return { ok: false as const, error: 'upgrade-required' }
  }

  const body = input.body?.trim()
  if (!body) {
    return { ok: false as const, error: 'Write something before saving.' }
  }
  if (body.length > 20_000) {
    return { ok: false as const, error: 'Entry is too long.' }
  }

  const mood = MOODS.includes(input.mood as Mood) ? input.mood : null
  const now = new Date()
  const moon = getMoonPhase(now)

  await db.insert(journalEntry).values({
    id: crypto.randomUUID(),
    userId,
    title: input.title?.trim()?.slice(0, 200) || null,
    body,
    mood,
    moonPhase: moon.name,
    moonIllumination: Math.round(moon.illumination * 100),
    readingId: input.readingId?.trim() || null,
    entryDate: now.toISOString().slice(0, 10),
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/journal')
  return { ok: true as const }
}

export async function updateJournalEntry(id: string, input: JournalInput) {
  const userId = await getUserId()

  const body = input.body?.trim()
  if (!body) {
    return { ok: false as const, error: 'Write something before saving.' }
  }

  const mood = MOODS.includes(input.mood as Mood) ? input.mood : null

  const rows = await db
    .update(journalEntry)
    .set({
      title: input.title?.trim()?.slice(0, 200) || null,
      body: body.slice(0, 20_000),
      mood,
      updatedAt: new Date(),
    })
    .where(and(eq(journalEntry.id, id), eq(journalEntry.userId, userId)))
    .returning({ id: journalEntry.id })

  if (rows.length === 0) {
    return { ok: false as const, error: 'Entry not found.' }
  }

  revalidatePath('/journal')
  return { ok: true as const }
}

export async function deleteJournalEntry(id: string) {
  const userId = await getUserId()
  await db
    .delete(journalEntry)
    .where(and(eq(journalEntry.id, id), eq(journalEntry.userId, userId)))
  revalidatePath('/journal')
  return { ok: true as const }
}
