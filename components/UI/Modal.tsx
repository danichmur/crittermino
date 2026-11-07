'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  title: string
  onClose?: () => void
  children: ReactNode
  dismissable?: boolean
}

export const Modal = ({ open, title, onClose, children, dismissable = true }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && dismissable) onClose?.()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')].filter(
        (element) => !element.hasAttribute('disabled'),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [open, dismissable, onClose])
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="modal"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-end justify-center px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] outline-none sm:items-center sm:p-3"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 12, pointerEvents: 'none' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <button
            type="button"
            aria-label={dismissable ? 'Close dialog' : undefined}
            className="absolute inset-0 bg-[#3D2C29]/40"
            onClick={dismissable ? onClose : undefined}
            tabIndex={dismissable ? 0 : -1}
          />
          <div
            className={cn(
              'relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#FFF9F0] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl',
            )}
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
