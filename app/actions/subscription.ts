'use server'

import { db } from '@/lib/db'
import { subscription } from '@/lib/db/schema'
import { getSession, getUserId } from '@/lib/session'
import { stripe } from '@/lib/stripe'
import { getUserTier } from '@/lib/subscription/entitlements'
import { TIER_PRICE_ENV, type TierId } from '@/lib/subscription/tiers'
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

// Creates a Stripe Checkout Session for a paid tier and returns its URL.
export async function createCheckout(tierId: Exclude<TierId, 'free'>) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  const userId = session.user.id

  const priceId = process.env[TIER_PRICE_ENV[tierId]]
  if (!priceId) {
    throw new Error(
      `Missing Stripe price for the ${tierId} tier. Set ${TIER_PRICE_ENV[tierId]} in project env.`,
    )
  }

  const h = await headers()
  const base = origin(h)

  // Reuse an existing Stripe customer if we have one on record.
  const existing = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .orderBy(desc(subscription.updatedAt))
    .limit(1)

  let customerId = existing[0]?.stripeCustomerId ?? undefined
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId },
    })
    customerId = customer.id
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/account?checkout=success`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    metadata: { userId, tier: tierId },
    subscription_data: { metadata: { userId, tier: tierId } },
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
