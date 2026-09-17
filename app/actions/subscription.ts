'use server'

import { db } from '@/lib/db'
import { subscription } from '@/lib/db/schema'
import { LEGAL_VERSION, recordLegalAcceptance } from '@/lib/legal'
import { getSession, getUserId } from '@/lib/session'
import { stripe } from '@/lib/stripe'
import { getUserTier } from '@/lib/subscription/entitlements'
import {
  ONE_TIME_OFFERS,
  TIERS,
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
// The legalAccepted flag comes from an unchecked-by-default user control on the pricing page.
export async function createCheckout(
  tierId: Exclude<TierId, 'free'>,
  legalAccepted = false,
) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  if (!legalAccepted) {
    throw new Error('Please accept the Terms, Privacy Notice, and Subscription Terms to continue.')
  }

  const userId = session.user.id
  const priceId = TIERS[tierId].stripePriceId
  if (!priceId) {
    throw new Error(`Missing Stripe price for the ${tierId} plan.`)
  }

  const h = await headers()
  const base = origin(h)
  const customerId = await getOrCreateStripeCustomer(userId, session.user.email)
  await recordLegalAcceptance(userId, `subscription:${tierId}`)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/success?type=membership&tier=${tierId}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    metadata: { userId, tier: tierId, legalVersion: LEGAL_VERSION },
    subscription_data: { metadata: { userId, tier: tierId, legalVersion: LEGAL_VERSION } },
    custom_text: {
      submit: {
        message:
          'This is a recurring monthly subscription that renews automatically until canceled. You may manage or cancel through your Lunara account. Access generally continues through the paid billing period, subject to applicable law and platform rules.',
      },
    },
  })

  return checkout.url
}

// Creates a one-time Checkout Session for the Birth Chart or Personal Reading offer.
export async function createOneTimeCheckout(
  offerId: OneTimeOfferId,
  deliveryPreference?: DeliveryPreference,
  legalAccepted = false,
) {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  if (!legalAccepted) {
    throw new Error('Please accept the Terms and Privacy Notice to continue.')
  }

  const userId = session.user.id
  const offer = ONE_TIME_OFFERS[offerId]

  if (offer.requiresDeliveryPreference && !deliveryPreference) {
    throw new Error('Please choose how you would like your reading delivered.')
  }

  const h = await headers()
  const base = origin(h)
  const customerId = await getOrCreateStripeCustomer(userId, session.user.email)
  await recordLegalAcceptance(userId, `one-time:${offerId}`)

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: offer.stripePriceId, quantity: 1 }],
    success_url: `${base}/success?type=offer&offer=${offerId}`,
    cancel_url: `${base}/pricing?checkout=cancelled`,
    metadata: {
      userId,
      offer: offerId,
      legalVersion: LEGAL_VERSION,
      ...(deliveryPreference ? { deliveryPreference } : {}),
    },
    custom_text: {
      submit: {
        message:
          'This is a one-time digital service. Tarot, astrology, and AI-generated content are for informational, reflective, and entertainment purposes and are not professional medical, legal, financial, or mental-health advice.',
      },
    },
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
