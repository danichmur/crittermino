import { GameApp } from '@/components/Game/GameApp'
import { JsonLd } from '@/components/Seo/JsonLd'
import { getLocale } from '@/lib/locale-server'
import { homeJsonLd } from '@/lib/seo'

export default async function HomePage() {
  const locale = await getLocale()
  return (
    <>
      {homeJsonLd(locale).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
      <GameApp />
    </>
  )
}
