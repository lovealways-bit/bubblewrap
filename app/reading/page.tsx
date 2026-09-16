import { ExperienceTabs } from '@/components/experience-tabs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Starfield } from '@/components/starfield'

export default function ReadingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <Starfield />
      <SiteHeader />
      <div className="h-12" />
      <ExperienceTabs />
      <SiteFooter />
    </main>
  )
}
