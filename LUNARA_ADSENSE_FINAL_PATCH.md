# Lunara AdSense Final Patch

Publisher client: `ca-pub-4805370280965046`

This patch is Lunara-only and preserves the subscription/ad entitlement system already merged into Lunara.

## Required configuration

- Metadata: `<meta name="google-adsense-account" content="ca-pub-4805370280965046">`
- Root `ads.txt`: `google.com, pub-4805370280965046, DIRECT, f08c47fec0942fa0`
- Public client env: `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4805370280965046`
- Do not invent slot IDs. Keep `NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT` and `NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT` empty until Google issues them.
- Free only: `ads_enabled=true`
- Core / Plus / Personal: `ads_enabled=false`
- Paid users must never initialize an AdSense request.
- Private Lunara data must not be used for advertising targeting.
- Do not place AdSense payout/payment profile IDs, banking data, tax data, addresses, or other payout administration data in GitHub, frontend code, analytics, logs, or environment variables.
