# ALLPATH USER / ADMIN / DEVELOPER SURFACE CONTRACT

Updated: 2026-09-17
Authority: Oli Commander Manuscript addendum candidate

## Rule

Every participating AllPath / SynchPathways application and repository must distinguish customer-facing product behavior from internal administration and engineering behavior.

A hidden button is not access control. Internal routes, APIs, records, files, tools, prompts, logs, diagnostics, billing administration, design sources, and deployment controls must be protected server-side.

## Roles

### PUBLIC_USER
May use public product pages and explicitly public Oli help.

### SIGNED_IN_USER
May use the person's own account, subscription entitlements, saved work, consent settings, exports, and product features granted to that account.

### ADMIN
May access approved operational surfaces such as Commander Hub, Design Closet, capability state, customer support administration, approved source registries, and product configuration within assigned scope.

### DEVELOPER
May access developer diagnostics, provider configuration state, repository and deployment traces, implementation telemetry, raw capability checks, and engineering-only tooling. Developer access does not automatically grant founder approval authority or unrestricted customer-data access.

## Required separation

| Surface | User | Admin | Developer |
|---|---:|---:|---:|
| Public product UI | YES | YES | YES |
| User account and own data | OWN ONLY | SUPPORT-SCOPED | SUPPORT-SCOPED |
| Oli customer help | YES | YES | YES |
| Subscription purchase and user billing portal | OWN ONLY | SUPPORT-SCOPED | NO BY DEFAULT |
| Mothership Vault | NO | PERMISSIONED | PERMISSIONED |
| Manifesto / Living Blueprint administration | NO | PROPOSE ONLY unless founder | PROPOSE ONLY unless founder |
| Commander Log / Daily Debrief | NO | YES | YES |
| Design Closet | NO | YES | YES |
| Provider secrets or secret values | NO | NO | NO UI EXPOSURE |
| Provider configuration status | NO | LIMITED | YES |
| Raw system prompts and internal routing logic | NO | LIMITED | YES |
| Repository and deployment diagnostics | NO | LIMITED | YES |
| Production publish / rollback | NO | FOUNDER OR EXPLICIT ROLE | EXPLICIT ROLE ONLY |

## Route contract

Each app should declare which routes are:

- `PUBLIC`
- `SIGNED_IN`
- `ADMIN_ONLY`
- `DEVELOPER_ONLY`
- `FOUNDER_ONLY`

The server verifies the role on every protected request. Client navigation may hide inaccessible surfaces, but hiding navigation is only a presentation convenience.

## API contract

Every protected API endpoint must independently verify authentication and authorization. Never trust a client-supplied role, email, org id, tenant id, entitlement, or feature flag as authority.

Customer endpoints return only the minimum fields needed for the user-facing feature. Internal source paths, connector metadata, stack traces, environment names, secret names, prompt text, unpublished pricing, and private notes stay out of customer payloads unless specifically required and authorized.

## Design Closet contract

`/oli/design-closet` is admin-only. It contains approved visual source references, candidates, version history, target-app permissions, and rollback lineage. Customer apps receive only the approved runtime assets they need.

## Developer contract

`/oli/dev` is developer-only and requires both admin membership and explicit `DEVELOPER_EMAILS` configuration. Developer diagnostics are never linked in public customer navigation.

## Downstream repo rule

When Oli is integrated into another repository, that repository must either:

1. implement equivalent server-side role enforcement, or
2. omit the internal surface entirely until secure authentication and authorization exist.

Do not ship an unsecured admin or developer screen merely to satisfy a UI checklist.
