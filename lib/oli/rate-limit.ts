import 'server-only'
import type { NextRequest } from 'next/server'

type RateLimitPolicy = {
  id: string
  limit: number
  windowMs: number
}

type Bucket = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

type GlobalWithOliRateLimit = typeof globalThis & {
  __oliRateLimitBuckets?: Map<string, Bucket>
}

const globalState = globalThis as GlobalWithOliRateLimit
const buckets = globalState.__oliRateLimitBuckets ?? new Map<string, Bucket>()
globalState.__oliRateLimitBuckets = buckets

function requestIdentity(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function pruneExpired(now: number) {
  if (buckets.size < 2000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }

  if (buckets.size > 5000) {
    const overflow = buckets.size - 5000
    let removed = 0
    for (const key of buckets.keys()) {
      buckets.delete(key)
      removed += 1
      if (removed >= overflow) break
    }
  }
}

export function checkOliRateLimit(request: NextRequest, policy: RateLimitPolicy): RateLimitResult {
  const now = Date.now()
  pruneExpired(now)

  const key = `${policy.id}:${requestIdentity(request)}`
  const existing = buckets.get(key)
  const bucket = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + policy.windowMs }
    : existing

  bucket.count += 1
  buckets.set(key, bucket)

  const allowed = bucket.count <= policy.limit
  const remaining = Math.max(0, policy.limit - bucket.count)
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))

  return {
    allowed,
    limit: policy.limit,
    remaining,
    resetAt: bucket.resetAt,
    retryAfterSeconds,
  }
}

export function oliRateLimitHeaders(result: RateLimitResult) {
  return {
    'RateLimit-Limit': String(result.limit),
    'RateLimit-Remaining': String(result.remaining),
    'RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    ...(result.allowed ? {} : { 'Retry-After': String(result.retryAfterSeconds) }),
  }
}

export const OLI_RATE_LIMITS = {
  command: { id: 'oli-command', limit: 20, windowMs: 60_000 },
  context: { id: 'oli-context', limit: 60, windowMs: 60_000 },
} as const
