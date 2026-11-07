import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What Crittermino stores on your device, what it sends, and how to erase it.',
  alternates: { canonical: '/privacy' },
}

const sections = [
  {
    title: 'The short version',
    body: 'Crittermino is a free puzzle in the browser. There is no account, no email signup, and no advertising. Your progress stays on this device. You can erase it yourself.',
  },
  {
    title: 'What stays on this device',
    body: 'The game saves progress in this browser’s local storage: the current level, cleared levels, best scores, hints used, move count, daily streak, the last day you played, and whether sound and haptics are on. A share link encodes a level number, a move count, and a time so someone can open that result. It does not include your name. If you install the game, or visit the live site, the browser may keep a copy of the app on the device so it can open again. That copy is the game, not a profile of you.',
  },
  {
    title: 'What the game sends',
    body: 'When you start a level, finish a level, use a hint, finish the tutorial, or tap share, the page sends a short event to Crittermino. A finished level includes the level number, the move count, and the time. A hint includes the level number. The event has a timestamp. It does not include your name, email, or an account id. The server receives the request and does not store it. We do not sell this data, and we do not use it to build an advertising profile.',
  },
  {
    title: 'Hosting',
    body: 'The live site is hosted on Vercel. Delivering the page means Vercel sees ordinary connection data: IP address, browser type, and the time of the request. We use that only to run and protect the site. We do not combine it with your saved game.',
  },
  {
    title: 'Advertising and cookies',
    body: 'Crittermino does not show ads and does not set advertising or analytics cookies. The game does not use a third-party ad network.',
  },
  {
    title: 'Children',
    body: 'The puzzle is for a general audience. It does not ask for a name, email, or age, and it does not knowingly collect personal information from children.',
  },
  {
    title: 'How to erase your game',
    body: 'Open the menu, then Settings, then Reset progress. That clears levels, streaks, and best scores on this device. You can also clear site data for this site in your browser. Because there is no account, there is no server profile to delete.',
  },
  {
    title: 'Changes',
    body: 'If this policy changes, the new version will be on this page with a new date. The date at the top of this page is the current version.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <Header />
      <main className="px-5 pb-8">
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
        <Link
          href="/"
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#FF6B9D] px-6 font-display text-lg font-semibold text-white shadow-[0_6px_0_#E84B7F]"
        >
          Play Crittermino
        </Link>
      </main>
      <Footer />
    </div>
  )
}
