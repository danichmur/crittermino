import { GameApp } from '@/components/Game/GameApp'
import { JsonLd } from '@/components/Seo/JsonLd'
import { homeJsonLd } from '@/lib/seo'

export default function HomePage() {
  return (
    <>
      {homeJsonLd().map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
      <GameApp />
    </>
  )
}
