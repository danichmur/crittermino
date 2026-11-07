import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Inter } from 'next/font/google'
import Script from 'next/script'
import { PwaRegister } from '@/components/PwaRegister'
import { SITE } from '@/lib/site'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? 'ME_z96Lpp2-19c7gS86OGz5VsS8jQzyni37dDuvBlCg'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: '%s · Crittermino' },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  manifest: '/manifest.json',
  alternates: { canonical: '/' },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'default' },
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    images: ['/og-image.png'],
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${SITE.analyticsId}');`}
        </Script>
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
