import type { Metadata } from 'next'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { JsonLd } from '@/components/Seo/JsonLd'
import { breadcrumbJsonLd, pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

const title = 'About Crittermino'
const description =
  'Crittermino is a browser Fillomino. The puzzle was published by Nikoli in 1994. Here the region sizes are animal homes.'

export const metadata: Metadata = pageMeta({
  title,
  description,
  path: '/about',
  keywords: ['fillomino game', 'crittermino', 'nikoli fillomino'],
})

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
] as const

export default function AboutPage() {
  return (
    <ContentPage crumbs={crumbs.map((crumb) => ({ href: crumb.path === '/about' ? undefined : crumb.path, label: crumb.name }))}>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: title,
          url: `${SITE.url}/about`,
          description,
          isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
        }}
      />
      <h1 className="font-display text-4xl font-bold">About the game</h1>
      <p className="mt-3 leading-relaxed text-[#8C7468]">
        Crittermino is Fillomino played with animal homes. The rules are older than this site. The animals are how the sizes stay easy to remember.
      </p>
      <section className="mt-8" aria-labelledby="fillomino-history">
        <h2 id="fillomino-history" className="font-display text-2xl font-bold">
          Where Fillomino comes from
        </h2>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">
          Fillomino first appeared in 1994, in volume 47 of Puzzle Communication Nikoli. A reader writing under the name すらんた (Suranta) suggested it. The Japanese name フィルオミノ joins the English words “fill” and “polyomino”: you fill the grid with polyominoes, and every cell of a piece shows how many cells that piece has.
        </p>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">
          It grew out of an earlier Nikoli idea, Firumatto, where the pieces were straight 1×n rectangles and pieces of the same length could not touch. Fillomino keeps the “same size stays apart” rule and lets the shape bend, as long as the cells share sides.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#8C7468]">
          That history is written up by{' '}
          <a
            href="https://www.gmpuzzles.com/blog/fillomino-rules-and-info/"
            className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            Grandmaster Puzzles
          </a>{' '}
          and the{' '}
          <a
            href="https://wpcunofficial.miraheze.org/wiki/Fillomino"
            className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            World Puzzle Championship wiki
          </a>
          . The genre also has a page on{' '}
          <a
            href="https://www.puzzles.wiki/wiki/Fillomino"
            className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline"
            rel="noreferrer"
          >
            Puzzles Wiki
          </a>
          .
        </p>
      </section>
      <section className="mt-8" aria-labelledby="why-animals">
        <h2 id="why-animals" className="font-display text-2xl font-bold">
          Why the numbers became animals
        </h2>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">
          In a printed Fillomino, a 4 means “this region has four cells.” Crittermino uses a dog for that same fact. Mouse is 2, cat is 3, dog is 4, panda is 5, and lion is 6. You still fill every cell. A home still has to be the right size and connected edge to edge. Two homes of the same size still cannot share a wall.
        </p>
        <p className="mt-3 leading-relaxed text-[#3D2C29]">
          The campaign has 300 levels. The same level number is the same puzzle for everyone, and each one has a single solution. Levels 1 to 5 teach the rules. After that the grids grow from 5×5 to 7×7. Progress stays on your device. There is no account. The{' '}
          <a href="/daily-challenge" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
            daily challenge
          </a>{' '}
          is one of those campaign grids, shared for the UTC day, and clearing it does not skip you ahead.
        </p>
      </section>
      <div className="mt-8">
        <PlayLink>Play Crittermino</PlayLink>
      </div>
    </ContentPage>
  )
}
