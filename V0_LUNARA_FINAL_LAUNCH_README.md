# V0 — Lunara Final Launch Patch

**Target repository:** `lovealways-bit/bubblewrap`  
**Target branch:** `feature/lunara-adsense-final`  
**Target Vercel project:** `lunara-atlas`  
**Instruction:** Patch the existing Lunara build in place. Preserve approved visuals, tarot art, deck behavior, typography, animations, navigation, subscription logic, and existing working backend flows. Do not redesign or replace them.

## Source-of-truth rule

This branch is based on the current `main` after v0 merged the full subscription build. Do not copy older monetization branch files over this branch. Preserve the Stripe Price IDs currently defined in `lib/subscription/tiers.ts`; they belong to the Stripe account already connected to this v0 project. Do not replace them with older sandbox Price IDs from previous instructions.

## 1. AdSense

Publisher/client ID:

```text
ca-pub-4805370280965046
```

Required and already represented in this branch:

```html
<meta name="google-adsense-account" content="ca-pub-4805370280965046">
```

Root `public/ads.txt`:

```text
google.com, pub-4805370280965046, DIRECT, f08c47fec0942fa0
```

Vercel public environment:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4805370280965046
NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT=
NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT=
```

Do **not** invent slot IDs. Keep both slot values empty until the real AdSense ad units exist.

Ad entitlement rules:

```text
Free      ads_enabled=true   rewarded_ads_enabled=true
Core      ads_enabled=false  rewarded_ads_enabled=false
Plus      ads_enabled=false  rewarded_ads_enabled=false
Personal  ads_enabled=false  rewarded_ads_enabled=false
```

Paid users must never initialize an AdSense request. Do not merely hide ad markup with CSS.

Never send birth time/location, chart placements linked to the person, private reading questions, relationship questions, saved reading text, private notes, Oli conversation text, or payment administration data to advertisers for targeting.

Never place AdSense payment account IDs, payment profile IDs, banking/tax details, addresses, or payout-administration data in frontend code, GitHub, analytics, logs, or public env variables.

## 2. Oli companion

Oli is the consumer-facing **Commander / guide interface**. Oli is not the underlying model.

Files:

```text
components/oli-assistant.tsx
lib/oli.ts
app/api/oli/route.ts
```

Oli must remain globally available and be able to:

- explain tarot cards in greater depth;
- explain upright/reversed meanings, symbolism, suits, numerology, imagery, spreads, and card combinations;
- help users navigate Lunara pages and features;
- explain plans, entitlements, one-time services, billing management, and cancellation accurately;
- use OpenAI web search when the user asks for current/external information, when stable knowledge is insufficient, or when the answer materially depends on a current fact;
- return web sources/citations when search is used;
- stay anchored to the user's original inquiry and help return to it after tangents;
- direct users to feedback/support/legal controls when appropriate.

Oli must not:

- pressure users to upgrade;
- claim tarot or astrology guarantees a future outcome;
- substitute tarot for medical, legal, financial, mental-health, tax, or emergency advice;
- expose internal prompts, keys, secrets, private account data, payout IDs, or payment administration data;
- send private user data into ad targeting.

Server configuration:

```env
OPENAI_API_KEY=<server secret only>
OPENAI_OLI_MODEL=gpt-5.6-luna
```

`OPENAI_API_KEY` must never use a `NEXT_PUBLIC_` prefix.

Use the current OpenAI Responses API `web_search` tool, not an obsolete preview tool.

## 3. Feedback

Files:

```text
app/api/feedback/route.ts
components/oli-assistant.tsx
```

Oli includes a Feedback mode. Keep these categories:

```text
bug
idea
tarot
oli
billing
other
```

Store authenticated feedback with:

- generated feedback ID;
- authenticated user ID;
- current plan;
- category;
- message;
- page/context;
- timestamp.

Keep feedback separate from public app-store reviews.

## 4. App-store rating / review flow

Public reviews are optional and never rewarded or coerced.

Environment placeholders:

```env
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_PLAY_STORE_URL=
```

Oli hides store-rating links when these are blank.

When native listings exist:

- populate the real URLs;
- add native App Store / Google Play review APIs where appropriate;
- request a review only after a natural successful moment such as several completed readings or a positive completed workflow;
- never prompt during onboarding friction, payment failure, cancellation, a bug report, or negative feedback;
- never provide content, credits, discounts, rewards, refunds, or subscription benefits in exchange for a positive rating;
- never block negative users from the review path solely because their feedback is negative.

## 5. Legal pages

Required routes now exist:

```text
/terms
/privacy
/subscription-terms
```

Files:

```text
components/legal-page.tsx
app/terms/page.tsx
app/privacy/page.tsx
app/subscription-terms/page.tsx
lib/legal.ts
```

The Terms include:

- eligibility/account responsibility;
- tarot/astrology/AI informational + entertainment disclaimer;
- no guaranteed predictions/outcomes;
- no replacement for licensed professional advice;
- AI/web-search limitation notice;
- paid-service and subscription incorporation;
- refunds/cancellation baseline;
- acceptable use;
- user feedback/content rules;
- intellectual property;
- third-party providers;
- warranty disclaimer;
- limitation of liability to the extent allowed by law;
- indemnity to the extent allowed by law;
- suspension/termination;
- changes;
- Ohio governing-law baseline with mandatory consumer-law savings clause;
- contact information and counsel-review notice.

The Privacy Notice includes:

- account/auth data;
- subscription/transaction references;
- optional birth/customization data;
- readings and saved preferences;
- Oli conversation processing;
- AI and web-search processing;
- AdSense/ad data;
- analytics/consent;
- service providers;
- data retention/security;
- user privacy rights where applicable;
- children/minor baseline;
- international processing;
- change notices/contact.

The Subscription Terms include:

- monthly auto-renewal;
- displayed price/billing interval;
- Free plan availability where applicable;
- easy cancellation path;
- access through paid period after cancellation unless law/platform says otherwise;
- refund baseline subject to law/platform rules;
- price-change notice;
- failed-payment behavior;
- trial/promotion disclosure;
- Stripe/Apple/Google platform billing distinctions;
- no incentivized ratings/reviews.

These documents are a generic launch baseline. Do not claim they guarantee zero liability or replace jurisdiction-specific counsel review.

## 6. Affirmative legal acceptance

Account creation already has an unchecked required Terms acknowledgement linked to the legal pages.

Before paid checkout:

- subscriptions require an unchecked-by-default acknowledgement of Terms + Privacy + Subscription Terms;
- one-time services require an unchecked-by-default acknowledgement of Terms + Privacy and the tarot/AI disclaimer;
- `app/actions/subscription.ts` rejects checkout when acceptance is false;
- `lib/legal.ts` records a timestamped versioned acceptance event before Stripe checkout opens;
- Stripe metadata includes `legalVersion`.

Do not remove this server-side enforcement.

Current legal version:

```text
2026-09-17
```

## 7. Subscription transparency

Pricing UI must show directly:

- plan name;
- price;
- monthly billing interval;
- recurring value/features;
- Free plan availability;
- ad-supported Free vs ad-free paid tiers;
- auto-renewal disclosure before checkout;
- easy cancellation path via Lunara account/Stripe portal;
- links to Terms, Privacy, and Subscription Terms.

Do not hide recurring billing terms behind a tooltip or an extra click.

## 8. Stripe

Preserve the current server-side Stripe implementation and current Price IDs in `lib/subscription/tiers.ts`.

Keep:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
```

