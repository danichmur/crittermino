import Link from 'next/link'

const LINKS = [
  { href: '/how-to-play', label: 'How to play' },
  { href: '/daily-challenge', label: 'Daily' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
] as const

export const Footer = () => (
  <footer className="mt-auto px-4 py-6 text-sm text-[#8C7468]">
    <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
    <p className="mt-3 text-center">Free in the browser</p>
  </footer>
)
