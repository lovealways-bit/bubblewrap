import 'server-only'
import { generateImage } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { put } from '@vercel/blob'

export interface DeckCard {
  id: string
  name: string
  motif: string
}

// A small, curated preview set: the card back plus three iconic faces.
// Free for everyone — the teaser before a $5 full-deck unlock.
export const PREVIEW_CARDS: DeckCard[] = [
  {
    id: 'back',
    name: 'Card Back',
    motif:
      'an ornate symmetrical tarot card back, centered mandala, no figures, no text',
  },
  {
    id: 'the-fool',
    name: 'The Fool',
    motif:
      'The Fool tarot card: a carefree wanderer stepping toward a cliff edge at dawn, a small dog at their heels, a white rose in hand',
  },
  {
    id: 'the-sun',
    name: 'The Sun',
    motif:
      'The Sun tarot card: a radiant sun with a serene face above a child on a white horse, sunflowers and a garden wall',
  },
  {
    id: 'the-moon',
    name: 'The Moon',
    motif:
      'The Moon tarot card: a luminous moon between two towers, a winding path rising from water, a wolf and a dog howling',
  },
]

// The 22 Major Arcana, in order. These carry the strongest imagery in any
// deck and anchor the paid full set.
const MAJOR_ARCANA: DeckCard[] = [
  { id: 'the-fool', name: 'The Fool', motif: 'The Fool: a carefree wanderer stepping toward a cliff edge at dawn, a small dog at their heels, a white rose in hand' },
  { id: 'the-magician', name: 'The Magician', motif: 'The Magician: a figure with one arm raised to the sky and one to the earth, an infinity symbol overhead, tools of the four suits on a table' },
  { id: 'the-high-priestess', name: 'The High Priestess', motif: 'The High Priestess: a serene veiled woman seated between two pillars, a crescent moon at her feet, a scroll in her lap' },
  { id: 'the-empress', name: 'The Empress', motif: 'The Empress: a crowned mother figure on a cushioned throne in a lush wheat field, a heart-shaped shield, abundant nature' },
  { id: 'the-emperor', name: 'The Emperor', motif: 'The Emperor: a commanding ruler on a stone throne carved with rams, holding an ankh scepter, barren mountains behind' },
  { id: 'the-hierophant', name: 'The Hierophant', motif: 'The Hierophant: a religious teacher raising a blessing hand between two pillars, two acolytes kneeling, crossed keys' },
  { id: 'the-lovers', name: 'The Lovers', motif: 'The Lovers: a man and woman beneath a radiant angel, a tree of flames and a tree of fruit, a bright sun above' },
  { id: 'the-chariot', name: 'The Chariot', motif: 'The Chariot: an armored victor in a canopied chariot drawn by two sphinxes, a walled city behind, starry canopy' },
  { id: 'strength', name: 'Strength', motif: 'Strength: a calm woman gently closing the jaws of a lion, an infinity symbol above her head, flowers in her hair' },
  { id: 'the-hermit', name: 'The Hermit', motif: 'The Hermit: a robed elder alone on a snowy peak holding a glowing lantern with a six-pointed star, a staff in hand' },
  { id: 'wheel-of-fortune', name: 'Wheel of Fortune', motif: 'Wheel of Fortune: a great cosmic wheel inscribed with symbols in the sky, a sphinx atop, creatures at the four corners' },
  { id: 'justice', name: 'Justice', motif: 'Justice: a crowned figure seated between two pillars holding an upright sword and balanced scales' },
  { id: 'the-hanged-man', name: 'The Hanged Man', motif: 'The Hanged Man: a serene figure suspended upside down by one foot from a living T-cross, a radiant halo around the head' },
  { id: 'death', name: 'Death', motif: 'Death: a skeletal rider in black armor on a pale horse carrying a black banner with a white rose, a dawning sun between towers' },
  { id: 'temperance', name: 'Temperance', motif: 'Temperance: a winged angel pouring liquid between two cups, one foot on land and one in water, an iris path to a crown of light' },
  { id: 'the-devil', name: 'The Devil', motif: 'The Devil: a horned figure on a black pedestal above two loosely chained figures, an inverted torch, shadowy cavern' },
  { id: 'the-tower', name: 'The Tower', motif: 'The Tower: a tall tower struck by lightning and crowned with flame, two figures falling, dark stormy sky' },
  { id: 'the-star', name: 'The Star', motif: 'The Star: a kneeling figure by a pool pouring water from two vessels beneath one great star and seven small stars' },
  { id: 'the-moon', name: 'The Moon', motif: 'The Moon: a luminous moon between two towers, a winding path rising from water, a wolf and a dog howling, a crayfish emerging' },
  { id: 'the-sun', name: 'The Sun', motif: 'The Sun: a radiant sun with a serene face above a child on a white horse, sunflowers and a garden wall' },
  { id: 'judgement', name: 'Judgement', motif: 'Judgement: an angel blowing a trumpet from the clouds as figures rise with arms uplifted from below' },
  { id: 'the-world', name: 'The World', motif: 'The World: a dancing figure wrapped in a violet cloth within a great laurel wreath, the four living creatures in the corners' },
]

