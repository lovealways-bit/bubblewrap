# Sudo Mothership Control Plane

**Canonical checkpoint:** `sudo-mothership-draft-control-plane-2026-09-17`

## System law

The Sudo Draft Studio is the private mother control plane. It is where the founder can work across roles, edit UI and landing-page drafts, drop numbered comments, route work through Commander Oli, test connectors and APIs, inspect source-linked state, and prepare release candidates.

Oli does not silently retrain its base model. Oli grows operationally through explicit adapters, shared context, role/job routing, source-linked memory, permissions, execution logs, feedback, and versioned outputs.

## Loop

`Sudo Draft Studio -> Commander Oli -> specialist agent/API/connector -> result returns to Draft Studio -> founder review/comment -> Professional Mothership -> Sales/Legal/Release -> branded public domain -> feedback/telemetry -> Draft Studio`

## Founder roles

- Mom
- Teacher
- Producer
- Artist
- Researcher
- Advocate
- Developer

Roles change context and routing. They do not create separate truths or separate data silos.

## Release stages

1. **Draft Stage**: private creation and experimentation. Nothing is assumed approved or public.
2. **Oli / Commander Review**: source, permission, connector, design, policy and implementation checks.
3. **Professional Stage**: cleaned release candidate with approved design and working hooks.
4. **Launch**: explicit founder promotion to the branded public domain.

## Design authority

Approved v0 originals remain source-locked. Sudo can layer, test and redesign drafts without destroying the approved source. Public replacement requires explicit founder publish action.

## UI as command surface

The Draft Studio supports numbered coordinate comments. A founder can click a point on a page and write an instruction such as "move this left", "change this font", "replace this image", or "wire this button". The annotation records page path, coordinates, note, status and role/stage tags, and pushes the instruction into Commander Oli. Oli can read the current page draft, write a new draft, and resolve the numbered comment only after the requested change is represented in the saved draft.

## Current live Sudo capabilities

- full-page editor for known, nested and future routes
- drag, move, resize, delete, duplicate and layer controls
- font, color, sizing, border, opacity and page background controls
- raw JSON/CSS draft access
- image, video, audio and file uploads
- template API and Mothership asset library API
- numbered comment pin API
- Commander Oli streaming terminal
- web research adapter
- Supabase data/audit spine
- founder-only draft write tool for Commander Oli
- explicit publish boundary

## Deployment and domains

The canonical public launch origin is `https://allpathproperties.com` through the launch registry. Vercel hostnames are infrastructure diagnostics and preview/runtime addresses, not intended brand-facing launch URLs.

At the time of this checkpoint, the AllPath Vercel project does not yet show a custom domain binding. DNS/domain attachment remains a required infrastructure step before the canonical domain can carry production traffic.

## Connector rule

Every external connector or agent must enter through a named adapter with explicit permissions, capability state, cost/entitlement state, source/license restrictions and audit logging. Never claim a connector is active because ChatGPT itself has access to it. Application-side access requires its own authorized bridge.
