import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import {
  getUserTier,
  canUseCustomization,
  canUseCustomDecks,
  canUseJournal,
  canUseCelestial,
} from '@/lib/subscription/entitlements'
import { AccountActions } from '@/components/account-actions'
import { CustomizationForm } from '@/components/customization-form'
import { getCustomizationProfile } from '@/app/actions/customization'

export default async function AccountPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const tier = await getUserTier(session.user.id)
  const isFree = tier.id === 'free'
  const canCustomize = canUseCustomization(tier)
  const canDesignDecks = canUseCustomDecks(tier)
  const canJournal = canUseJournal(tier)
  const canCelestial = canUseCelestial(tier)
  const rawProfile = canCustomize ? await getCustomizationProfile() : null
  const profile = rawProfile
    ? {
        ...rawProfile,
        focusAreas: Array.isArray(rawProfile.focusAreas)
          ? (rawProfile.focusAreas as string[])
          : [],
      }
    : null

  return (
    <main className="min-h-screen bg-background px-5 py-16 text-foreground">
      <section className="mx-auto max-w-2xl">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-gold/70">Your account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-glow-gold">{session.user.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>

        <div className="empire-panel mt-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
                Current membership
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">{tier.name}</h2>
              <p className="mt-1 text-sm italic text-muted-foreground">{tier.tagline}</p>
            </div>
            <span className="font-display text-lg font-bold">{tier.priceLabel}</span>
          </div>

          {isFree ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Ad-supported. Upgrade any time to go ad-free and unlock more of Lunara.
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">Ad-free membership. Thank you.</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="empire-cta h-10 rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em] leading-[2.5rem]"
            >
              {isFree ? 'View plans' : 'Change plan'}
            </Link>
            {!isFree && <AccountActions />}
          </div>
        </div>

        <div className="empire-panel mt-8 p-6">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
            Birth chart & personalization
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">Your chart</h2>
          {canCustomize ? (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Lunara weaves these details into your daily guidance and readings.
              </p>
              <CustomizationForm initial={profile} />
            </>
          ) : (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Personalized, birth-chart-aware readings are part of Lunara Core and above.
              </p>
              <Link
                href="/pricing"
                className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
              >
                Unlock personalization
              </Link>
            </>
          )}
        </div>

        <div className="empire-panel mt-8 p-6">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
            Lunara Atelier
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">
            Design your own deck
          </h2>
          <p className="mt-1 text-sm italic text-muted-foreground">
            {canDesignDecks
              ? 'Paint a custom deck with AI — your style, your palette. Full sets included with your membership.'
              : 'Paint a free preview with AI — your style, your palette. Unlock any deck’s full 78-card set for $5.'}
          </p>
          <Link
            href="/deck-designer"
            className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
          >
            Open the atelier
          </Link>
        </div>

        <div className="empire-panel mt-8 p-6">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
            Moon &amp; Sun Journal
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">
            Your reflections
          </h2>
          {canJournal ? (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                A private journal, every entry stamped with the moon it was written under.
              </p>
              <Link
                href="/journal"
                className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
              >
                Open the journal
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                The private journal is part of Lunara Core and above.
              </p>
              <Link
                href="/pricing"
                className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
              >
                Unlock the journal
              </Link>
            </>
          )}
        </div>

        <div className="empire-panel mt-8 p-6">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
            Celestial Calendar
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-gold-bright">
            The turning sky
          </h2>
          {canCelestial ? (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                Moon phases, eclipses, solstices, and the old sabbats — mapped ahead for you.
              </p>
              <Link
                href="/calendar"
                className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
              >
                View the calendar
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm italic text-muted-foreground">
                The celestial calendar is part of Lunara Core and above.
              </p>
              <Link
                href="/pricing"
                className="empire-cta mt-5 inline-flex h-10 items-center rounded-lg px-5 font-display text-xs uppercase tracking-[0.24em]"
              >
                Unlock the calendar
              </Link>
            </>
          )}
        </div>

        <div className="mt-10">
          <SignOutButton />
        </div>
      </section>
    </main>
  )
}

function SignOutButton() {
  return <AccountActions signOutOnly />
}