const SUITS: { id: string; name: string; imagery: string }[] = [
  { id: 'wands', name: 'Wands', imagery: 'flowering wooden staffs, warm fire energy, desert and green sprouts, ambition' },
  { id: 'cups', name: 'Cups', imagery: 'ornate golden chalices, flowing water, emotion and love, soft light' },
  { id: 'swords', name: 'Swords', imagery: 'gleaming steel swords, stormy sky, wind, intellect and conflict' },
  { id: 'pentacles', name: 'Pentacles', imagery: 'golden coins each engraved with a five-pointed pentacle star, gardens, earth and prosperity' },
]

const RANKS: { id: string; name: string; scene: (suit: string) => string }[] = [
  { id: 'ace', name: 'Ace', scene: (s) => `a single ${s} offered by a hand emerging from a glowing cloud` },
  { id: '02', name: 'Two', scene: (s) => `two ${s} in a balanced, classic Rider-Waite composition` },
  { id: '03', name: 'Three', scene: (s) => `three ${s} arranged in a classic Rider-Waite scene` },
  { id: '04', name: 'Four', scene: (s) => `four ${s} in a contemplative classic Rider-Waite scene` },
  { id: '05', name: 'Five', scene: (s) => `five ${s} in a scene of struggle or loss, classic Rider-Waite` },
  { id: '06', name: 'Six', scene: (s) => `six ${s} in a harmonious classic Rider-Waite scene` },
  { id: '07', name: 'Seven', scene: (s) => `seven ${s} in a scene of choice or challenge, classic Rider-Waite` },
  { id: '08', name: 'Eight', scene: (s) => `eight ${s} in a scene of movement or mastery, classic Rider-Waite` },
  { id: '09', name: 'Nine', scene: (s) => `nine ${s} in a near-complete classic Rider-Waite scene` },
  { id: '10', name: 'Ten', scene: (s) => `ten ${s} in a scene of culmination, classic Rider-Waite` },
  { id: 'page', name: 'Page', scene: (s) => `a youthful Page standing and holding a single one of the ${s}` },
  { id: 'knight', name: 'Knight', scene: (s) => `a Knight on horseback bearing a single one of the ${s}` },
  { id: 'queen', name: 'Queen', scene: (s) => `a Queen enthroned holding a single one of the ${s}` },
  { id: 'king', name: 'King', scene: (s) => `a King enthroned holding a single one of the ${s}` },
]

function buildMinorArcana(): DeckCard[] {
  const cards: DeckCard[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `${suit.id}-${rank.id}`,
        name: `${rank.name} of ${suit.name}`,
        motif: `${rank.name} of ${suit.name} tarot card: ${rank.scene(suit.name.toLowerCase())}, ${suit.imagery}`,
      })
    }
  }
  return cards
}

// The complete 78-card deck (22 Major + 56 Minor Arcana), in traditional order.
export const FULL_DECK_CARDS: DeckCard[] = [...MAJOR_ARCANA, ...buildMinorArcana()]
export const FULL_DECK_SIZE = FULL_DECK_CARDS.length

export interface PreviewStyle {
  name: string
  stylePrompt: string
  palette: string[]
  borderStyle: string
}

const IMAGE_MODEL = 'bytedance/seedream-4.0'

function buildPrompt(motif: string, style: PreviewStyle) {
  const palette = style.palette.filter(Boolean).join(', ')
  return [
    `Tarot card illustration. ${motif}.`,
    `Art style: ${style.stylePrompt || 'mystical, richly detailed, painterly'}.`,
    palette ? `Color palette: ${palette}.` : '',
    `Card border: ${style.borderStyle || 'thin ornamental frame'}.`,
    'Vertical portrait orientation, full scene fills the card, nothing cropped, single card, no text overlay, no watermark.',
  ]
    .filter(Boolean)
    .join(' ')
}

export interface GeneratedCard {
  cardId: string
  cardName: string
  pathname: string
}

// Generates art for the given cards and stores each image in private Blob
// under the deck's folder. Returns the stored pathnames (served through
// /api/file). Used for both the free preview and paid full-deck batches.
export async function generateDeckCards(
  deckId: string,
  style: PreviewStyle,
  cards: DeckCard[],
): Promise<GeneratedCard[]> {
  return Promise.all(
    cards.map(async (card) => {
      const { image } = await generateImage({
        model: gateway.imageModel(IMAGE_MODEL),
        prompt: buildPrompt(card.motif, style),
        size: '1024x1536',
      })

      const blob = await put(
        `custom-decks/${deckId}/${card.id}.png`,
        Buffer.from(image.uint8Array),
        { access: 'private', contentType: 'image/png', addRandomSuffix: false },
      )

      return { cardId: card.id, cardName: card.name, pathname: blob.pathname }
    }),
  )
}

// Convenience wrapper for the free 4-card preview.
export function generateDeckPreview(deckId: string, style: PreviewStyle) {
  return generateDeckCards(deckId, style, PREVIEW_CARDS)
}
