import 'server-only'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// List of admin emails allowed to reach the design-frame library.
// Configure via ADMIN_EMAILS (comma separated) in project env.
export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.toLowerCase())
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session?.user || !isAdminEmail(session.user.email)) {
    throw new Error('Forbidden')
  }
  return session.user
}
