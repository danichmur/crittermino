'use client'

import Link from 'next/link'
import { useI18n } from '@/components/Locale/LocaleProvider'

export const Footer = () => {
  const { t } = useI18n()
  const links = [
    { href: '/how-to-play', label: t.howToPlay },
    { href: '/daily-challenge', label: t.daily },
    { href: '/blog', label: t.blog },
    { href: '/about', label: t.about },
    { href: '/privacy', label: t.privacy },
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
    </footer>
  )
}
