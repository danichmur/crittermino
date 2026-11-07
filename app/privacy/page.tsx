import type { Metadata } from 'next'
import { ContentPage } from '@/components/Layout/ContentPage'
import { PlayLink } from '@/components/Layout/PlayLink'
import { pageMeta } from '@/lib/seo'
import { SITE } from '@/lib/site'

export const metadata: Metadata = pageMeta({
  title: 'Privacy policy',
  description: 'What Crittermino stores on your device, what it sends, and how to erase it.',
  path: '/privacy',
})

const sections = [
  {
    title: 'The short version',
    body: 'Crittermino is a free puzzle in the browser. There is no account, no email signup, and no advertising. Your progress stays on this device. Google Analytics counts visits. You can erase the saved game yourself.',
  },
  {
    title: 'What stays on this device',
    body: 'The game saves progress in this browser’s local storage: the current level, cleared levels, best scores, hints used, move count, daily streak, the last day you played, the last daily puzzle you cleared, and whether sound and haptics are on. A share link encodes a level number, a move count, and a time so someone can open that result. It does not include your name. If you install the game, or visit the live site, the browser may keep a copy of the app on the device so it can open again. That copy is the game, not a profile of you.',
  },
  {
    title: 'What the game sends',
    body: 'When you start a level, finish a level, use a hint, finish the tutorial, or tap share, the page sends a short event to Crittermino and to Google Analytics. A finished level includes the level number, the move count, and the time. A hint includes the level number. The event has a timestamp. It does not include your name, email, or an account id. The Crittermino server receives the request and does not store it. We do not sell this data, and we do not use it to build an advertising profile.',
  },
  {
    title: 'Hosting',
    body: 'The live site is hosted on Vercel. Delivering the page means Vercel sees ordinary connection data: IP address, browser type, and the time of the request. We use that only to run and protect the site. We do not combine it with your saved game.',
  },
  {
    title: 'Advertising and cookies',
    body: 'Crittermino does not show ads and does not use an ad network. Google Analytics sets a cookie in this browser so it can count a return visit. Google receives the page address, a rough location, the device and browser type, and the time. It does not receive your name or email. Browser tracking protection, or clearing site data for this site, stops that cookie.',
  },
  {
    title: 'Children',
    body: 'The puzzle is for a general audience. It does not ask for a name, email, or age. A page view can still reach Google Analytics in the same way it does for any other visitor.',
  },
  {
    title: 'How to erase your game',
    body: 'Open the menu, then Settings, then Reset progress. That clears levels, streaks, daily clears, and best scores on this device. Clear site data for this site in the browser to remove the saved game and the Google Analytics cookie. Because there is no account, there is no server profile to delete.',
  },
  {
    title: 'Changes',
    body: 'If this policy changes, the new version will be on this page with a new date. The date at the top of this page is the current version.',
  },
]

export default function PrivacyPage() {
  return (
    <ContentPage crumbs={[{ href: '/', label: 'Home' }, { label: 'Privacy' }]}>
        <h1 className="font-display text-4xl font-bold">Privacy policy</h1>
        <p className="mt-3 text-[#8C7468]">
          This policy covers {SITE.name} at {SITE.url}. Last updated November 7, 2026.
        </p>
        <ul className="mt-6 grid gap-3">
          {sections.map((section) => (
            <li key={section.title} className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
              <h2 className="font-display text-xl font-bold">{section.title}</h2>
              <p className="mt-1 text-sm text-[#8C7468]">{section.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[#8C7468]">
          Questions about this policy:{' '}
          <a href="mailto:affirmeapp@gmail.com" className="font-semibold text-[#3D2C29] underline-offset-4 hover:underline">
            affirmeapp@gmail.com
          </a>
        </p>
        <div className="mt-8">
          <PlayLink>Play Crittermino</PlayLink>
        </div>
    </ContentPage>
  )
}
