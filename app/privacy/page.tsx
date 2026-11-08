import type { Metadata } from 'next'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { copy, fill } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const generateMetadata = async (): Promise<Metadata> => {
  const text = copy[await getLocale()]
  return pageMeta({
    title: text.privacyMetaTitle,
    description: text.privacyMetaDescription,
    path: '/privacy',
  })
}

export default async function PrivacyPage() {
  const text = copy[await getLocale()]
  return (
    <ContentPage crumbs={[{ href: '/', label: text.home }, { label: text.privacy }]}>
      <h1 className="font-display text-4xl font-bold">{text.privacyHeading}</h1>
      <p className="mt-3 text-[#8C7468]">{fill(text.privacyIntro, { name: SITE.name, url: SITE.url })}</p>
      <ul className="mt-6 grid gap-3">
        {text.privacySections.map((section) => (
          <li key={section.title} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
            <h2 className="font-display text-xl font-bold">{section.title}</h2>
            <p className="mt-1 text-sm text-[#8C7468]">{section.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-[#8C7468]">
        {text.privacyQuestions}{' '}
        <a href="mailto:affirmeapp@gmail.com" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
          affirmeapp@gmail.com
        </a>
      </p>
      <div className="mt-8">
        <PlayLink>{text.privacyPlay}</PlayLink>
      </div>
    </ContentPage>
  )
}