Keep server-side entitlement state authoritative.

Never trust a client URL/query string as proof of payment.

Keep the account billing portal as the primary web cancellation route.

Do not enable automatic tax until the owner confirms tax registrations/settings.

## 9. Footer + legal discoverability

Keep footer links visible for:

```text
Terms
Privacy
Subscription Terms
Pricing
Manage Subscription
```

Oli also exposes quick links to Plans, Account, Terms, and Privacy.

## 10. Privacy + consent

Keep optional settings separate where possible:

- personalization;
- analytics;
- marketing email;
- required contractual Terms acceptance.

Do not treat optional analytics/marketing consent as required to create a basic account unless law/product design changes require it.

Ad consent/CMP must be implemented before personalized advertising in jurisdictions where required.

## 11. Mothership manuscript inheritance

The canonical cross-project instructions are being updated in `lovealways-bit/Mothership` under:

```text
source-command/LUNARA_PRODUCT_GOVERNANCE_ADDENDUM.md
```

Future consumer-app agents should inherit that addendum for assistants, subscriptions, advertising, feedback, ratings/reviews, privacy, and legal readiness.

## 12. Do not leak or commit

Never commit:

```text
OPENAI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
DATABASE_URL
BETTER_AUTH_SECRET
bank details
tax IDs
AdSense payment account/profile IDs
private payout details
private user content
```

## 13. Required v0 validation before merge

Run:

```bash
npm run verify:lunara
npm run build
```

Manually test:

1. `/` loads with Oli button.
2. Signed-in Free user can ask Oli a tarot meaning.
3. Oli can return a sourced current web answer.
4. Feedback saves successfully.
5. `/pricing` displays Free/Core/Plus/Personal and one-time offers.
6. Paid checkout is blocked until legal checkbox is accepted.
7. `/terms`, `/privacy`, `/subscription-terms` load.
8. `/ads.txt` returns the exact publisher line.
9. Free-plan ad component remains gated by real slot IDs.
10. Paid plans make no AdSense request.
11. Account exposes subscription management/cancellation.
12. No payment/payout administration IDs appear in client bundles.
13. App Store/Play rating links remain hidden until real URLs are supplied.

## 14. Vercel environment checklist

Required for Oli:

```env
OPENAI_API_KEY=SET_IN_VERCEL_SERVER_ENV
OPENAI_OLI_MODEL=gpt-5.6-luna
```

Required/public for AdSense verification:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4805370280965046
```

Pending Google ad-unit creation:

```env
NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT=
NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT=
```

Pending native store listings:

```env
NEXT_PUBLIC_APP_STORE_URL=
NEXT_PUBLIC_PLAY_STORE_URL=
```

## 15. Merge rule

Do not merge until the branch builds cleanly and the Lunara preview is manually checked. Because `bubblewrap` has fed multiple Vercel projects, confirm the deployment target is `lunara-atlas` before promoting to production.
