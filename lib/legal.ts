import 'server-only'
import { randomUUID } from 'crypto'
import { pool } from '@/lib/db'

export const LEGAL_VERSION = '2026-09-17'

let tableReady: Promise<unknown> | null = null

function ensureLegalTable() {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS legal_acceptance (
        id text PRIMARY KEY,
        user_id text NOT NULL,
        terms_version text NOT NULL,
        context text NOT NULL,
        accepted_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }
  return tableReady
}

export async function recordLegalAcceptance(userId: string, context: string) {
  await ensureLegalTable()
  await pool.query(
    `INSERT INTO legal_acceptance (id, user_id, terms_version, context)
     VALUES ($1, $2, $3, $4)`,
    [randomUUID(), userId, LEGAL_VERSION, context.slice(0, 120)],
  )
}
