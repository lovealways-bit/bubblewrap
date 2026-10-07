import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getSession } from '@/lib/session'

function safeNext(value: string | string[] | undefined) {
  const next = typeof value === 'string' ? value : null
  return next && next.startsWith('/') && !next.startsWith('//') ? next : null
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const params = await searchParams
  const nextPath = safeNext(params.next)
  const session = await getSession()
  if (session?.user) redirect(nextPath ?? '/account')
  return (
    <main className="cosmic-nebula flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="sign-up" nextPath={nextPath} />
    </main>
  )
}
