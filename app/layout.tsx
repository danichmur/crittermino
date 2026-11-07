import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Inter } from 'next/font/google'
import { PwaRegister } from '@/components/PwaRegister'
import { SITE } from '@/lib/site'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'default' },
  openGraph: {
    title: 'Crittermino - Brain Logic Puzzle',
    description: 'Addictive logic puzzle with cute animals. Free to play!',
    images: ['/og-image.png'],
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crittermino - Brain Logic Puzzle',
    description: 'Addictive logic puzzle with cute animals. Free to play!',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Crittermino',
  url: SITE.url,
  description: SITE.description,
  genre: 'Puzzle',
  playMode: 'SinglePlayer',
  gamePlatform: 'Web Browser',
  applicationCategory: 'Game',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
