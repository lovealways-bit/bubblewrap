'use client'

import { useState } from 'react'
import { Crown } from 'lucide-react'
import type { DrawnCard, TarotCard as TarotCardData } from '@/lib/tarot/types'
import { hasProof, proofSrc, hasSummerCourtVariant, summerCourtSrc } from '@/lib/tarot/proofs'
import { type DeckThemeId, getDeckTheme, hasThemeArt, themeArtSrc, themeBackSrc } from '@/lib/tarot/decks'
import { SuitEmblem } from './suit-emblem'
import { Wings } from './wings'

const ROMAN = [
  'O', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
]

const PIP = ['', 'Ace', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'Page', 'Knight', 'Queen', 'King']
const WORD = ['', 'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

const SUIT_META: Record<string, { glow: string; element: string; suitName: string; face: string }> = {
  wands: {
    glow: 'rgba(232,145,45,0.45)',
    element: 'Ignum',
    suitName: 'Wands',
    face: 'radial-gradient(circle at 50% 36%, rgba(232,145,45,0.42), transparent 64%), linear-gradient(160deg, #2a1836, #1c1132)',
  },
  cups: {
    glow: 'rgba(63,214,200,0.4)',
    element: 'Aquum',
    suitName: 'Cups',
    face: 'radial-gradient(circle at 50% 36%, rgba(63,214,200,0.38), transparent 64%), linear-gradient(160deg, #14283c, #191030)',
  },
  swords: {
    glow: 'rgba(122,110,232,0.45)',
    element: 'Aerum',
    suitName: 'Swords',
    face: 'radial-gradient(circle at 50% 36%, rgba(122,110,232,0.42), transparent 64%), linear-gradient(160deg, #241a46, #150f2b)',
  },
  pentacles: {
    glow: 'rgba(79,211,154,0.4)',
    element: 'Terrum',
    suitName: 'Pentacles',
    face: 'radial-gradient(circle at 50% 36%, rgba(79,211,154,0.38), transparent 64%), linear-gradient(160deg, #12302b, #16132e)',
  },
  major: {
    glow: 'rgba(200,130,235,0.5)',
    element: 'Arcanum',
    suitName: 'Major Arcana',
    face: 'radial-gradient(circle at 50% 34%, rgba(210,140,240,0.42), transparent 62%), linear-gradient(160deg, #2c1a4a, #1a0f2e)',
  },
}

function rankLabel(drawn: DrawnCard): string {
  const { card } = drawn
  if (card.arcana === 'major') return ROMAN[card.number] ?? String(card.number)
  return PIP[card.number] ?? String(card.number)
}

function CornerFlourishes() {
  const corner = (
    <svg viewBox="0 0 40 40" className="h-full w-full" fill="none" aria-hidden="true">
      <path d="M2 14 Q2 2 14 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 18 Q6 6 18 6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
      <circle cx="4" cy="4" r="1.4" fill="currentColor" />
    </svg>
  )
  return (
    <div className="pointer-events-none absolute inset-1.5 z-20 text-gold/70">
      <span className="absolute left-0 top-0 h-5 w-5">{corner}</span>
      <span className="absolute right-0 top-0 h-5 w-5 -scale-x-100">{corner}</span>
      <span className="absolute bottom-0 left-0 h-5 w-5 -scale-y-100">{corner}</span>
      <span className="absolute bottom-0 right-0 h-5 w-5 -scale-100">{corner}</span>
    </div>
  )
}

function WingedEmblem({
  suit,
  emblemSize,
  wingW,
}: {
  suit?: TarotCardData['suit']
  emblemSize: string
  wingW: string
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Wings
        className={`pointer-events-none absolute left-1/2 top-1/2 ${wingW} max-w-none -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-[0_0_8px_rgba(242,201,76,0.25)]`}
      />
      <SuitEmblem suit={suit} className={`relative ${emblemSize}`} />
    </div>
  )
}

function PipHost({
  card,
  isMajor,
  isCourt,
  pipCount,
}: {
  card: TarotCardData
  isMajor: boolean
  isCourt: boolean
  pipCount: number
}) {
  if (pipCount > 0) {
    const emblemSize = pipCount <= 3 ? 'h-12 w-12' : pipCount <= 6 ? 'h-9 w-9' : 'h-7 w-7'
    const wingW = pipCount <= 3 ? 'w-24' : pipCount <= 6 ? 'w-16' : 'w-12'
    const maxW = pipCount <= 3 ? 'max-w-[12rem]' : 'max-w-[13rem]'
    return (
      <div className={`flex flex-wrap items-center justify-center gap-x-1 gap-y-2 ${maxW}`}>
        {Array.from({ length: pipCount }).map((_, i) => (
          <WingedEmblem key={i} suit={card.suit} emblemSize={emblemSize} wingW={wingW} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-1">
      {isCourt && <Crown className="h-5 w-5 text-gold-bright" />}
      <WingedEmblem suit={isMajor ? undefined : card.suit} emblemSize="h-16 w-16" wingW="w-44" />
    </div>
  )
}

function CardArt({
  card,
  isMajor,
  isCourt,
  pipCount,
  reversed,
  summerCourt,
}: {
  card: TarotCardData
  isMajor: boolean
  isCourt: boolean
  pipCount: number
  reversed: boolean
  summerCourt: boolean
}) {
  const [failed, setFailed] = useState(false)
  const artSrc = summerCourt && hasSummerCourtVariant(card.id) ? summerCourtSrc(card.id) : card.imageRef
  const showImage = artSrc && !failed
  void reversed

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-md">
      {showImage ? (
        <img
          src={artSrc || '/placeholder.svg'}
          alt={`${card.name} illustration`}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
          onError={() => setFailed(true)}
        />
      ) : (
        <PipHost card={card} isMajor={isMajor} isCourt={isCourt} pipCount={pipCount} />
      )}
    </div>
  )
}

interface Props {
  drawn: DrawnCard
  positionLabel: string
  onReveal: () => void
  onSelect?: () => void
  selected?: boolean
  compact?: boolean
  deckTheme?: DeckThemeId
}

export function TarotCard({
  drawn,
  positionLabel,
  onReveal,
  onSelect,
  selected = false,
  compact = false,
  deckTheme = getDeckTheme(null).id,
}: Props) {
  const { card, orientation, revealed } = drawn
  const isReversed = orientation === 'reversed'
  const isMajor = card.arcana === 'major'
  const isCourt = !isMajor && card.number >= 11
  const pipCount = !isMajor && card.number <= 10 ? card.number : 0
  const meta = SUIT_META[card.suit ?? 'major']
  const numeral = isMajor || isCourt ? rankLabel(drawn) : WORD[pipCount] ?? String(pipCount)
  const themeLabel = card.theme ?? card.keywords[0]
  const showSummerCourt = Boolean(drawn.blonde) && hasSummerCourtVariant(card.id) && deckTheme === 'classic'
  const themedArt = hasThemeArt(deckTheme, card.id)
  const proof = (themedArt || hasProof(card.id)) && !showSummerCourt
  const proofImageSrc = themedArt ? themeArtSrc(deckTheme, card.id) : proofSrc(card.id)

  const handleClick = () => {
    if (!revealed) onReveal()
    else onSelect?.()
  }

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <span
        className={`font-display uppercase tracking-[0.3em] text-gold/80 ${
          compact ? 'text-[0.55rem] leading-tight' : 'text-xs tracking-[0.35em]'
        }`}
      >
        {positionLabel}
      </span>

      <button
        type="button"
        onClick={handleClick}
        aria-label={
          revealed ? `${card.name}, ${orientation}. Select to read.` : `Reveal ${positionLabel} card`
        }
        aria-pressed={revealed ? selected : false}
        className={`perspective group relative aspect-[2/3] w-full cursor-pointer rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold ${
          compact ? 'max-w-[8.5rem]' : 'max-w-[18rem]'
        } ${
          selected
            ? 'ring-2 ring-gold shadow-[0_0_26px_-4px_var(--gold)]'
            : revealed
              ? 'hover:ring-1 hover:ring-gold/50'
              : ''
        }`}
      >
        <div
          className={`preserve-3d relative h-full w-full transition-transform duration-700 ${
            revealed ? 'rotate-y-180' : ''
          }`}
        >
          {themeBackSrc(deckTheme) ? (
            <div className="backface-hidden absolute inset-0 overflow-hidden rounded-xl bg-black">
              <img
                src={themeBackSrc(deckTheme) || '/placeholder.svg'}
                alt="Card back"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          ) : (
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-xl border border-gold/40 bg-surface">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 42%, rgba(120,72,190,0.55), transparent 62%)',
              }}
            />
            <div className="absolute inset-[6px] rounded-lg border border-gold/25" />
            <CornerFlourishes />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 p-3 text-gold">
              <EmblemBack compact={compact} />
              {!compact && (
                <span className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-gold/70">
                  Lunara
                </span>
              )}
            </div>
          </div>
          )}

          {proof ? (
            <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-xl bg-black">
              <img
                src={proofImageSrc || '/placeholder.svg'}
                alt={`${card.name}${isReversed ? ', reversed' : ''}`}
                className={`h-full w-full object-cover ${isReversed ? 'rotate-180' : ''}`}
                crossOrigin="anonymous"
              />
              {isReversed && (
                <span className="absolute left-2 top-2 rounded-full border border-teal/60 bg-black/50 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-[0.15em] text-teal">
                  R
                </span>
              )}
            </div>
          ) : (
          <div
            className="backface-hidden rotate-y-180 absolute inset-0 overflow-hidden rounded-xl"
            style={{ background: meta.face, boxShadow: `inset 0 0 40px -12px ${meta.glow}` }}
          >
            <div className="absolute inset-0 rounded-xl border-2 border-gold/70" />
            <div className="absolute inset-[5px] rounded-lg border border-gold/25" />
            <CornerFlourishes />
            <div
              className={`relative flex h-full flex-col items-center ${
                compact ? 'gap-1 p-2.5' : 'gap-1.5 p-3.5'
              }`}
            >
              <div className="flex w-full items-center justify-center">
                {isReversed && (
                  <span className="absolute left-2.5 rounded-full border border-teal/50 px-1 text-[0.45rem] uppercase tracking-[0.15em] text-teal">
                    R
                  </span>
                )}
                <span
                  className={`font-display font-semibold leading-none text-gold-bright text-glow-gold ${
                    compact ? 'text-sm' : 'text-lg tracking-[0.15em]'
                  }`}
                >
                  {numeral}
                </span>
              </div>
              <div className="relative w-full flex-1 overflow-hidden rounded-md border border-gold/50 bg-black/30">
                <CardArt
                  card={card}
                  isMajor={isMajor}
                  isCourt={isCourt}
                  pipCount={pipCount}
                  reversed={isReversed}
                  summerCourt={showSummerCourt}
                />
              </div>
              <div className="w-full text-center">
                <h3
                  className={`font-display uppercase leading-tight text-gold-bright text-balance ${
                    compact ? 'text-[0.62rem]' : 'text-base tracking-[0.06em]'
                  }`}
                >
                  {card.name}
                </h3>
                {!compact && (
                  <p className="mt-0.5 font-display text-[0.55rem] uppercase tracking-[0.3em] text-gold/70">
                    {themeLabel}
                  </p>
                )}
              </div>
              <div
                className={`flex w-full items-center justify-center overflow-hidden border-t border-gold/20 pt-1 uppercase text-gold/60 ${
                  compact ? 'gap-0.5 text-[0.4rem] tracking-[0.08em]' : 'gap-1 text-[0.45rem] tracking-[0.12em]'
                }`}
              >
                {card.keywords.slice(0, 3).map((k, i) => (
                  <span key={k} className="flex items-center gap-1 whitespace-nowrap">
                    {i > 0 && <span className="text-gold/35">·</span>}
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>
      </button>
    </div>
  )
}

function EmblemBack({ compact }: { compact: boolean }) {
  const [failed, setFailed] = useState(false)
  const size = compact ? 'h-14 w-14' : 'h-24 w-24'
  if (failed) {
    return (
      <SuitEmblem
        className={`opacity-95 transition-transform duration-500 group-hover:rotate-45 ${
          compact ? 'h-9 w-9' : 'h-16 w-16'
        }`}
      />
    )
  }
  return (
    <img
      src="/cards/card-back-sunflower-compass.png"
      alt="Lunara emblem"
      className={`${size} object-contain drop-shadow-[0_0_12px_rgba(242,201,76,0.35)] transition-transform duration-500 group-hover:scale-105`}
      crossOrigin="anonymous"
      onError={() => setFailed(true)}
    />
  )
}
