import type { Metadata } from 'next'
import Link from 'next/link'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { copy, fill } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { localizeHref, playNextHref } from '@/lib/locale'
import { pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

const APPLE_EULA = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'

export const generateMetadata = async (): Promise<Metadata> => {
  const text = copy[await getLocale()]
  return pageMeta({
    title: text.termsMetaTitle,
    description: text.termsMetaDescription,
    path: '/terms',
  })
}

export default async function TermsPage() {
  const locale = await getLocale()
  const text = copy[locale]
  return (
    <ContentPage crumbs={[{ href: '/', label: text.home }, { label: text.termsHeading }]}>
      <h1 className="font-display text-4xl font-bold">{text.termsHeading}</h1>
      <p className="mt-3 text-[#8C7468]">{fill(text.termsIntro, { name: SITE.name, url: SITE.url })}</p>
      <ul className="mt-6 grid gap-3">
        {text.termsSections.map((section) => (
          <li key={section.title} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <h2 className="font-display text-xl font-bold">{section.title}</h2>
            <p className="mt-1 text-sm text-[#8C7468]">{section.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[#8C7468]">
        <Link href={localizeHref(locale, '/privacy')} className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          {text.plusPrivacy}
        </Link>
        {' · '}
        <a href={APPLE_EULA} className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          {text.termsApple}
        </a>
      </p>
      <p className="mt-6 text-sm text-[#8C7468]">
        {text.termsQuestions}{' '}
        <a href="mailto:affirmeapp@gmail.com" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          affirmeapp@gmail.com
        </a>
      </p>
      <div className="mt-8">
        <PlayLink href={playNextHref(locale)}>{text.termsPlay}</PlayLink>
      </div>
    </ContentPage>
  )
}
