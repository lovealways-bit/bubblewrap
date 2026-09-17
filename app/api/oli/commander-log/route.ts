import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { getSession, isAdminEmail } from '@/lib/session'

export const dynamic = 'force-dynamic'

const ENTRY_TYPES = new Set(['message', 'audit', 'decision', 'blocker', 'handoff', 'status'])
const STATUSES = new Set(['INFO', 'READY', 'BUILDING', 'BLOCKED', 'ERROR', 'DONE'])
const AUDIT_SEED_ID = 'commander-vercel-audit-2026-09-17T1903Z'

async function requireAdmin() {
  const session = await getSession()
  const email = session?.user?.email
  if (!email || !isAdminEmail(email)) return null
  return { email, name: session.user.name || email }
}

async function ensureCommanderLogTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS oli_commander_log (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      author_email TEXT,
      author_label TEXT NOT NULL,
      author_type TEXT NOT NULL DEFAULT 'owner',
      entry_type TEXT NOT NULL DEFAULT 'message',
      status TEXT NOT NULL DEFAULT 'INFO',
      title TEXT,
      body TEXT NOT NULL,
      source_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `)

  await pool.query(
    `
      INSERT INTO oli_commander_log (
        id, created_at, author_label, author_type, entry_type, status, title, body, source_refs, metadata
      ) VALUES (
        $1,
        '2026-09-17T19:03:11Z',
        'ChatGPT / Oli Commander audit',
        'agent',
        'audit',
        'INFO',
        'Vercel estate audit: 50 projects checked',
        $2,
        $3::jsonb,
        $4::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `,
    [
      AUDIT_SEED_ID,
      'Verified all 50 SynchPathways Vercel projects: 32 READY production deployments, 2 production errors, 11 READY previews, 2 preview builds in progress, and 3 blocked previews. Mothership canonical URL returned HTTP 200. Priority work: finish Lunara and Coughlin previews, repair or retire the old Terrain production error, repair Attorney Intake vercel.json, investigate blocked previews, and canonicalize duplicate historical deployments.',
      JSON.stringify([
        'commander/logs/2026-09-17T1903Z-vercel-deployment-audit.json',
        'https://mothership-um.vercel.app',
      ]),
      JSON.stringify({
        productionReady: 32,
        productionError: 2,
        previewReady: 11,
        previewBuilding: 2,
        previewBlocked: 3,
        projectsObserved: 50,
      }),
    ],
  )
}

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })

  await ensureCommanderLogTable()
  const result = await pool.query(
    `
      SELECT
        id,
        created_at AS "createdAt",
        author_label AS "authorLabel",
        author_type AS "authorType",
        entry_type AS "entryType",
        status,
        title,
        body,
        source_refs AS "sourceRefs",
        metadata
      FROM oli_commander_log
      ORDER BY created_at DESC
      LIMIT 200
    `,
  )

  return NextResponse.json(
    { entries: result.rows, count: result.rowCount },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const input = body as {
    body?: unknown
    title?: unknown
    entryType?: unknown
    status?: unknown
    sourceRefs?: unknown
  }

  const message = typeof input.body === 'string' ? input.body.trim() : ''
  const title = typeof input.title === 'string' ? input.title.trim().slice(0, 180) : ''
  const entryType = typeof input.entryType === 'string' && ENTRY_TYPES.has(input.entryType) ? input.entryType : 'message'
  const status = typeof input.status === 'string' && STATUSES.has(input.status) ? input.status : 'INFO'
  const sourceRefs = Array.isArray(input.sourceRefs)
    ? input.sourceRefs.filter((item): item is string => typeof item === 'string').slice(0, 12)
    : []

  if (!message) return NextResponse.json({ error: 'body is required.' }, { status: 400 })
  if (message.length > 12000) return NextResponse.json({ error: 'body must be 12000 characters or fewer.' }, { status: 413 })

  await ensureCommanderLogTable()
  const id = crypto.randomUUID()
  const inserted = await pool.query(
    `
      INSERT INTO oli_commander_log (
        id, author_email, author_label, author_type, entry_type, status, title, body, source_refs, metadata
      ) VALUES ($1, $2, $3, 'owner', $4, $5, $6, $7, $8::jsonb, '{}'::jsonb)
      RETURNING
        id,
        created_at AS "createdAt",
        author_label AS "authorLabel",
        author_type AS "authorType",
        entry_type AS "entryType",
        status,
        title,
        body,
        source_refs AS "sourceRefs",
        metadata
    `,
    [id, admin.email, admin.name, entryType, status, title || null, message, JSON.stringify(sourceRefs)],
  )

  return NextResponse.json({ entry: inserted.rows[0] }, { status: 201 })
}
