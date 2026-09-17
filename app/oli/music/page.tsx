import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Music2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { listMusicOliAdminTools } from '@/lib/oli/music-tools'
import { getSession, isAdminEmail } from '@/lib/session'

export default async function MusicOliAdminPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  if (!isAdminEmail(session.user.email)) redirect('/account')

  const tools = listMusicOliAdminTools()

  return (
    <main className="min-h-svh bg-[#fbfafc] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between rounded-[26px] border border-white bg-white/90 px-4 py-3 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-amber-200">
              <Music2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Music Oli Commander</p>
              <p className="text-xs text-slate-500">Admin connector, capability, cost, and rights console</p>
            </div>
          </div>
          <Link href="/oli" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Hub
          </Link>
        </header>

        <section className="mb-5 rounded-[30px] border border-purple-100 bg-white p-6 shadow-lg shadow-purple-950/5">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Verified Music Commander stack</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                ChatGPT plugin access, local DAWs, open-source engines, consumer music services, and production APIs are tracked as separate capability states. Connected chat access never silently becomes a reusable app credential.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[30px] border border-white bg-white shadow-lg shadow-purple-950/5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tool</th>
                  <th className="px-4 py-3 font-semibold">State</th>
                  <th className="px-4 py-3 font-semibold">Cost</th>
                  <th className="px-4 py-3 font-semibold">Capabilities</th>
                  <th className="px-4 py-3 font-semibold">Production rule</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((tool) => (
                  <tr key={tool.id} className="border-b border-slate-100 align-top last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{tool.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{tool.kind}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-purple-700">{tool.state}</span>
                    </td>
                    <td className="max-w-[260px] px-4 py-4 text-xs leading-5 text-slate-600">{tool.verifiedCost}</td>
                    <td className="max-w-[280px] px-4 py-4 text-xs leading-5 text-slate-600">{tool.capabilities.join(', ')}</td>
                    <td className="max-w-[340px] px-4 py-4 text-xs leading-5 text-slate-600">{tool.productionRule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
