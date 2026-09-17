# DEPLOYMENT LINKAGE ISSUES

Updated: 2026-09-17

## coughlin-atlas

State: CONFIRMED LINKAGE / ENVIRONMENT CONFIGURATION ISSUE

Verified Vercel project:

- project: `coughlin-atlas`
- project id: `prj_EsZ2mzfdwHSI9IrNR223gabjQzCh`
- team: `team_9tUAYHLYN7H8mAKq39TqbIya`
- currently receiving deployments from `lovealways-bit/bubblewrap`
- observed branch deployments from `oli-commander-training-hub-20260917` and `oli-specialist-stacks-20260917`

A failed build was inspected directly. Vercel build logs confirm the project does not currently have the Bubblewrap environment required to compile the shared authentication and Stripe code.

Confirmed build errors include:

- `BETTER_AUTH_SECRET` is not configured, causing Better Auth to reject the default secret.
- `STRIPE_SECRET_KEY` is absent, so Stripe initialization fails while collecting configuration for `/api/stripe/webhook`.

This confirms the red check is caused by the current project/repository configuration. It is not evidence that the same Bubblewrap commit is broken everywhere. The same branch commits have reached READY on the `lunara-atlas` Vercel project.

## Required resolution

Choose one intentional path:

1. Keep `coughlin-atlas` linked to `lovealways-bit/bubblewrap` only if that architecture is intended. In that case, configure the required environment variables and any product-specific build assumptions in the proper Vercel environments.
2. If `coughlin-atlas` should remain an independent deployment lane, unlink it from Bubblewrap or reconnect it to its intended source repository.

Do not copy production secrets into an unrelated project merely to make an accidental repository linkage turn green.

## Tool limitation

The connected Vercel actions available in this session can inspect project state, deployments, runtime state, and build logs. They do not expose an action here for changing Git repository linkage or writing project environment-variable values. Therefore unlinking and secret configuration have not been performed from this chat.

Until the owner intentionally resolves the relationship, Commander should label this deployment signal `LINKAGE / CONFIGURATION ISSUE`, with the missing environment documented above, rather than `BUBBLEWRAP BUILD FAILURE`.
