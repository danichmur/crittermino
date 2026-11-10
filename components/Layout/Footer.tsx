'use client'

import Link from 'next/link'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { localizeHref } from '@/lib/locale'

export const Footer = () => {
  const { locale, t } = useI18n()
  const links = [
    { href: localizeHref(locale, '/how-to-play'), label: t.howToPlay },
    { href: localizeHref(locale, '/daily-challenge'), label: t.daily },
    { href: localizeHref(locale, '/blog'), label: t.blog },
    { href: localizeHref(locale, '/about'), label: t.about },
    { href: localizeHref(locale, '/privacy'), label: t.privacy },
  ] as const
  return (
    <footer className="mt-auto px-4 py-6 text-sm text-[#8C7468]">
      <nav aria-label="Crittermino" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-3 text-center">{t.freeInBrowser}</p>
      <div className="mt-4 flex justify-center">
        <a
          href="https://www.makerhunt.space/projects/crittermino?ref=featured-badge"
          title="crittermino on MakerHunt"
          className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]"
        >
          {/* Raw img so MakerHunt's crawler sees this exact badge URL. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.makerhunt.space/badges/featured-on-light.svg"
            alt="Featured on MakerHunt"
            width={240}
            height={48}
          />
        </a>
      </div>
    </footer>
  )
}
