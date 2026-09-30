# Oli ZIP Naming Law

Canonical authority:
`lovealways-bit/Mothership/source-command/governance/ZIP_NAMING_LAW.md`

Effective: 2026-09-18

## Required filename
Every new ZIP package created by this product's Oli/Commander/build workflow must use:

`YYYY-MM-DD_TOPIC_ACTION.zip`

The filename must always identify:
1. date
2. topic
3. action

Examples:
- `2026-09-18_OLI-CROSS-MODEL_REVIEW-AND-COMMANDER-PUSH.zip`
- `2026-09-18_PRODUCT-BUILD_EXPORT-FOR-REVIEW.zip`

Do not generate vague package names such as `archive.zip`, `chat.zip`, `files.zip`, `update.zip`, or `final.zip`.

## Manifest
New ZIP packages should contain or be paired with a manifest containing, when available:
- timestamp and timezone
- topic
- action
- source and destination
- repo/product/build
- branch
- commit, PR, and deployment references
- SHA256
- provenance / parent package
- lifecycle state

## Historical evidence
Do not destructively rename or overwrite historical source ZIPs. Preserve originals and map legacy names through a normalized catalog/index. Create a newly named derivative only when producing an actual refreshed package.

## Scope
This is an additive packaging/governance rule only. It does not authorize changes to approved UI, application behavior, deployments, database schema, providers, secrets, permissions, billing, or historical evidence.
