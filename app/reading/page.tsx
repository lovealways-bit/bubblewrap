import { ExperienceTabs } from '@/components/experience-tabs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Starfield } from '@/components/starfield'
import { AdSenseSlot } from '@/components/adsense-slot'
import { getSession } from '@/lib/session'
import {
  getUserTier,
  shouldShowAds,
  canUsePremiumSpreads,
} from '@/lib/subscription/entitlements'
import { redirect } from 'next/navigation'

export default async function ReadingPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const tier = session?.user ? await getUserTier(session.user.id) : null
  const showAds = shouldShowAds(tier)
  const premiumSpreads = tier ? canUsePremiumSpreads(tier) : false

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Starfield />
      <SiteHeader />
      <div className="h-12" />
      <ExperienceTabs premiumSpreads={premiumSpreads} />
      {/* Restrained lower-page banner: only initializes for ad-eligible
          (free/signed-out) viewers, and only once real AdSense IDs are
          configured in env. Never shown to a paid member. */}
      <AdSenseSlot
        enabled={showAds}
        slot={process.env.NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT}
        className="mx-auto my-8 max-w-3xl px-5"
      />
      <SiteFooter />
    </main>
  )
}
