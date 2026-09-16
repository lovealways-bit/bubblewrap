// Full-card design proofs supplied by the deck artist.
//
// Each entry is a card ID whose printed proof (gold frame, title, and keywords
// already baked into the image) lives at `/cards/proofs/<id>.png`. When a card
// is listed here, the app renders that image as the ENTIRE card face and draws
// none of its own frame, numeral, title, theme, or keyword footer over it — so
// the artist's design is used exactly as delivered, right side up.
//
// This set is intentionally empty until proofs are dropped in. Add each card ID
// here as its `/cards/proofs/<id>.png` file is added.
export const PROOF_CARD_IDS = new Set<string>([
  // Wands (full suit)
  'wands-01', 'wands-02', 'wands-03', 'wands-04', 'wands-05', 'wands-06', 'wands-07',
  'wands-08', 'wands-09', 'wands-10', 'wands-11', 'wands-12', 'wands-13', 'wands-14',
  // Swords (full suit)
  'swords-01', 'swords-02', 'swords-03', 'swords-04', 'swords-05', 'swords-06', 'swords-07',
  'swords-08', 'swords-09', 'swords-10', 'swords-11', 'swords-12', 'swords-13', 'swords-14',
  // Cups (full suit)
  'cups-01', 'cups-02', 'cups-03', 'cups-04', 'cups-05', 'cups-06', 'cups-07',
  'cups-08', 'cups-09', 'cups-10', 'cups-11', 'cups-12', 'cups-13', 'cups-14',
  // Pentacles (full suit)
  'pentacles-01', 'pentacles-02', 'pentacles-03', 'pentacles-04', 'pentacles-05', 'pentacles-06', 'pentacles-07',
  'pentacles-08', 'pentacles-09', 'pentacles-10', 'pentacles-11', 'pentacles-12', 'pentacles-13', 'pentacles-14',
  // Major Arcana (proofs delivered so far; XVI-XXI still pending)
  'major-00', 'major-01', 'major-02', 'major-03', 'major-04', 'major-05', 'major-06',
  'major-07', 'major-08', 'major-09', 'major-10', 'major-11',
  'major-12', 'major-13', 'major-14', 'major-15',
])

export function hasProof(cardId: string): boolean {
  return PROOF_CARD_IDS.has(cardId)
}

export function proofSrc(cardId: string): string {
  return `/cards/proofs/${cardId}.png`
}

// Blonde-haired variant art (illustration only, no baked frame/text). These are
// generated alternates for figure-driven cards, referencing the blonde figures
// already present in the delivered proofs (e.g. the Two of Cups, Six of Cups,
// and Queen of Swords). At draw time each card is randomly flagged blonde; the
// renderer swaps in this illustration inside the app's gold frame only when the
// card has a variant listed here. Non-figure cards are intentionally excluded.
export const BLONDE_VARIANT_IDS = new Set<string>([
  // Court figures — one prominent person whose hair reads clearly
  'wands-11', 'wands-12', 'wands-13', 'wands-14',
  'cups-11', 'cups-12', 'cups-13', 'cups-14',
  'swords-11', 'swords-12', 'swords-13', 'swords-14',
  'pentacles-11', 'pentacles-12', 'pentacles-13', 'pentacles-14',
  // Figure-driven Major Arcana
  'major-00', 'major-01', 'major-02', 'major-03', 'major-04', 'major-05',
  'major-08', 'major-09', 'major-11',
  // The Devil (major-15) already features a prominent blonde figure in its
  // proof, so it is intentionally excluded here.
  'major-12', 'major-13', 'major-14',
])

export function hasBlondeVariant(cardId: string): boolean {
  return BLONDE_VARIANT_IDS.has(cardId)
}

export function blondeSrc(cardId: string): string {
  return `/cards/blonde/${cardId}.png`
}
