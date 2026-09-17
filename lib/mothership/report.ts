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
// Every number is a COUNT or SUM — no user rows, emails, or reading contents
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
    Object.keys(TIERS).map((id) => [id, 0]),
  ) as Record<TierId, number>

  let activeSubscribers = 0
  let mrrCents = 0
  for (const row of tierRows) {
    const tierId = row.tier as TierId
    if (tierId in byTier) byTier[tierId] += row.count
    if (row.status === 'active' || row.status === 'trialing') {
      activeSubscribers += tierId === 'free' ? 0 : row.count
      const tier = TIERS[tierId]
      if (tier && tier.priceCents) mrrCents += tier.priceCents * row.count
    }
  }

  const totalSubscribers = tierRows.reduce((sum, r) => sum + r.count, 0)

  const [readingCounts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      last7: sql<number>`count(*) filter (where ${savedReading.createdAt} >= ${daysAgo(7).toISOString()})::int`,
    })
    .from(savedReading)

  return {
    app: 'lunara',
    generatedAt: new Date().toISOString(),
    users: {
      total: userCounts?.total ?? 0,
      newLast7Days: userCounts?.new7 ?? 0,
      newLast30Days: userCounts?.new30 ?? 0,
    },
    subscribers: {
      total: totalSubscribers,
      active: activeSubscribers,
      byTier,
      mrrCents,
    },
    engagement: {
      readingsTotal: readingCounts?.total ?? 0,
      readingsLast7Days: readingCounts?.last7 ?? 0,
    },
  }
}
