'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { createBillingPortal } from '@/app/actions/subscription'

interface Props {
  signOutOnly?: boolean
}

export function AccountActions({ signOutOnly }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function openBillingPortal() {
    setLoading(true)
    try {
      const url = await createBillingPortal()
      if (url) window.location.href = url
    } catch {
      // No billing account yet — nothing to open.
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (signOutOnly) {
    return (
      <button
        onClick={handleSignOut}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        Sign out
      </button>
    )
  }

  return (
    <button
      onClick={openBillingPortal}
      disabled={loading}
      className="h-10 rounded-lg border border-gold/50 bg-gold/10 px-5 font-display text-xs uppercase tracking-[0.24em] text-gold-bright transition-colors hover:bg-gold/20 disabled:opacity-60"
    >
      {loading ? 'Opening…' : 'Manage billing'}
    </button>
  )
}
