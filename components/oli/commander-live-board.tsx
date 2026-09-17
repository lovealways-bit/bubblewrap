'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Clock3, MessageSquareText, RefreshCw, Send, ShieldCheck } from 'lucide-react'

type CommanderEntry = {
  id: string
  createdAt: string
  authorLabel: string
  authorType: string
  entryType: string
  status: string
  title: string | null
  body: string
  sourceRefs: string[]
  metadata: Record<string, unknown>
}

const entryTypes = ['message', 'status', 'decision', 'blocker', 'handoff'] as const
const statuses = ['INFO', 'READY', 'BUILDING', 'BLOCKED', 'ERROR', 'DONE'] as const

export function CommanderLiveBoard() {
  const [entries, setEntries] = useState<CommanderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [entryType, setEntryType] = useState<(typeof entryTypes)[number]>('message')
  const [status, setStatus] = useState<(typeof statuses)[number]>('INFO')
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  const loadEntries = useCallback(async () => {
    try {
      const response = await fetch('/api/oli/commander-log', { cache: 'no-store' })
      const data = (await response.json()) as { entries?: CommanderEntry[]; error?: string }
      if (!response.ok) throw new Error(data.error || 'Unable to load Commander log.')
      setEntries(data.entries || [])
      setLastSynced(new Date())
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load Commander log.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEntries()
    const timer = window.setInterval(() => void loadEntries(), 15000)
    return () => window.clearInterval(timer)
  }, [loadEntries])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = body.trim()
    if (!message || posting) return

    setPosting(true)
    setError('')
    try {
      const response = await fetch('/api/oli/commander-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: message, title: title.trim(), entryType, status }),
      })
      const data = (await response.json()) as { entry?: CommanderEntry; error?: string }
      if (!response.ok || !data.entry) throw new Error(data.error || 'Unable to post Commander entry.')
      setEntries((current) => [data.entry as CommanderEntry, ...current.filter((item) => item.id !== data.entry?.id)])
      setBody('')
      setTitle('')
      setEntryType('message')
      setStatus('INFO')
      setLastSynced(new Date())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to post Commander entry.')
    } finally {
      setPosting(false)
    }
  }

  const newest = useMemo(() => entries[0], [entries])

  return (
    <section id="commander-log" className="mb-5 overflow-hidden rounded-[30px] border border-white bg-white/90 shadow-xl shadow-purple-950/5 backdrop-blur-xl">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-2xl bg-purple-50 text-purple-700">
                <MessageSquareText className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-semibold tracking-wide">Commander Live Time Board</h2>
            </div>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
              Persistent owner and agent debriefs, decisions, blockers, handoffs, and verified deployment state. Refreshes every 15 seconds while this page is open.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Admin only
            <button
              type="button"
              onClick={() => void loadEntries()}
              className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:border-purple-200 hover:text-purple-700"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[.86fr_1.14fr]">
        <form onSubmit={submit} className="border-b border-slate-100 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700">Write to Commander</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-slate-600">
              Entry type
              <select
                value={entryType}
                onChange={(event) => setEntryType(event.target.value as (typeof entryTypes)[number])}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-300"
              >
                {entryTypes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-600">
              State
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as (typeof statuses)[number])}
                className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-300"
              >
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label className="mt-3 block text-xs font-medium text-slate-600">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={180}
              placeholder="Optional short headline"
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-purple-300"
            />
          </label>
          <label className="mt-3 block text-xs font-medium text-slate-600">
            Message
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={12000}
              rows={7}
              placeholder="Post an update, decision, blocker, handoff, or instruction..."
              className="mt-1.5 w-full resize-y rounded-[22px] border border-slate-200 bg-white px-3 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-purple-300"
            />
          </label>
          {error ? <p className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p> : null}
          <button
            type="submit"
            disabled={!body.trim() || posting}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {posting ? 'Posting...' : 'Post to Commander'}
          </button>
        </form>

        <div className="min-h-[420px] p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Live debrief stream</p>
              <p className="mt-1 text-xs text-slate-400">{entries.length} retained entries in this view</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              {lastSynced ? `Synced ${lastSynced.toLocaleTimeString()}` : 'Syncing'}
            </div>
          </div>

          {loading ? <p className="text-sm text-slate-500">Loading Commander history...</p> : null}
          {!loading && !entries.length ? <p className="text-sm text-slate-500">No Commander entries yet.</p> : null}

          <div className="max-h-[650px] space-y-3 overflow-y-auto pr-1">
            {entries.map((entry) => (
              <article key={entry.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-purple-700 shadow-sm">{entry.entryType}</span>
                  <span className={statusClass(entry.status)}>{entry.status}</span>
                  <span className="text-[10px] text-slate-400">{formatTime(entry.createdAt)}</span>
                </div>
                {entry.title ? <h3 className="mt-3 text-sm font-semibold text-slate-900">{entry.title}</h3> : null}
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{entry.body}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                  <span>{entry.authorLabel}</span>
                  <span>•</span>
                  <span>{entry.authorType}</span>
                  {entry.sourceRefs?.length ? <span>• {entry.sourceRefs.length} source ref{entry.sourceRefs.length === 1 ? '' : 's'}</span> : null}
                </div>
              </article>
            ))}
          </div>

          {newest?.entryType === 'audit' ? (
            <p className="mt-4 text-[11px] leading-5 text-slate-400">Newest record is a verified audit entry. Agent-originated records stay labeled as agent-originated.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function statusClass(status: string) {
  const base = 'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]'
  if (status === 'DONE' || status === 'READY') return `${base} bg-emerald-50 text-emerald-700`
  if (status === 'ERROR' || status === 'BLOCKED') return `${base} bg-rose-50 text-rose-700`
  if (status === 'BUILDING') return `${base} bg-amber-50 text-amber-700`
  return `${base} bg-purple-50 text-purple-700`
}

function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
