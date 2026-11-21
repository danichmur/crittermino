'use client'

import type { ReactNode } from 'react'

interface InteractiveTutorialProps {
  message: string | null
  children: ReactNode
  fill?: boolean
}

export const InteractiveTutorial = ({ message, children, fill = false }: InteractiveTutorialProps) => (
  <div className={fill ? 'flex min-h-0 w-full flex-1 flex-col' : 'w-full'}>
    {message ? (
      <p
        role="status"
        className="mb-2 shrink-0 rounded-2xl bg-white px-3 py-2 text-center text-sm font-medium leading-snug text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] sm:mb-3 sm:px-4 sm:py-3 [@media(max-height:700px)]:mb-1 [@media(max-height:700px)]:px-2.5 [@media(max-height:700px)]:py-1.5 [@media(max-height:700px)]:text-xs"
      >
        {message}
      </p>
    ) : null}
    {fill ? (
      <div className="flex min-h-0 flex-1 items-center justify-center" style={{ containerType: 'size' }}>
        <div className="aspect-square max-h-full max-w-full" style={{ width: 'min(100cqw, 100cqh)' }}>
          {children}
        </div>
      </div>
    ) : (
      children
    )}
  </div>
)

export const TutorialHand = () => (
  <span aria-hidden="true" className="critter-hand pointer-events-none absolute bottom-1 left-1/2 text-xl will-change-transform">
    👆
  </span>
)
