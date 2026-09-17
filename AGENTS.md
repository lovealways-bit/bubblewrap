<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Oli Commander runtime rules

Bubblewrap is the executable Oli training/runtime hub for participating AllPath / SynchPathways builds. Mothership and Commander governance remain upstream authorities.

Before changing Oli, assistant behavior, customer support routing, app navigation, research/search behavior, provider adapters, cross-app context, deployment behavior, subscriptions, feedback, privacy, legal surfaces, or Commander integration:

1. Read `commander/MANUSCRIPT.md`.
2. Read `commander/OLI_APP_REGISTRY.json`.
3. Read `commander/OLI_CAPABILITIES.json`.
4. Read the task-relevant upstream Mothership / Commander governance source when available.
5. Verify the active app, repository, branch, deployment target, provider entitlement, permissions, and capability state before representing a feature as connected or live.
6. Preserve `LIVE`, `READY`, `PLANNED`, `BLOCKED`, and `GRAY` distinctions. Unknown state is never silently promoted.
7. Keep secrets server-side and never place master credentials in prompts, source files, commits, or client bundles.
8. Keep app/tenant private data separated. Shared Oli code does not imply shared customer data.
9. Treat approved visual references and design locks as source material. Reuse and parameterize them instead of redesigning them without approval.
10. Record consequential Oli capability changes in the Manuscript/registry or the appropriate upstream handoff log.

For any new Oli capability, follow the Manuscript expansion rule: problem -> app scope -> source -> provider dependency -> cost/entitlement -> privacy/security -> capability flag -> preview test -> documentation -> verified promotion.
