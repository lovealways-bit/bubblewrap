// Shared Google AdSense identity for AllPath public properties.
// The client/publisher identifier is public by design and appears in page
// metadata and /ads.txt. Per-property ad-unit slot IDs remain deployment envs.
const DEFAULT_ADSENSE_CLIENT_ID = 'ca-pub-4805370280965046'

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || DEFAULT_ADSENSE_CLIENT_ID

export function publisherIdForAdsTxt() {
  return ADSENSE_CLIENT_ID.replace(/^ca-/, '')
}
