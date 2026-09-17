import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Archive, ArrowLeft, ImageIcon, LockKeyhole, Sparkles } from 'lucide-react'
import { getSession, isAdminEmail } from '@/lib/session'

const closetRules = [
  'Approved originals are preserved. New uploads enter as candidates or explicit new versions.',
  'A downstream app receives only the approved assets authorized for that app and surface.',
  'Oli never substitutes a new mascot, stock image, or redesigned visual for a founder-approved asset.',
  'Customer-facing users never receive Design Closet administration, raw source files, internal notes, or unpublished candidates.',
  'Every promoted asset records source, version, approval state, target apps, and rollback reference.',
]

export default async function DesignClosetPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  if (!isAdminEmail(session.user.email)) redirect('/account')

  return (
    <main className="min-h-svh bg-[#fbfafc] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-center justify-between rounded-[26px] border border-white bg-white/90 px-4 py-3 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-amber-200">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Design Closet</p>
              <p className="text-xs text-slate-500">Admin-only approved design authority</p>
            </div>
          </div>
          <Link href="/oli" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Hub
          </Link>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-xl shadow-purple-950/5 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
              <Sparkles className="h-3.5 w-3.5" /> Founder-controlled visual source
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">One closet. Versioned originals. No silent redesign.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              The Design Closet is the private source shelf for approved art, logos, frames, product skins, icons, and design-system references. It supports controlled reuse without exposing internal source material to customers.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ClosetCard icon={ImageIcon} title="Approved Assets" text="Current approved images, logos, UI frames, and product skin references." />
              <ClosetCard icon={Archive} title="Version History" text="Prior approved versions, candidates, rejected revisions, and rollback targets." />
              <ClosetCard icon={LockKeyhole} title="Target Permissions" text="Which app, role, customer surface, or campaign may inherit each asset." />
              <ClosetCard icon={Sparkles} title="Oli Skin Rules" text="The exact approved Oli character stays consistent while product skins and placement can vary." />
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-900 bg-slate-950 p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">Closet law</p>
            <div className="mt-5 space-y-3">
              {closetRules.map((rule, index) => (
                <div key={rule} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold text-amber-200">{index + 1}</span>
                  <p className="text-xs leading-5 text-slate-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ClosetCard({ icon: Icon, title, text }: { icon: typeof Archive; title: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-purple-700" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  )
}
