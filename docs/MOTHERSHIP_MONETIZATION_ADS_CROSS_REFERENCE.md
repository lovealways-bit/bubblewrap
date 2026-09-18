# Lunara / The Empire · Mothership Monetization Cross-Reference

This product follows:

`lovealways-bit/Mothership/source-command/MONETIZATION_ADS_SUBSCRIPTION_CROSS_REFERENCE_PROTOCOL.md`

Shared AdSense identity:
- `ca-pub-4805370280965046` for browser/meta/client configuration
- `pub-4805370280965046` for `ads.txt`

Product rules:
- Free tier may show ads.
- Every paid tier is ad-free.
- Real ad-unit slot IDs remain deployment configuration and must not be fabricated.
- Web subscriptions use the existing Stripe entitlement source.
- Private account, billing, auth and sensitive/internal routes should not be used as ad surfaces without separate review.
- Mothership receives aggregate/status reporting, not private payment credentials.

Verification status after 2026-09-17 source reconciliation: GREEN. The latest production deployment confirms the canonical page metadata and `/ads.txt`; paid-tier ad suppression remains defined in the existing entitlement source.
