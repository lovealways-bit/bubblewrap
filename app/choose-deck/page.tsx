import type { Metadata } from 'next'
import { DeckChooser } from '@/components/deck-chooser'

export const metadata: Metadata = {
  title: 'Choose your deck · Lunara Ascension',
}

interface Props {
  searchParams: Promise<{ from?: string }>
}

// Landing step after a membership opens (from /success) or a new account is
// created (from sign-up). The deck choice is stored on the device only.
export default async function ChooseDeckPage({ searchParams }: Props) {
  const { from } = await searchParams
  const welcome =
    from === 'membership'
      ? 'Your membership is open'
      : from === 'signup'
        ? 'Your account is ready'
        : 'Lunara Ascension'

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <DeckChooser welcome={welcome} />
    </main>
  )
}
