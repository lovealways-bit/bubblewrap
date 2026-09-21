import { redirect } from 'next/navigation'
import { EntranceHero } from '@/components/entrance-hero'
import { getSession } from '@/lib/session'

export default async function Page() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  return <EntranceHero />
}
