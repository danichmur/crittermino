import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShareScreen } from '@/components/Game/ShareScreen'
import { copy } from '@/lib/i18n'
import { getLocale } from '@/lib/locale-server'
import { decodeShareCode, sharePageUrl, shareSentence } from '@/lib/share-code'
import { SITE } from '@/lib/site'

interface SharePageProps {
  params: Promise<{ code: string }>
}

const readScore = async (params: SharePageProps['params']) => {
  const { code } = await params
  return { code, score: decodeShareCode(code) }
}

export const generateMetadata = async ({ params }: SharePageProps): Promise<Metadata> => {
  const { code, score } = await readScore(params)
  const locale = await getLocale()
  const text = copy[locale]
  if (!score) return { title: { absolute: text.scoreNotFound }, robots: { index: false, follow: false } }
  const sentence = shareSentence(score, locale)
  return {
    title: { absolute: sentence },
    description: `${sentence} ${text.shareNext}`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/share/${code}` },
    openGraph: {
      title: sentence,
      description: text.shareShared,
      url: sharePageUrl(code),
      siteName: SITE.name,
      images: ['/og-image.png'],
      type: 'website',
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { score } = await readScore(params)
  if (!score) notFound()
  return <ShareScreen score={score} />
}
