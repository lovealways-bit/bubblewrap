'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'
import { saveConsent } from '@/app/actions/consent'
import { ensureTestViewerAccount } from '@/app/actions/test-viewer'

interface Props {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: Props) {
  const router = useRouter()
  const isSignUp = mode === 'sign-up'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [personalization, setPersonalization] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewerLoading, setViewerLoading] = useState(false)

  async function handleTestViewer() {
    setError(null)
    setViewerLoading(true)
    try {
      const { email: viewerEmail, password: viewerPassword } = await ensureTestViewerAccount()
      const { error } = await signIn.email({ email: viewerEmail, password: viewerPassword })
      if (error) {
        setError('Could not open the test viewer right now. Please try again.')
        return
      }
      router.push('/account')
      router.refresh()
    } catch {
      setError('Could not open the test viewer right now. Please try again.')
    } finally {
      setViewerLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (isSignUp && !acceptTerms) {
      setError('Please accept the Terms and acknowledge the Privacy Notice to continue.')
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await signUp.email({ email, password, name })
        if (error) {
          setError('Could not create your account. Try a different email.')
          return
        }
        await saveConsent({
          dataPersonalization: personalization,
          dataAnalytics: analytics,
          marketingEmails: marketing,
          acceptedTerms: acceptTerms,
        }).catch(() => {})
      } else {
        const { error } = await signIn.email({ email, password })
        if (error) {
          setError('Incorrect email or password.')
          return
        }
      }
      router.push('/account')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="empire-panel w-full max-w-md p-8">
      <h1 className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-gold-bright text-glow-gold">
        {isSignUp ? 'Join the Sanctuary' : 'Return to the Sanctum'}
      </h1>
      <p className="mt-2 text-sm italic text-muted-foreground">
        {isSignUp
          ? 'Create an account to save readings, personalize your path, and design your own deck.'
          : 'Sign in to reach your readings, decks, and consults.'}
      </p>

      <div className="mt-7 flex flex-col gap-4">
        {isSignUp && (
          <Field label="Name">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="lunara-input"
              autoComplete="name"
              placeholder="Your name"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="lunara-input"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="lunara-input"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
          />
        </Field>

        {isSignUp && (
          <fieldset className="mt-1 flex flex-col gap-2.5 rounded-lg border border-border/70 bg-background/30 p-4">
            <legend className="px-1 font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
              Your data, your choice
            </legend>
            <Consent
              checked={personalization}
              onChange={setPersonalization}
              label="Use my details to personalize readings and recommendations"
            />
            <Consent
              checked={analytics}
              onChange={setAnalytics}
              label="Allow anonymous analytics to improve the sanctuary"
            />
            <Consent
              checked={marketing}
              onChange={setMarketing}
              label="Send me occasional guidance and offers by email"
            />
            <Consent
              checked={acceptTerms}
              onChange={setAcceptTerms}
              required
              label={
                <>
                  I agree to the{' '}
                  <Link href="/terms" className="text-gold-bright underline underline-offset-4">
                    Terms of Use
                  </Link>
                  , acknowledge the{' '}
                  <Link href="/privacy" className="text-gold-bright underline underline-offset-4">
                    Privacy Notice
                  </Link>
                  , and understand that recurring purchases are also governed by the{' '}
                  <Link href="/subscription-terms" className="text-gold-bright underline underline-offset-4">
                    Subscription Terms
                  </Link>
                  .
                </>
              }
            />
          </fieldset>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={loading} className="empire-cta mt-6 h-11 w-full rounded-lg font-display text-xs uppercase tracking-[0.28em] disabled:opacity-60">
        {loading ? 'One moment…' : isSignUp ? 'Create account' : 'Sign in'}
      </button>

      {!isSignUp && (
        <>
          <div className="mt-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/60">
            <span className="h-px flex-1 bg-border/60" />
            <span>or</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <button
            type="button"
            onClick={handleTestViewer}
            disabled={viewerLoading}
            className="mt-5 h-11 w-full rounded-lg border border-gold/40 bg-gold/5 font-display text-xs uppercase tracking-[0.24em] text-gold-bright transition-colors hover:bg-gold/10 disabled:opacity-60"
          >
            {viewerLoading ? 'Opening test viewer…' : 'Continue as test viewer'}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            A shared demo account on the Free plan — no signup required, for exploring the app only.
          </p>
        </>
      )}

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already initiated?' : 'New to the sanctuary?'}{' '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="text-gold-bright underline-offset-4 hover:underline"
        >
          {isSignUp ? 'Sign in' : 'Create an account'}
        </Link>
      </p>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/70">
        {label}
      </span>
      {children}
    </label>
  )
}

function Consent({
  checked,
  onChange,
  label,
  required,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: ReactNode
  required?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground/85">
      <input
        type="checkbox"
        checked={checked}
        required={required}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[var(--gold)]"
      />
      <span className="leading-snug">{label}</span>
    </label>
  )
}
