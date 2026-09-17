import 'server-only'
import { generateImage } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { put } from '@vercel/blob'

// A small, curated preview set: the card back plus three iconic faces.
// Full 78-card generation is deferred to an on-demand job later.
export const PREVIEW_CARDS = [
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
] as const

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

export interface GeneratedPreviewCard {
  cardId: string
  cardName: string
  pathname: string
}

/**
 * Generates the preview card set and stores each image in private Blob.
 * Returns the stored pathnames (served later through /api/file).
 */
export async function generateDeckPreview(
  deckId: string,
  style: PreviewStyle,
): Promise<GeneratedPreviewCard[]> {
  const results = await Promise.all(
    PREVIEW_CARDS.map(async (card) => {
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

      return {
        cardId: card.id,
        cardName: card.name,
        pathname: blob.pathname,
      }
    }),
  )

  return results
}
