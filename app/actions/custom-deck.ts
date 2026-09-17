'use server'

import { db } from '@/lib/db'
import { customDeck } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { generateDeckPreview, type PreviewStyle } from '@/lib/deck/preview'
import { del } from '@vercel/blob'
import { desc, eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export interface CreateDeckInput {
  name: string
  stylePrompt: string
  palette: string[]
  borderStyle: string
}

export async function listMyDecks() {
  const userId = await getUserId()
  return db
    .select()
    .from(customDeck)
    .where(eq(customDeck.userId, userId))
    .orderBy(desc(customDeck.updatedAt))
}

export async function createCustomDeckPreview(input: CreateDeckInput) {
  const userId = await getUserId()

  const tier = await getUserTier(userId)
  if (!tier.customDecks) {
    return { ok: false as const, error: 'upgrade-required' }
  }

  const name = input.name?.trim()
  if (!name) {
    return { ok: false as const, error: 'A deck name is required.' }
  }

  // Keep abuse in check: cap decks per account.
  const existing = await db
    .select({ id: customDeck.id })
    .from(customDeck)
    .where(eq(customDeck.userId, userId))
  if (existing.length >= 12) {
    return {
      ok: false as const,
      error: 'You have reached the maximum of 12 custom decks.',
    }
  }

  const deckId = crypto.randomUUID()
  const style: PreviewStyle = {
    name,
    stylePrompt: input.stylePrompt?.trim() ?? '',
    palette: Array.isArray(input.palette) ? input.palette.slice(0, 5) : [],
    borderStyle: input.borderStyle?.trim() ?? '',
  }

  let cardArt
  try {
    cardArt = await generateDeckPreview(deckId, style)
  } catch (err) {
    console.error('[v0] deck preview generation failed:', err)
    return {
      ok: false as const,
      error: 'The art studio is busy right now. Please try again in a moment.',
    }
  }

  const now = new Date()
  await db.insert(customDeck).values({
    id: deckId,
    userId,
    name,
    stylePrompt: style.stylePrompt,
    palette: style.palette as never,
    borderStyle: style.borderStyle,
    coverImageUrl: cardArt[0]?.pathname ?? null,
    cardArt: cardArt as never,
    status: 'preview',
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/deck-designer')
  return { ok: true as const, deckId }
}

export async function deleteCustomDeck(deckId: string) {
  const userId = await getUserId()

  const rows = await db
    .select()
    .from(customDeck)
    .where(and(eq(customDeck.id, deckId), eq(customDeck.userId, userId)))
    .limit(1)

  const deck = rows[0]
  if (!deck) {
    return { ok: false as const, error: 'Deck not found.' }
  }

  // Best-effort cleanup of stored art.
  const art = Array.isArray(deck.cardArt)
    ? (deck.cardArt as Array<{ pathname?: string }>)
    : []
  await Promise.allSettled(
    art.filter((c) => c.pathname).map((c) => del(c.pathname as string)),
  )

  await db.delete(customDeck).where(eq(customDeck.id, deckId))
  revalidatePath('/deck-designer')
  return { ok: true as const }
}
