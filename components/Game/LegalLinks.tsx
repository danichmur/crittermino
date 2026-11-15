'use client'

import { useI18n } from '@/components/Locale/LocaleProvider'
import { localizeHref } from '@/lib/locale'
import { SITE } from '@/lib/site'

const linkClass = 'underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#FF6B9D]'

export const LegalLinks = ({ className }: { className?: string }) => {
  const { locale, t } = useI18n()
  const href = (path: string): string => `${SITE.url}${localizeHref(locale, path)}`
  return (
    <p className={className}>
      <a href={href('/privacy')} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t.plusPrivacy}
      </a>
      {' · '}
      <a href={href('/terms')} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {t.plusTerms}
      </a>
    </p>
  )
}
