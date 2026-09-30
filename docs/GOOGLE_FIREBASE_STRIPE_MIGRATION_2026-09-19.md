# Lunara Google / Firebase + Stripe Migration Runbook

**Date:** 2026-09-19  
**Status:** isolated migration branch; production behavior remains unchanged until explicit cutover  
**Google/Firebase target:** `synchpathways-30f11`

## Purpose

Move Lunara toward the owner's Google/Firebase control plane without redesigning the approved UI and without breaking the current production deployment.

Target:

`Firebase Authentication -> stable Firebase UID -> Google-hosted PostgreSQL/Cloud SQL app data -> Stripe customer/subscription -> server entitlement`

Stripe remains the web billing provider. Firebase becomes the canonical application identity provider after preview verification and owner-approved cutover.

## Current source reality

Lunara currently uses:
- Better Auth for email/password;
- PostgreSQL through `DATABASE_URL`;
- Drizzle ORM;
- server-side Stripe Checkout;
- a signed Stripe webhook route;
- server-side subscription entitlements.

The repository also contains hard-coded Stripe test Price IDs from a different Stripe test account than the owner-connected `AllPath Edu. sandbox`. This branch begins the consolidation by making Stripe Price IDs environment-resolvable while retaining the existing IDs as safe fallbacks. Merely changing Price IDs is insufficient: `STRIPE_SECRET_KEY` and Price IDs must belong to the same Stripe account.

## Google target configuration

Public Firebase client configuration, when the Firebase project is connected:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=synchpathways-30f11`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Server configuration should use Application Default Credentials / workload identity on Google infrastructure where possible. If a transition runtime requires explicit Firebase Admin credentials, keep them only in encrypted deployment secret storage.

Database:
- keep Drizzle/PostgreSQL semantics;
- point `DATABASE_URL` to the approved Google Cloud SQL PostgreSQL target after schema/data migration;
- do not force all relational application data into Firestore.

## Canonical Stripe price variables

Price IDs are public identifiers, not secret keys. They are now designed to be resolved by environment so the application can move between Stripe sandbox/live accounts without source edits.

- `NEXT_PUBLIC_STRIPE_PRICE_CORE`
- `NEXT_PUBLIC_STRIPE_PRICE_PLUS`
- `NEXT_PUBLIC_STRIPE_PRICE_PERSONAL`
- `NEXT_PUBLIC_STRIPE_PRICE_BIRTH_CHART`
- `NEXT_PUBLIC_STRIPE_PRICE_PERSONAL_READING`
- `NEXT_PUBLIC_STRIPE_PRICE_CUSTOM_DECK`

The owner-connected AllPath Edu. sandbox values observed on 2026-09-19 are:

- Core: `price_1UGj0UQA3HJlweQS4xaEGlPW`
- Plus: `price_1UGj0jQA3HJlweQSdt9UpmYa`
- Personal: `price_1UGj0pQA3HJlweQSJ5aZz4es`
- Birth Chart: `price_1UGj0xQA3HJlweQS81G8Vnso`
- Personal Reading: `price_1UGj16QA3HJlweQSTxXFToCW`

The connected AllPath sandbox did not contain the current $5 custom-deck Price at inspection time. Do not invent one. Preserve the current source fallback until a canonical Stripe product/price is created or intentionally retired.

## Authentication migration

### Better Auth -> Firebase

Do not migrate users from assumptions. The current Better Auth deployment database must first be inspected for:
- actual user count;
- account/provider rows;
- actual password-hash encoding;
- duplicate/normalized emails;
- active sessions;
- test/demo accounts.

Better Auth documents scrypt as its default password hashing algorithm, but the deployed records/configuration are the authority. Firebase supports STANDARD_SCRYPT imports when the source parameters are known. If the exact parameters cannot be verified, use a controlled password-reset migration rather than corrupting credentials.

Preserve the current application user ID as Firebase UID where Firebase constraints permit. This avoids rewriting every app-owned `userId` relationship.

### Supabase population

The separately inspected Supabase project `lygnaijgkomjkfdoixei` contains 16 confirmed email users whose password hashes are bcrypt-family. Firebase supports BCRYPT bulk imports. These accounts must not be silently merged into Lunara. They are a separate source population until an identity crosswalk proves which product each account belongs to.

### Collision rule

Email equality alone is not enough to merge two historical identities. Hold collisions for review with:
- source system;
- source UID;
- normalized email;
- created/last-seen timestamps where available;
- product memberships/roles;
- entitlement references.

## Firebase web session design

Use Firebase's documented server-session pattern:
1. client signs in through Firebase Auth;
2. client obtains an ID token;
3. ID token is POSTed to a same-origin session endpoint with CSRF protection;
4. Firebase Admin creates an HttpOnly secure session cookie;
5. server-side authorization verifies the session cookie;
6. client-side Firebase persistence is minimized when server cookies are authoritative.

Do not replace the current Better Auth runtime until the Firebase SDK/Admin dependencies are added with a lockfile-consistent build and preview authentication passes.

## Stripe identity binding

Every authenticated checkout created after cutover must bind:
- Firebase UID -> Stripe customer metadata `firebase_uid`;
- Checkout Session `client_reference_id` -> Firebase UID;
- Checkout/subscription metadata -> `firebase_uid`, app key, tier/offer.

Email may be copied to Stripe for receipts/customer convenience, but it is not the durable join key.

The webhook remains authoritative for payment state. It must verify Stripe signatures and update the server-side entitlement record idempotently.

## Required webhook events

At minimum:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- successful one-time payment events used for fulfillment.

Cancellation must preserve already-paid access through period end unless a later approved rule says otherwise.

## Cutover sequence

1. Configure Firebase project `synchpathways-30f11` and approved domains.
2. Provision Google PostgreSQL target and migrate a copy of current app schema/data.
3. Add Firebase client/Admin dependencies with a regenerated lockfile.
4. Implement Firebase session-cookie adapter while preserving the existing `getSession()/getUserId()` server contract.
5. Rehearse Better Auth user migration with test accounts.
6. Point sandbox Stripe secret + all price variables to one canonical sandbox account.
7. Create canonical sandbox webhook and billing portal.
8. Run end-to-end preview: sign-up, sign-in, sign-out, checkout, webhook, entitlement, portal, cancellation, payment failure.
9. Compare data and UI with production.
10. Owner approves production cutover.
11. Move live Stripe only after live Products/Prices/webhook/portal are verified.
12. Keep rollback sources until retention/rollback window closes.

## Current blocker

This ChatGPT session does not expose Firebase/Google Cloud project-administration tools. It can prepare GitHub source/config and inspect connected Google Drive, Stripe, Supabase, Vercel, and GitHub, but cannot enable providers, create Cloud SQL/Firestore resources, set Google Secret Manager values, or create the App Hosting backend.

No Firebase credential should be invented or pasted into source to bypass that boundary.
