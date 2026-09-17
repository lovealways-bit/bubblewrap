# Oli Commander Training Hub

Branch: `oli-commander-training-hub-20260917`

Bubblewrap contains the reusable runtime layer for **Oli**, the governed companion and first-line customer guide used across participating AllPath / SynchPathways applications.

## Authority map

- **Mothership**: cross-agent Source Command, governance, provenance, permission, institutional memory.
- **Commander / SynchPathways Brain**: source-control and deployment discipline, verified handoffs, project registries.
- **Bubblewrap / Oli runtime**: executable app profiles, capability flags, prompt compiler, customer-facing dock, local routing, specialist stacks, provider adapter interface.
- **HEARTBEAT**: current verified runtime state.
- **App profile**: the narrow domain, permissions, design, support, navigation, and capability overlay for the active product.

Oli is a product and orchestration identity, not ownership of any third-party foundation model.

## Runtime surfaces

| Surface | Purpose |
|---|---|
| `commander/MANUSCRIPT.md` | Oli's canonical Bubblewrap behavior contract. |
| `commander/MANUSCRIPT_ADDENDUM_MUSIC_OLI_2026-09-17.md` | Music Oli capability and governance addendum candidate. |
| `commander/OLI_APP_REGISTRY.json` | Verified GitHub/Vercel discovery snapshot. |
| `commander/OLI_CAPABILITIES.json` | Capability state and dependency registry. |
| `commander/OLI_APP_BEHAVIOR_MATRIX.md` | Per-source behavior and unknown-state rules. |
| `commander/USER_DEV_SURFACE_CONTRACT.md` | Required user/admin/developer separation contract. |
| `commander/DEPLOYMENT_LINKAGE_ISSUES.md` | Known source/deployment linkage problems and safe interpretation rules. |
| `commander/HEARTBEAT.json` | Verified runtime readiness snapshot. |
| `lib/oli/registry.ts` | Resolves current app context and registered capabilities. |
| `lib/oli/system-prompt.ts` | Compiles app-aware Oli instructions for an approved model adapter. |
| `lib/oli/provider-adapter.ts` | Server-only plug-in contract for AI, search, embedding, and tool providers. |
| `lib/oli/command-router.ts` | Deterministic first-line local routing that works before a paid model is connected. |
| `lib/oli/music-tools.ts` | Music Oli tool, connector, subscription-cost, and production-rule registry. |
| `lib/oli/access.ts` | Shared customer/admin/developer access policy. |
| `lib/oli/rate-limit.ts` | Bounded rate limiting for Oli public runtime endpoints. |
| `/api/oli/context` | Sanitized app/capability context. |
| `/api/oli/health` | Runtime/capability self-check. |
| `/api/oli/command` | Customer-facing local command router. |
| `components/oli/oli-commander-dock.tsx` | Reusable Oli customer contact UI. |
| `/oli` | Admin-only training and Commander status screen. |
| `/oli/music` | Admin-only Music Oli connector, MIDI, production, cost, and rights console. |
| `/oli/design-closet` | Admin-only approved design source and version surface. |
| `/oli/dev` | Developer-only runtime diagnostics. |

## Hub continuity

The Oli Hub carries these permanent governed rooms:

- Mothership Vault
- Manifesto / Living Blueprint Scribe
- Commander Log / Daily Debrief
- Design Closet
- Source Intelligence / Permissions
- Oli Specialist Stacks

Every specialist mode returns meaningful outcomes to the same Commander history instead of creating a competing command center.

## Music Oli current stack

Music Oli is a specialist mode under the single Commander identity. Current tool records include OpenAI GPT-5.6 Luna, Midify, Background Music, Apple Music, Spotify, Moises, REAPER, Cakewalk Sonar, Ardour, Audacity, LMMS, Web MIDI, Basic Pitch, and Demucs.

The current ChatGPT session has authorized Midify, Background Music, Apple Music, and Spotify. That proves the ChatGPT plugin connection only. It does not automatically grant reusable Bubblewrap, Vercel, mobile-app, or cross-repository credentials.

OpenAI API model id: `gpt-5.6-luna`

Vercel AI Gateway model string: `openai/gpt-5.6-luna`

## Provider plug-in rule

A provider integration must be server-side and implement `OliProviderAdapter`. Registration alone does not make it live. Before enabling a provider for an app, verify:

1. provider/model name;
2. current plan/entitlement;
3. included usage, credits, and rate limits;
4. overage or metered cost;
5. required credentials and server-side secret storage;
6. privacy and data-use constraints;
7. app-specific need;
8. capability state and owner-approved spend.

Unknown entitlement or cost is GRAY. The runtime must not silently create API spend.

## App integration pattern

A product integrating Oli should inherit the shared component and runtime contract while keeping its own:

- app id and host mapping;
- design tokens, assets, and placement;
- role and organization context;
- public user surface;
- protected admin surface where needed;
- protected developer surface where needed;
- navigation map;
- subscription and entitlement source;
- domain data sources;
- privacy and legal requirements;
- support and escalation routes;
- enabled capability flags.

Shared code is not shared private customer data.

If a downstream repository does not yet have secure server-side authorization for internal routes, omit the admin/developer UI until that protection exists. Do not ship an unsecured internal screen.

## Local verification

```bash
pnpm oli:verify
pnpm build
```

`oli:verify` checks the presence of the runtime stack, registry counts, capability states, Music Oli layers, user/admin/developer separation, and the no-em-dash rule on newly governed Oli files.

## Daily loop

The repository includes `.github/workflows/oli-daily-verify.yml`. GitHub scheduled workflows execute from the default branch, so its schedule becomes active only after this branch is merged.

That workflow validates the checked-in contract. Cross-repository/Vercel discovery requires an authorized connector and therefore remains a separate Commander sync task. The daily sync may update verified snapshots and produce reviewable changes, but it must not perform production deployments, billing changes, security changes, permission escalation, or cross-app private-data transfers without explicit authorization.

## Deployment warning

The Vercel project `coughlin-atlas` is currently observed receiving branch deployments from `lovealways-bit/bubblewrap`. Until that linkage is intentionally reconciled, its red deployment checks are classified as a linkage/configuration issue and not automatically as a canonical Bubblewrap failure.

## Promotion rule

A capability becomes `LIVE` only after its implementation, app configuration, permissions, dependencies, and real runtime behavior are verified. Source code that merely describes a feature is not enough.
