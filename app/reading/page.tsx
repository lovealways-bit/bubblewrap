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

export default async function ReadingPage() {
  const session = await getSession()
  const tier = session?.user ? await getUserTier(session.user.id) : null
  const showAds = shouldShowAds(tier)
  const premiumSpreads = tier ? canUsePremiumSpreads(tier) : false

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <Starfield />
      <div className="hidden md:block">
        <SiteHeader />
      </div>
      <div className="hidden h-12 md:block" />
      <ExperienceTabs premiumSpreads={premiumSpreads} />
      {/* Restrained lower-page banner: only initializes for ad-eligible
          (free/signed-out) viewers, and only once real AdSense IDs are
          configured in env. Never shown to a paid member. */}
      <AdSenseSlot
        enabled={showAds}
        slot={process.env.NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT}
        className="mx-auto my-8 max-w-3xl px-5"
      />
      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </main>
  )
}
