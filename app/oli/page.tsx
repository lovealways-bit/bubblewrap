import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Activity,
  Bot,
  BookOpen,
  Boxes,
  BrainCircuit,
  Cable,
  ChevronRight,
  CircleDot,
  Database,
  GitBranch,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { listOliHubSurfaces } from '@/lib/oli/hub-surfaces'
import { appProfiles, capabilities, deploymentProjects, repositories } from '@/lib/oli/registry'
import { listOliSpecialistStacks } from '@/lib/oli/specialist-stacks'
import { getSession, isAdminEmail } from '@/lib/session'

const stateOrder = ['LIVE', 'READY', 'PLANNED', 'BLOCKED', 'GRAY'] as const

export default async function OliHubPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  if (!isAdminEmail(session.user.email)) redirect('/account')

  const capabilityCounts = stateOrder.map((state) => ({
    state,
    count: capabilities.filter((item) => item.state === state).length,
  }))
  const hubSurfaces = listOliHubSurfaces()
  const specialistStacks = listOliSpecialistStacks()

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#fbfafc] text-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 15%, rgba(126,34,206,.10) 0 1px, transparent 1.5px), radial-gradient(circle at 82% 20%, rgba(202,138,4,.14) 0 1px, transparent 1.5px), radial-gradient(circle at 60% 72%, rgba(15,23,42,.08) 0 1px, transparent 1.5px)',
          backgroundSize: '42px 42px, 58px 58px, 74px 74px',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-[26px] border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-bold tracking-[0.18em] text-amber-200 ring-1 ring-amber-300/30">
              OLI
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Commander Training Hub</p>
              <p className="truncate text-xs text-slate-500">Bubblewrap · private Manuscript runtime</p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-purple-300 hover:text-purple-700"
          >
            App <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <section className="grid gap-5 py-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="relative overflow-hidden rounded-[34px] border border-white bg-white/90 p-6 shadow-xl shadow-purple-950/5 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-purple-100 to-amber-100 blur-2xl" />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                <Sparkles className="h-3.5 w-3.5" /> Oli is the shared orchestration layer
              </div>
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                One commander brain for every app skin.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">
                Bubblewrap holds Oli’s executable Manuscript, app profiles, specialist modes, capability flags, first-line support router, Commander context, and handoff rules. Upstream governance stays in Mothership and Commander source control.
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <Metric icon={GitBranch} value={repositories.length} label="Repos" />
                <Metric icon={Boxes} value={deploymentProjects.length} label="Vercel builds" />
                <Metric icon={Cable} value={appProfiles.length} label="App profiles" />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <Panel title="Runtime hierarchy" icon={BrainCircuit}>
              <div className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Owner instruction',
                  'Verified live state',
                  'Mothership + Commander governance',
                  'Bubblewrap Manuscript',
                  'App profile + session context',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[11px] font-bold text-purple-700 shadow-sm">{index + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Provider rule" icon={ShieldCheck}>
              <p className="text-sm leading-6 text-slate-600">
                Shared AI and web research are registered as READY, not falsely marked live. Oli routes locally first and only calls an external provider after entitlement, cost, privacy, credentials, and permission are verified.
              </p>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
                No surprise API spend. No browser-side secrets. No cross-app private-data shortcut.
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid gap-5 pb-5 xl:grid-cols-[.9fr_1.1fr]">
          <Panel title="Capability board" icon={Activity}>
            <div className="grid grid-cols-5 gap-2">
              {capabilityCounts.map(({ state, count }) => (
                <div key={state} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xl font-semibold tracking-tight">{count}</p>
                  <p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-slate-500">{state}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {capabilities.slice(0, 8).map((capability) => (
                <div key={capability.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{capability.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{capability.description}</p>
                    </div>
                    <StateBadge state={capability.state} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="App inheritance" icon={Network}>
            <div className="grid gap-3 sm:grid-cols-2">
              {appProfiles.map((profile) => (
                <div key={profile.id} className="group rounded-[24px] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-950/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-amber-200">
                      {profile.supportMode === 'internal' ? <Database className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-purple-700">{profile.supportMode}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold">{profile.name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{profile.domain}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                    <CircleDot className="h-3 w-3" /> {profile.defaultCapabilities.length} default capabilities
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 pb-5 xl:grid-cols-2">
          <Panel title="Commander surfaces" icon={BookOpen}>
            <div className="grid gap-3 sm:grid-cols-2">
              {hubSurfaces.map((surface) => (
                <div key={surface.id} id={surface.id === 'manifesto-scribe' ? 'manifesto' : undefined} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{surface.name}</p>
                    {surface.founderGate ? <StateBadge state="OWNER" /> : null}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{surface.description}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Oli specialist stacks" icon={Layers3}>
            <div className="grid gap-3 sm:grid-cols-2">
              {specialistStacks.map((stack) => (
                <div key={stack.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{stack.shortName}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{stack.mission}</p>
                    </div>
                    <span className="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-purple-700">{stack.defaultDataClass}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mb-5 rounded-[30px] border border-slate-900 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-purple-950/10 sm:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Daily learning loop</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Capture → verify → permission → act → log → feedback → version.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                Operational learning updates prompts, app profiles, runbooks, tests, registries, approved context, and Scribe addendum candidates. It does not silently retrain a third-party model or overwrite approved design source.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Manuscript source</p>
              <p className="mt-1 font-mono text-xs text-amber-200">commander/MANUSCRIPT.md</p>
              <p className="mt-2 text-xs">{specialistStacks.length} specialist modes · {hubSurfaces.length} Commander surfaces</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, value, label }: { icon: typeof GitBranch; value: number; label: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-3 sm:p-4">
      <Icon className="h-4 w-4 text-purple-700" />
      <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof GitBranch; children: React.ReactNode }) {
  return (
    <section className="rounded-[30px] border border-white bg-white/90 p-5 shadow-lg shadow-purple-950/5 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-2xl bg-purple-50 text-purple-700"><Icon className="h-4 w-4" /></span>
        <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function StateBadge({ state }: { state: string }) {
  const className =
    state === 'LIVE'
      ? 'bg-emerald-50 text-emerald-700'
      : state === 'READY'
        ? 'bg-purple-50 text-purple-700'
        : state === 'BLOCKED'
          ? 'bg-rose-50 text-rose-700'
          : 'bg-slate-100 text-slate-600'

  return <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold tracking-[0.12em] ${className}`}>{state}</span>
}
