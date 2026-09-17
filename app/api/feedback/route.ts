import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { getSession } from '@/lib/session'
import { getUserTier } from '@/lib/subscription/entitlements'
import { TIERS } from '@/lib/subscription/tiers'

export const runtime = 'nodejs'

let tableReady: Promise<unknown> | null = null

function ensureFeedbackTable() {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS lunara_feedback (
        id text PRIMARY KEY,
        user_id text,
        tier text NOT NULL DEFAULT 'free',
        category text NOT NULL,
        message text NOT NULL,
        page text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }
  return tableReady
}

const ALLOWED_CATEGORIES = new Set(['bug', 'idea', 'tarot', 'oli', 'billing', 'other'])

export async function POST(request: Request) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Sign in to send feedback.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const category = ALLOWED_CATEGORIES.has(body?.category) ? body.category : 'other'
  const page = typeof body?.page === 'string' ? body.page.slice(0, 180) : null

  if (!message || message.length > 3000) {
    return NextResponse.json({ error: 'Feedback must be between 1 and 3,000 characters.' }, { status: 400 })
  }

  const tier = await getUserTier(session.user.id).catch(() => TIERS.free)

  try {
    await ensureFeedbackTable()
    await pool.query(
      `INSERT INTO lunara_feedback (id, user_id, tier, category, message, page)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [randomUUID(), session.user.id, tier.id, category, message, page],
    )
  } catch (error) {
    console.error('Feedback persistence failed', error)
    return NextResponse.json({ error: 'Feedback could not be saved right now.' }, { status: 503 })
  }

  return NextResponse.json({ ok: true })
}
