'use server'

import { auth } from '@/lib/auth'

// Fixed demo credentials for a "test viewer" — a clearly-labeled, free-tier
// only account anyone can use to explore Lunara without creating a real
// account. Idempotent: creates the account once, then this becomes a no-op.
const TEST_VIEWER_EMAIL = 'test-viewer@lunara.app'
const TEST_VIEWER_PASSWORD = 'lunara-test-viewer-2026'
const TEST_VIEWER_NAME = 'Test Viewer'

export async function ensureTestViewerAccount() {
  try {
    await auth.api.signUpEmail({
      body: { email: TEST_VIEWER_EMAIL, password: TEST_VIEWER_PASSWORD, name: TEST_VIEWER_NAME },
    })
  } catch {
    // Already exists — that is the expected steady state after the first call.
  }
  return { email: TEST_VIEWER_EMAIL, password: TEST_VIEWER_PASSWORD }
}
