import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Inter, Nunito } from 'next/font/google'
import Script from 'next/script'
import { LocaleProvider } from '@/components/Locale/LocaleProvider'
import { PwaRegister } from '@/components/PwaRegister'
import { copy } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { SITE } from '@/lib/site'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin', 'latin-ext'], variable: '--font-fredoka' })
const nunito = Nunito({ subsets: ['latin', 'cyrillic'], variable: '--font-nunito' })
const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter' })

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? 'ME_z96Lpp2-19c7gS86OGz5VsS8jQzyni37dDuvBlCg'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale()
  const text = copy[locale]
  return {
  metadataBase: new URL(SITE.url),
  title: { default: text.metaTitle, template: '%s · Crittermino' },
  description: text.metaDescription,
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
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={`${fredoka.variable} ${nunito.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.analyticsId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${SITE.analyticsId}');`}
        </Script>
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        <PwaRegister />
      </body>
    </html>
  )
}
