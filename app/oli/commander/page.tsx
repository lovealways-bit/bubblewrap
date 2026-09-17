import Link from 'next/link'
import { ChevronLeft, Radio } from 'lucide-react'
import { redirect } from 'next/navigation'
import { CommanderLiveBoard } from '@/components/oli/commander-live-board'
import { getSession, isAdminEmail } from '@/lib/session'

export default async function CommanderLiveBoardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  if (!isAdminEmail(session.user.email)) redirect('/account')

  return (
    <main className="min-h-svh bg-[#fbfafc] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-3 rounded-[26px] border border-white bg-white/90 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-700">
              <Radio className="h-3.5 w-3.5" /> Oli Commander
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Live Time Board + Chat</h1>
            <p className="mt-1 text-xs text-slate-500">Persistent operational log, owner messages, agent audits, blockers, decisions, and handoffs.</p>
          </div>
          <Link
            href="/oli"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-purple-300 hover:text-purple-700"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Commander Hub
          </Link>
        </header>
        <CommanderLiveBoard />
      </div>
    </main>
  )
}
