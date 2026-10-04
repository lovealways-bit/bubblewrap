// Cards held out of production.
//
// A held card is never dealt in a reading, never painted by the custom deck
// builder, and its Classic proof is never shown. The card data and every image
// file stay in the repo, so restoring a card is a one-line change: remove its
// id from this list.
//
// Held 2026-10-04: possible copy of a published deck, pending source check.
export const HELD_CARD_IDS: ReadonlySet<string> = new Set<string>([
  'pentacles-06',
  'pentacles-07',
  'pentacles-08',
  'pentacles-09',
  'wands-08',
  'swords-05',
  'wands-02',
])

export function isCardHeld(cardId: string): boolean {
  return HELD_CARD_IDS.has(cardId)
}
