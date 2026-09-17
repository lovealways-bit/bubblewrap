import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Braces, Cable, GitBranch, LockKeyhole, ServerCog } from 'lucide-react'
import { appProfiles, capabilities, deploymentProjects, repositories } from '@/lib/oli/registry'
import { getSession, isAdminEmail } from '@/lib/session'

function isDeveloperEmail(email: string | null | undefined) {
  if (!email || !isAdminEmail(email)) return false
  const developers = (process.env.DEVELOPER_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  return developers.includes(email.toLowerCase())
}

export default async function OliDeveloperPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  if (!isDeveloperEmail(session.user.email)) redirect('/account')

  return (
    <main className="min-h-svh bg-[#0d0b12] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between rounded-[26px] border border-white/10 bg-white/5 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-purple-500/15 text-purple-200">
              <Braces className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Oli Developer Diagnostics</p>
              <p className="text-xs text-slate-400">Developer-only runtime and source state</p>
            </div>
          </div>
          <Link href="/oli" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Hub
          </Link>
        </header>

        <div className="mb-5 rounded-[28px] border border-rose-300/20 bg-rose-300/5 p-5">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 text-rose-200" />
            <div>
              <p className="text-sm font-semibold">Never customer-facing</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Raw diagnostics, provider configuration state, internal source maps, repository traces, secret names, debugging output, and deployment internals stay outside customer responses and public navigation.
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={GitBranch} label="Repositories" value={repositories.length} />
          <Metric icon={ServerCog} label="Deployments" value={deploymentProjects.length} />
          <Metric icon={Cable} label="App profiles" value={appProfiles.length} />
          <Metric icon={Braces} label="Capabilities" value={capabilities.length} />
        </section>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof GitBranch; label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <Icon className="h-5 w-5 text-purple-200" />
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  )
}
