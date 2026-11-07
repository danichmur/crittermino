'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface InteractiveTutorialProps {
  message: string | null
  children: ReactNode
  fill?: boolean
}

export const InteractiveTutorial = ({ message, children, fill = false }: InteractiveTutorialProps) => (
  <div className={fill ? 'flex min-h-0 w-full flex-1 flex-col' : 'w-full'}>
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key={message}
          role="status"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mb-2 shrink-0 rounded-2xl bg-white px-4 py-2 text-center text-sm font-medium text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] sm:mb-3 sm:py-3"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
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

export const TutorialHand = () => {
  const reduceMotion = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-1 left-1/2 text-xl"
      initial={{ y: 0 }}
      animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
      transition={{ repeat: Infinity, duration: 1, ease: 'easeOut' }}
    >
      👆
    </motion.span>
  )
}
