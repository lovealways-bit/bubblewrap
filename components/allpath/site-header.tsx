// Canonical AllPath header mirror from aallpathproperties-com, 2026-10-06.
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import './site-header.css'
import './site-header-sun.css'

/**
 * Exactly four public header buttons: two left of the menu art, two right.
 * Universe stays locked and out of the four. COMMANDER is removed (also covered
 * where still painted into the approved header artwork).
 * About is the sun in the header art (desktop) and the first item in the mobile menu.
 */
const links = [
  ['Home', 'https://allpathproperties.com/'],
  ['Solutions', 'https://allpathproperties.com/services'],
  ['Sign In', 'https://allpathproperties.com/find-your-path'],
  ['OLI Atlas Universe', 'https://allpathproperties.com/samples#learning-labs'],
] as const

const mobileLinks = [['About', 'https://allpathproperties.com/about'], ...links] as const

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])
  return (
    <header className={compact ? 'approved-header compact-head' : 'approved-header'}>
      <div className="approved-header-art">
        <img
          src="https://allpathproperties.com/home/header-approved-20260925.png"
          alt="AllPath Education Solutions"
          width={2048}
          height={728}
          fetchPriority="high"
        />
        {/* Plates cover the six labels baked into the artwork (incl. COMMANDER) so only the four live buttons show. */}
        <span aria-hidden="true" className="approved-art-plate plate-left" />
        <span aria-hidden="true" className="approved-art-plate plate-right" />
        <nav aria-label="Main navigation" className="approved-art-nav">
          {links.map(([label, href], i) => (
            <Link
              key={label}
              href={href}
              className={'approved-art-link nav-' + i}
              aria-current={pathname === href.split('#')[0] ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://allpathproperties.com/about"
            className="sun-about"
            aria-label="About AllPath"
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            <span>About</span>
          </Link>
        </nav>
      </div>
      <div className="approved-mobile-bar">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-site-nav" aria-label="Mobile navigation" className="approved-mobile-nav">
          {mobileLinks.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
