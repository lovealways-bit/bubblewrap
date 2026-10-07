'use client'

import { useState } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Check, Share2 } from 'lucide-react'

type AppShareButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  shareTitle?: string
  shareUrl?: string
  showLabel?: boolean
}

async function copyLink(url: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return
  }

  const input = document.createElement('textarea')
  input.value = url
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  input.remove()
}

export function AppShareButton({
  shareTitle,
  shareUrl,
  showLabel = false,
  className = '',
  ...buttonProps
}: AppShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = new URL(shareUrl || window.location.href, window.location.href).toString()
    const title = shareTitle || document.title

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, url })
        return
      }
      await copyLink(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      try {
        await copyLink(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      } catch {
        // Leave the app usable even if a browser blocks both share and clipboard APIs.
      }
    }
  }

  const label = copied ? 'Link copied' : 'Share'

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={() => void handleShare()}
      className={className}
      aria-label={label}
      title={label}
    >
      {copied ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
      <span className={showLabel ? '' : 'sr-only'}>{copied ? 'Copied' : 'Share'}</span>
    </button>
  )
}
