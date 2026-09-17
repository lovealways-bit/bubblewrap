import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lunara Ascension',
    short_name: 'Lunara',
    description:
      'A moonlit tarot divination sanctuary by AllPath Edu & SynchPathways. Cut the deck and read the path written among your stars.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a0f2e',
    theme_color: '#1a0f2e',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
