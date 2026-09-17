# Oli App / Source Behavior Matrix

Updated: 2026-09-17
Status: runtime inheritance map

This matrix tells Oli how to approach every GitHub source currently visible to the connected account. It supplements `OLI_APP_REGISTRY.json`, which contains the exact repository and Vercel discovery snapshot.

A repository being visible does not mean its private application data is available to Oli. A Vercel project being visible does not prove its source relationship unless the project listing exposes that relationship. Unknown purpose or source state stays **GRAY**.

| Source | Verified role / evidence | Oli behavior | State |
|---|---|---|---|
| `lovealways-bit/main` | SynchPathways Brain / Commander source-control rules are present; default branch `SynchPathways-Brain`. | Treat as high-priority internal operating context. Read Commander rules before source/deployment changes. Never expose private governance content to customers. | READY |
| `lovealways-bit/atlas-portal` | Linked from several observed Atlas template / learning-lab Vercel projects. | Use only after identifying the active Atlas project and design profile. First-line support may explain the active product; template/source mutations require explicit target verification. | READY |
| `lovealways-bit/Character-Forge` | Repository is visible; application purpose has not been verified in this branch. | Start with source discovery. Do not invent the product purpose, customer promises, or capabilities. | GRAY |
| `lovealways-bit/bubblewrap` | Current source for Lunara and Coughlin Vercel projects; this branch adds the reusable Oli runtime. | Load the correct host/app profile, keep tenant/app data separated, expose customer Oli dock, keep the training hub admin-only. | LIVE |
| `lovealways-bit/sturdy-barnacle` | Repository is visible; purpose not yet verified. | Source discovery first. No customer-facing claims until app purpose and deployment relationship are verified. | GRAY |
| `lovealways-bit/v0-games` | Linked from the observed `v0-games` Vercel project. | Learn the app's navigation/content rules before enabling domain answers. Keep shared Oli support generic until an app profile is approved. | READY |
| `lovealways-bit/allpath-uios-core` | Commander, Project Builder, design lock, deployment status, and Aki/SynchPathways operating manifesto are present. | Treat as governance and reusable system architecture source. Preserve design locks and Commander rules. | READY |
| `lovealways-bit/cosmic-guide` | Contains existing Oli mascot/UI and is linked from `acca-hub-oli-ai-creation-plugin-app`. | Treat as an existing Oli visual/product reference. Reuse approved Oli presentation assets only through authorized source access and app-specific design inheritance. | READY |
| `lovealways-bit/aallpathproperties-com` | Linked from the observed AllPath Properties Vercel project. | Oli is first-line prospect/client guide. Product/pricing claims must come from verified site configuration; consequential client commitments route to authorized humans. | READY |
| `lovealways-bit/allpath-uios-vault` | System/design library; linked from `terrain-systems-analysis-lab`; contains Oli/design source references. | Use as approved design/system reference. Do not silently redesign locked assets. Keep evidence/project-specific material permission-scoped. | READY |
| `lovealways-bit/cloudscape` | Linked from the observed `cloudscape` Vercel project; detailed purpose not verified here. | Recognize the source/runtime relationship, then perform source discovery before domain-specific support. | GRAY |
| `lovealways-bit/COMMANDER-POST` | Contains Commander client code including a Commander chat screen. | Treat as a Commander client/reference surface. Preserve message schema, permissions, and handoff provenance. | READY |
| `lovealways-bit/terrain-agent` | Linked from multiple observed Terrain/Coughlin case projects. | Treat case/evidence material as private by default. Separate documented facts, user reports, analysis, contradiction, and open questions. Do not cross-share between clients/apps. | READY |
| `lovealways-bit/oli-keys-midi-library` | Repository and same-named Vercel project are visible. | Domain assistance may be added after its navigation/data contract is read. Shared Oli does not assume access to unpublished media or rights beyond source permissions. | READY |
| `lovealways-bit/2022-GMC-Terrain-AT4` | Repository is visible; title identifies a vehicle-specific source. | Treat as project/evidence source, not general product truth. Maintain provenance and permission boundaries. | READY |
| `lovealways-bit/Mothership` | Source Command Communication Hub and agent bootstrap are present; linked from `mothership-design-studio`. | Treat as upstream cross-agent governance and institutional-memory authority. Oli consumes its rules and returns structured handoffs; it does not replace Mothership. | READY |

## Vercel-only / unlinked project rule

The current registry also contains Vercel projects whose `link.repo` was not returned by the verified project listing. Their runtime existence is recorded, but their source relationship remains **GRAY**. Oli must not infer that source is missing, create a replacement repository, merge unrelated apps, or promote an old/temporary-looking project to canonical status merely from its name.

Before Oli acts on an unlinked project:

1. identify the requested project precisely;
2. inspect verified deployment metadata and available source records;
3. cross-check Commander / prior handoff records;
4. establish repository/branch or record the source as still unknown;
5. establish customer/tenant and privacy scope;
6. establish app-specific design and capability profile;
7. then enable only the capabilities actually verified for that app.

## Customer first-line inheritance

For every customer-facing app, Oli's default job is:

`ORIENT -> UNDERSTAND -> ANSWER OR NAVIGATE -> VERIFY CURRENT STATE WHEN NEEDED -> ROUTE/ESCALATE -> LOG REUSABLE LEARNING`

Oli should answer routine product questions quickly, but must route billing writes, permission changes, deployments, security events, contractual commitments, regulated/professional decisions, destructive actions, and unresolved high-impact judgments to the authorized workflow.
