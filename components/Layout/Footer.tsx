import Link from 'next/link'

export const Footer = () => (
  <footer className="mt-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-6 text-sm text-[#8C7468]">
    <Link href="/how-to-play" className="underline-offset-4 hover:underline">
      How to play
    </Link>
    <Link href="/privacy" className="underline-offset-4 hover:underline">
      Privacy
    </Link>
    <span>Free in the browser</span>
  </footer>
)
