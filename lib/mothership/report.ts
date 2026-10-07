import { db } from '@/lib/db'
import { user, subscription, savedReading } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { TIERS, type TierId } from '@/lib/subscription/tiers'

export type MothershipReport = {
  app: 'lunara'
  generatedAt: string
  users: {
    total: number
    newLast7Days: number
    newLast30Days: number
  }
  subscribers: {
    total: number
    active: number
    byTier: Record<TierId, number>
    mrrCents: number
  }
  engagement: {
    readingsTotal: number
    readingsLast7Days: number
  }
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000)
}

// Builds an aggregate, PII-free snapshot for the Commander Hub to poll.
// Every number is a COUNT or SUM - no user rows, emails, or reading contents
// ever leave this endpoint.
export async function buildMothershipReport(): Promise<MothershipReport> {
  const [userCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      new7: sql<number>`count(*) filter (where ${user.createdAt} >= ${daysAgo(7).toISOString()})::int`,
      new30: sql<number>`count(*) filter (where ${user.createdAt} >= ${daysAgo(30).toISOString()})::int`,
    })
    .from(user)

  const tierRows = await db
    .select({
      tier: subscription.tier,
      status: subscription.status,
      count: sql<number>`count(*)::int`,
    })
    .from(subscription)
    .groupBy(subscription.tier, subscription.status)

  const byTier = Object.fromEntries(
    Object.keys(¶»§q«^