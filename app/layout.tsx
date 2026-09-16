import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Cormorant_Garamond, Noto_Sans_Runic } from 'next/font/google'
import { InstallPrompt } from '@/components/install-prompt'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cinzel',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

const runic = Noto_Sans_Runic({
  subsets: ['runic'],
  weight: '400',
  variable: '--font-runic',
})

export const metadata: Metadata = {
  title: 'Lunara Ascension · AllPath Edu',
  description:
    'Lunara Ascension — a moonlit tarot divination sanctuary by AllPath Edu & SynchPathways. Cut the deck and read the path written among your stars.',
  generator: 'v0.app',
  applicationName: 'Lunara Ascension',
  appleWebApp: {
    capable: true,
    title: 'Lunara',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a0f2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${runic.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
        <InstallPrompt />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
