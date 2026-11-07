import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShareScreen } from '@/components/Game/ShareScreen'
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
  if (!score) return { title: 'Score not found', robots: { index: false, follow: false } }
  const sentence = shareSentence(score)
  return {
    title: sentence,
    description: `${sentence} Play your own next puzzle.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/share/${code}` },
    openGraph: {
      title: sentence,
      description: 'A shared Crittermino score. The next puzzle is yours.',
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
