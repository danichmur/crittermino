import Link from 'next/link'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Layout/Footer'
import { Header } from '@/components/Layout/Header'

export interface Crumb {
  href?: string
  label: string
}

interface ContentPageProps {
  crumbs: readonly Crumb[]
  children: ReactNode
}

export const ContentPage = ({ crumbs, children }: ContentPageProps) => (
  <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
    <Header />
    <main className="px-5 pb-10">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#8C7468]">
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.href ? (
                <Link href={crumb.href} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#3D2C29]">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </main>
    <Footer />
  </div>
)
