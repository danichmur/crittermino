import Link from 'next/link'
import type { ReactNode } from 'react'

interface PlayLinkProps {
  href?: string
  children: ReactNode
}

export const PlayLink = ({ href = '/', children }: PlayLinkProps) => (
  <Link
    href={href}
    className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#FF6B9D] px-6 font-display text-lg font-semibold text-white shadow-[0_6px_0_#E84B7F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B9D]"
  >
    {children}
  </Link>
)
