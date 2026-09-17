import { stripe } from '@/lib/stripe'
import { upsertSubscriptionRecord } from '@/app/actions/subscription'
import type { TierId } from '@/lib/subscription/tiers'
import type Stripe from 'stripe'

// Stripe delivers raw body; do not let Next parse it.
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    if (!secret || !sig) {
      // Without a configured signing secret we cannot trust the payload.
      return new Response('Webhook secret not configured', { status: 400 })
    }
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.log('[v0] Stripe webhook signature verification failed:', (err as Error).message)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session

        // Membership subscription checkout.
        if (s.mode === 'subscription' && s.subscription) {
          const userId = s.metadata?.userId
          const tier = (s.metadata?.tier as TierId) ?? 'core'
          if (userId) {
            const sub = await stripe.subscriptions.retrieve(s.subscription as string)
            await upsertSubscriptionRecord({
              userId,
              tier,
              status: sub.status,
              stripeCustomerId: s.customer as string,
              stripeSubscriptionId: sub.id,
              stripePriceId: sub.items.data[0]?.price.id,
              currentPeriodEnd: sub.items.data[0]?.current_period_end
                ? new Date(sub.items.data[0].current_period_end * 1000)
                : undefined,
            })
          }
          break
        }

        // One-time offer checkout (Birth Chart / Personal Reading). These do
        // not change the member's tier; fulfillment happens in-app.
        if (s.mode === 'payment') {
          console.log(
            '[v0] One-time offer purchased:',
            s.metadata?.offer,
            'user:',
            s.metadata?.userId,
            'delivery:',
            s.metadata?.deliveryPreference,
          )
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        const tier = (sub.metadata?.tier as TierId) ?? 'core'
        if (userId) {
          const cancelled = event.type === 'customer.subscription.deleted'
          await upsertSubscriptionRecord({
            userId,
            // Cancellation drops to free immediately here; to retain access
            // through the paid period instead, gate this on
            // sub.cancel_at_period_end and current_period_end.
            tier: cancelled ? 'free' : tier,
            status: cancelled ? 'canceled' : sub.status,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            stripePriceId: sub.items.data[0]?.price.id,
            currentPeriodEnd: sub.items.data[0]?.current_period_end
              ? new Date(sub.items.data[0].current_period_end * 1000)
              : undefined,
          })
        }
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('[v0] Invoice paid for customer:', invoice.customer)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          typeof invoice.parent?.subscription_details?.subscription === 'string'
            ? invoice.parent.subscription_details.subscription
            : undefined
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.userId
          if (userId) {
            await upsertSubscriptionRecord({
              userId,
              tier: (sub.metadata?.tier as TierId) ?? 'core',
              status: sub.status,
              stripeCustomerId: sub.customer as string,
              stripeSubscriptionId: sub.id,
            })
          }
        }
        console.log('[v0] Invoice payment failed for customer:', invoice.customer)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.log('[v0] Stripe webhook handler error:', (err as Error).message)
    return new Response('Handler error', { status: 500 })
  }

  return new Response('ok', { status: 200 })
}
