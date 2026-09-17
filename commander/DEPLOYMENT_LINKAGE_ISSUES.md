# DEPLOYMENT LINKAGE ISSUES

Updated: 2026-09-17

## coughlin-atlas

State: ACTION REQUIRED

Verified Vercel project:

- project: `coughlin-atlas`
- project id: `prj_EsZ2mzfdwHSI9IrNR223gabjQzCh`
- team: `team_9tUAYHLYN7H8mAKq39TqbIya`
- currently receiving deployments from `lovealways-bit/bubblewrap`
- observed branch deployments from `oli-commander-training-hub-20260917` and `oli-specialist-stacks-20260917`

This means Bubblewrap commits are currently capable of triggering `coughlin-atlas` checks. A red Vercel deployment on that project must not be treated as the canonical Bubblewrap build result until project linkage and environment configuration are intentionally reconciled.

## Required resolution

Choose one verified path:

1. Keep `coughlin-atlas` linked to `lovealways-bit/bubblewrap` only if that architecture is intentional, then configure the environment variables and build assumptions needed by the shared repository for that Vercel project.
2. If `coughlin-atlas` should remain an independent product/deployment lane, unlink it from the Bubblewrap Git repository or reconnect it to its intended source repository.

Do not add secrets merely to make an accidental repository linkage turn green.

## Current limitation

The connected Vercel tools used for this verification expose project and deployment state but do not expose or mutate project environment-variable values or Git repository linkage. Therefore the environment variables themselves have not been confirmed from this runtime, and unlinking has not been performed here.

Until resolved, Commander should label this deployment signal `LINKAGE / CONFIGURATION ISSUE` rather than `BUBBLEWRAP BUILD FAILURE`.
