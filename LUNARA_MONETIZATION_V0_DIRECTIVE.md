# Lunara Monetization v0 Directive

## Scope lock
Patch the existing Lunara experience in place. Preserve the current visual system, card/deck interactions, typography, motion, and navigation unless an explicit monetization requirement below requires a new element. Do not redesign the app.

## Stripe status
Stripe is currently connected only to **AllPath Edu. sandbox**. Everything below is TEST MODE until the owner connects a live Stripe account.

### Monthly memberships
| Plan | Price | Stripe Price ID | Test checkout | Ads |
| --- | ---: | --- | --- | --- |
| Free | $0 | `price_1UGj1HQA3HJlweQSju50hYZK` | none | ON |
| Core | $9.99/mo | `price_1UGj0UQA3HJlweQS4xaEGlPW` | `https://buy.stripe.com/test_28EcN75T3cFH0cJf5IgnK00` | OFF |
| Plus | $19.99/mo | `price_1UGj0jQA3HJlweQSdt9UpmYa` | `https://buy.stripe.com/test_5kQ28t1CN8pr6B74r4gnK01` | OFF |
| Personal | $49.99/mo | `price_1UGj0pQA3HJlweQSJ5aZz4es` | `https://buy.stripe.com/test_7sY6oJ5T349b7Fb3n0gnK02` | OFF |

### One-time offers
| Offer | Price | Stripe Price ID | Test checkout |
| --- | ---: | --- | --- |
| Birth Chart | $33.33 | `price_1UGj0xQA3HJlweQS81G8Vnso` | `https://book.stripe.com/test_eVq6oJ2GR5df9Nj2iWgnK03` |
| Personal Reading | $49.99 | `price_1UGj16QA3HJlweQSTxXFToCW` | `https://book.stripe.com/test_6oUcN74OZ6hj0cJ7DggnK04` |

Personal Reading checkout already collects one required delivery preference: Zoom, Phone, Text, Email, Social media, or In app.

## Required app behavior
1. Add a Pricing / Membership screen using `app/pricing/page.tsx` as the source implementation.
2. Keep Free genuinely usable. Free is ad-supported and may receive optional rewarded-ad access to selected bonus content.
3. Core, Plus, and Personal are completely ad-free.
4. Never render an ad slot to a paid user. Do not merely hide it with CSS. Do not initialize the ad request for that slot.
5. Do not send birth time, birth location, natal placements, relationship questions, reading history, private prompts, or private conversation content to advertising providers.
6. Birth details are collected inside Lunara after successful purchase, not inside Stripe checkout.
7. Keep all secret Stripe keys server-side and out of Git. The test pricing page currently uses public Stripe Payment Links and therefore requires no secret key.

## Entitlement model
Use the authenticated user's durable record as source of truth. Minimum fields:

```ts
plan: 'free' | 'core' | 'plus' | 'personal'
ads_enabled: boolean
rewarded_ads_enabled: boolean
stripe_customer_id?: string
stripe_subscription_id?: string
subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
current_period_end?: string
```

Rules:
- free => `ads_enabled=true`, `rewarded_ads_enabled=true`
- core/plus/personal => `ads_enabled=false`, `rewarded_ads_enabled=false`
- successful paid subscription => update entitlement server-side
- cancellation => retain paid entitlement through paid period, then fall back to free
- payment failure => follow Stripe subscription status; do not immediately destroy access unless the configured billing state requires it

## Stripe webhook implementation v0 must add before live launch
Create a server-only webhook endpoint and verify Stripe signatures. Handle at minimum:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Use Stripe subscription/customer metadata or the signed-in account mapping to assign the correct Lunara plan. Never trust a client-side `?plan=personal` value as proof of payment.

## Free-plan web ads
Use AdSense for the web/PWA. `components/adsense-slot.tsx` is a guarded ad component. v0 should place it only behind the free entitlement.

Suggested placements:
- one in-feed/native-feeling slot after approximately 5 to 7 meaningful content cards, never between every interaction
- one restrained lower-page/banner slot on selected free screens
- exclude checkout, account/settings, privacy/terms, payment success, personal-reading intake, and sensitive private-reading screens

Do not create fake publisher IDs or ad slot IDs.

### Environment variables
Add in Vercel only after the AdSense account/site is approved:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT=XXXXXXXXXX
```

## Rewarded access on web
Use **AdSense Offerwall**, configured in AdSense Privacy & messaging. Do not hand-build a fake rewarded-video flow. Use Offerwall to let a Free visitor voluntarily view a rewarded ad for access to selected bonus content. Keep the reward non-transferable and inside Lunara.

Recommended first reward:
- access to one additional bonus insight / bonus reading content unit

The UI may display a soft entry point such as `Unlock a bonus insight`, but the Google Offerwall itself controls the rewarded-ad fulfillment when configured.

## AdSense launch checklist
Owner actions required outside v0:
1. Create/connect the AdSense publisher account.
2. Add the Lunara production domain under AdSense Sites.
3. Complete ownership verification and site review.
4. Copy the real `ca-pub-...` publisher ID and ad slot IDs into Vercel environment variables.
5. Publish an `ads.txt` file at the root using the exact line provided by AdSense, commonly shaped like `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
6. Configure Google Privacy & messaging / certified CMP coverage for regions where required.
7. Create and publish the Offerwall rewarded-ad message if rewarded access is desired.

## Privacy and consent UI
Add links to Privacy, Terms, Ad Choices / privacy choices where applicable. Consent status must be respected before personalized advertising where required. Do not use private Lunara profile data for ad targeting.

## Success state
Add `/success` or an equivalent post-checkout screen that:
- confirms purchase without exposing sensitive information
- refreshes entitlement from the server
- routes subscription users back into Lunara
- routes Birth Chart buyers to secure in-app birth-data intake
- routes Personal Reading buyers to their booking/delivery next step

## Launch guards
- TEST Stripe links must never be labeled live.
- Replace all TEST links and Price IDs with live equivalents only after the owner connects a live Stripe account and the live catalog is created.
- Do not enable Stripe automatic tax until registrations are confirmed.
- Do not ship placeholder AdSense publisher or slot IDs.
- Do not merge this monetization branch into any other Vercel project that shares this repository without confirming the target project first.
