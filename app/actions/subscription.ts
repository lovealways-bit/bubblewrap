'use server'

import { db } from '@/lib/db'
import { subscription, customDeck } from '@/lib/db/schema'
import { getSession, getUserId } from '@/lib/session'
import { stripe } from '@/lib/stripe'
import { getUserTier } from '@/lib/subscription/entitlements'
import {
  ONE_TIME_OFFERS,
  TIERS,
  CUSTOM_DECK_UNLOCK_PRICE_ID,
  type DeliveryPreference,
  type OneTimeOfferId,
  type TierId,
} from '@/lib/subscription/tiers'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

function origin(h: Headers) {
  return (
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    h.get('origin') ??
    process.env.V0_RUNTIME_URL ??
    'http://localhost:3000'
  )
}

export async function getCurrentTier() {
  const session = await getSession()
  if (!session?.user) return null
  const tier = await getUserTier(session.user.id)
  return tier.id
}

async function getOrCreateStripeCustomer(userId: string, email: string | null | undefined) {
  const existing = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.updatedAt))
    .limit(1)

  const customerId = existing[0]?.stripeCustomerId
  if (customerId) return customerId

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  })
  return customer.id
}

// Creates a Stripe Checkout Session for a paid membership tier and returns its URL.
export async function createCheckout(tierId: Exclude<TierId, 'free'>) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  const userId = session.user.id

  const priceId = TIERS[tierId].stripePriceId
  if (!priceId) {
    throw new Error(`Missing Stripe price for the ${tierId} plan.`)
  }

  const h = await headers()
  const base = origin(h)
  const customerId = await getOrCreateStripeCustomer(userId, session.user.email)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/success?type=membership&tier=${tierId}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    metadata: { userId, tier: tierId },
    subscription_data: { metadata: { userId, tier: tierId } },
  })

  return checkout.url
}

// Creates a one-time Checkout Session for the Birth Chart or Personal Reading
// offer. Personal Reading requires a delivery preference collected in-app
// (never inside Stripe checkout).
export async function createOneTimeCheckout(
  offerId: OneTimeOfferId,
  deliveryPreference?: DeliveryPreference,
) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  const userId = session.user.id
  const offer = ONE_TIME_OFFERS[offerId]

  if (offer.requiresDeliveryPreference && !deliveryPreference) {
    throw new Error('Please choose how you would like your reading delivered.')
  }

  const h = await headers()
  const base = origin(h)
  const customerId = await getOrCreateStripeCustomer(userId, session.user.email)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: offer.stripePriceId, quantity: 1 }],
    success_url: `${base}/success?type=offer&offer=${offerId}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    metadata: {
      userId,
      offer: offerId,
      ...(deliveryPreference ? { deliveryPreference } : {}),
    },
  })

  return checkout.url
}

// Creates a one-time $5 Checkout Session that unlocks the full art for one
// specific custom deck. Ownership is verified server-side and the deckId is
// carried in metadata so the webhook can unlock exactly that deck. Callers
// must confirm the deck is not already unlocked and that the member is not
// entitled for free before invoking this.
export async function createDeckUnlockCheckout(deckId: string) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  const userId = session.user.id

  const rows = await db
    .select({ id: customDeck.id, status: customDeck.status })
    .from(customDeck)
    .where(and(eq(customDeck.id, deckId), eq(customDeck.userId, userId)))
    .limit(1)
  if (!rows[0]) throw new Error('Deck not found.')

  const h = await headers()
  const base = origin(h)
  const customerId = await getOrCreateStripeCustomer(userId, session.user.email)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: CUSTOM_DECK_UNLOCK_PRICE_ID, quantity: 1 }],
    success_url: `${base}/success?type=offer&offer=customDeck&deck=${deckId}`,
    cancel_url: `${base}/deck-designer?checkout=cancelled`,
    // idempotent metadata so a webhook retry cannot double-unlock or confuse
    // which deck was paid for.
    metadata: { userId, offer: 'customDeck', deckId },
    payment_intent_data: { metadata: { userId, offer: 'customDeck', deckId } },
  })

  return checkout.url
}

// Opens the Stripe billing portal so members can manage or cancel.
export async function createBillingPortal() {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.updatedAt))
    .limit(1)

  const customerId = rows[0]?.stripeCustomerId
  if (!customerId) throw new Error('No billing account yet.')

  const h = await headers()
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin(h)}/account`,
  })
  return portal.url
}

// Cancel-safe helper used by the webhook to upsert the tier for a user.
export async function upsertSubscriptionRecord(params: {
  userId: string
  tier: TierId
  status: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  currentPeriodEnd?: Date
}) {
  const existing = await db
    .select()
    .from(subscription)
    .where(and(eq(subscription.userId, params.userId)))
    .orderBy(desc(subscription.updatedAt))
    .limit(1)

  const now = new Date()
  if (existing[0]) {
    await db
      .update(subscription)
      .set({
        tier: params.tier,
        status: params.status,
        stripeCustomerId: params.stripeCustomerId ?? existing[0].stripeCustomerId,
        stripeSubscriptionId: params.stripeSubscriptionId ?? existing[0].stripeSubscriptionId,
        stripePriceId: params.stripePriceId ?? existing[0].stripePriceId,
        currentPeriodEnd: params.currentPeriodEnd ?? existing[0].currentPeriodEnd,
        updatedAt: now,
      })
      .where(eq(subscription.id, existing[0].id))
  } else {
    await db.insert(subscription).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      tier: params.tier,
      status: params.status,
      stripeCustomerId: params.stripeCustomerId,
      stripeSubscriptionId: params.stripeSubscriptionId,
      stripePriceId: params.stripePriceId,
      currentPeriodEnd: params.currentPeriodEnd,
      createdAt: now,
      updatedAt: now,
    })
  }
}
