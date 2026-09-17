import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Surfaced at import time in server context so misconfig is obvious in logs.
  console.log('[v0] STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-08-26.dahlia',
})
