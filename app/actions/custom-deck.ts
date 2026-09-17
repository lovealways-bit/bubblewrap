'use server'

import { db } from '@/lib/db'
import { customDeck } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { createDeckUnlockCheckout } from '@/app/actions/subscription'
import {
  generateDeckPreview,
  generateDeckCards,
  FULL_DECK_CARDS,
  FULL_DECK_SIZE,
  type PreviewStyle,
  type GeneratedCard,
} from '@/lib/deck/preview'
import { del } from '@vercel/blob'
import { desc, eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// How many full-deck cards to paint per batch. Small enough that each server
// action stays well within the request budget, big enough to feel like
// progress.
const FULL_BATCH_SIZE = 6

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

// The free teaser: anyone signed in can paint a 4-card preview of a deck.
// Unlocking the full 78-card set is a separate, paid ($5) or entitled step.
export async function createCustomDeckPreview(input: CreateDeckInput) {
  const userId = await getUserId()

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

// Unlocks the full deck. Plus & Personal members unlock instantly for free;
// everyone else is sent to a one-time $5 Stripe checkout for this deck.
export async function unlockDeck(deckId: string) {
  const userId = await getUserId()

  const rows = await db
    .select()
    .from(customDeck)
    .where(and(eq(customDeck.id, deckId), eq(customDeck.userId, userId)))
    .limit(1)
  const deck = rows[0]
  if (!deck) return { ok: false as const, error: 'Deck not found.' }

  if (deck.status === 'unlocked' || deck.status === 'complete') {
    return { ok: true as const, unlocked: true as const }
  }

  const tier = await getUserTier(userId)
  if (tier.customDecks) {
    await db
      .update(customDeck)
      .set({ status: 'unlocked', updatedAt: new Date() })
      .where(eq(customDeck.id, deckId))
    revalidatePath('/deck-designer')
    return { ok: true as const, unlocked: true as const }
  }

  try {
    const url = await createDeckUnlockCheckout(deckId)
    if (!url) {
      return { ok: false as const, error: 'Checkout is not available right now.' }
    }
    return { ok: true as const, checkoutUrl: url }
  } catch (err) {
    console.error('[v0] deck unlock checkout failed:', err)
    return { ok: false as const, error: 'Could not start checkout. Please try again.' }
  }
}

// Paints the next batch of full-deck cards for an unlocked deck. Idempotent
// and resumable: it only generates cards not already stored, and marks the
// deck 'complete' once all 78 are done.
export async function generateFullDeckBatch(deckId: string) {
  const userId = await getUserId()

  const rows = await db
    .select()
    .from(customDeck)
    .where(and(eq(customDeck.id, deckId), eq(customDeck.userId, userId)))
    .limit(1)
  const deck = rows[0]
  if (!deck) return { ok: false as const, error: 'Deck not found.' }

  if (deck.status !== 'unlocked' && deck.status !== 'complete') {
    return { ok: false as const, error: 'unlock-required' }
  }

  const done = Array.isArray(deck.fullCardArt)
    ? (deck.fullCardArt as GeneratedCard[])
    : []
  const doneIds = new Set(done.map((c) => c.cardId))
  const remaining = FULL_DECK_CARDS.filter((c) => !doneIds.has(c.id))

  if (remaining.length === 0) {
    if (deck.status !== 'complete') {
      await db
        .update(customDeck)
        .set({ status: 'complete', updatedAt: new Date() })
        .where(eq(customDeck.id, deckId))
      revalidatePath('/deck-designer')
    }
    return { ok: true as const, generated: 0, total: FULL_DECK_SIZE, complete: true as const }
  }

  const batch = remaining.slice(0, FULL_BATCH_SIZE)
  const style: PreviewStyle = {
    name: deck.name,
    stylePrompt: deck.stylePrompt ?? '',
    palette: Array.isArray(deck.palette) ? (deck.palette as string[]) : [],
    borderStyle: deck.borderStyle ?? '',
  }

  let painted: GeneratedCard[]
  try {
    painted = await generateDeckCards(deckId, style, batch)
  } catch (err) {
    console.error('[v0] full deck batch generation failed:', err)
    return {
      ok: false as const,
      error: 'The art studio is busy right now. Please try again in a moment.',
    }
  }

  const merged = [...done, ...painted]
  const complete = merged.length >= FULL_DECK_SIZE

  await db
    .update(customDeck)
    .set({
      fullCardArt: merged as never,
      status: complete ? 'complete' : 'unlocked',
      updatedAt: new Date(),
    })
    .where(eq(customDeck.id, deckId))

  revalidatePath('/deck-designer')
  return {
    ok: true as const,
    generated: painted.length,
    total: FULL_DECK_SIZE,
    complete,
  }
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

  // Best-effort cleanup of stored art (preview + any full-deck cards).
  const art = [
    ...(Array.isArray(deck.cardArt) ? (deck.cardArt as Array<{ pathname?: string }>) : []),
    ...(Array.isArray(deck.fullCardArt) ? (deck.fullCardArt as Array<{ pathname?: string }>) : []),
  ]
  await Promise.allSettled(
    art.filter((c) => c.pathname).map((c) => del(c.pathname as string)),
  )

  await db.delete(customDeck).where(eq(customDeck.id, deckId))
  revalidatePath('/deck-designer')
  return { ok: true as const }
}
