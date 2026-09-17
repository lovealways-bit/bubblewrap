# Oli Commander Training Hub

Branch: `oli-commander-training-hub-20260917`

Bubblewrap now contains the reusable runtime layer for **Oli**, the governed companion / first-line customer guide used across participating AllPath / SynchPathways applications.

## Authority map

- **Mothership**: cross-agent Source Command, governance, provenance, permission, institutional memory.
- **Commander / SynchPathways Brain**: source-control and deployment discipline, verified handoffs, project registries.
- **Bubblewrap / Oli runtime**: executable app profiles, capability flags, prompt compiler, customer-facing dock, local routing, provider adapter interface.
- **HEARTBEAT**: current verified runtime state.
- **App profile**: the narrow domain, permissions, design, support, navigation, and capability overlay for the active product.

Oli is a product/orchestration identity, not ownership of any third-party foundation model.

## Runtime surfaces

| Surface | Purpose |
|---|---|
| `commander/MANUSCRIPT.md` | Oli's canonical Bubblewrap behavior contract. |
| `commander/OLI_APP_REGISTRY.json` | Verified GitHub/Vercel discovery snapshot. |
| `commander/OLI_CAPABILITIES.json` | Capability state and dependency registry. |
| `commander/OLI_APP_BEHAVIOR_MATRIX.md` | Per-source behavior and unknown-state rules. |
| `commander/HEARTBEAT.json` | Verified runtime readiness snapshot. |
| `lib/oli/registry.ts` | Resolves current app context and registered capabilities. |
| `lib/oli/system-prompt.ts` | Compiles app-aware Oli instructions for a future approved model adapter. |
| `lib/oli/provider-adapter.ts` | Server-only plug-in contract for AI/search/embedding/tool providers. |
| `lib/oli/command-router.ts` | Deterministic first-line local routing that works before a paid model is connected. |
| `/api/oli/context` | Sanitized app/capability context. |
| `/api/oli/health` | Runtime/capability self-check. |
| `/api/oli/command` | Customer-facing local command router. |
| `components/oli/oli-commander-dock.tsx` | Reusable Oli customer contact UI. |
| `/oli` | Admin-only training/Commander status screen. |

## Provider plug-in rule

A provider integration must be server-side and implement `OliProviderAdapter`. Registration alone does not make it live. Before enabling a provider for an app, verify:

1. provider/model name;
2. current plan/entitlement;
3. included usage/credits/rate limits;
4. overage/metered cost;
5. required credentials and server-side secret storage;
6. privacy/data-use constraints;
7. app-specific need;
8. capability state and owner-approved spend.

Unknown entitlement/cost is GRAY. The runtime must not silently create API spend.

## App integration pattern

A product integrating Oli should inherit the shared component and runtime contract while keeping its own:

- app id and host mapping;
- design tokens/assets/placement;
- role and organization context;
- navigation map;
- subscription/entitlement source;
- domain data sources;
- privacy/legal requirements;
- support and escalation routes;
- enabled capability flags.

Shared code is not shared private customer data.

## Local verification

```bash
pnpm oli:verify
pnpm build
```

`oli:verify` checks the presence of the runtime stack, registry counts, capability states, and source references.

## Daily loop

The repository includes `.github/workflows/oli-daily-verify.yml`. GitHub scheduled workflows execute from the default branch, so its schedule becomes active only after this branch is merged.

That workflow validates the checked-in contract. Cross-repository/Vercel discovery requires an authorized connector and therefore remains a separate Commander sync task. The daily sync may update verified snapshots and produce reviewable changes, but it must not perform production deployments, billing changes, security changes, permission escalation, or cross-app private-data transfers without explicit authorization.

## Promotion rule

A capability becomes `LIVE` only after its implementation, app configuration, permissions, dependencies, and real runtime behavior are verified. Source code that merely describes a feature is not enough.
