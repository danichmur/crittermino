'use client'

import { useI18n } from '@/components/Locale/LocaleProvider'

interface HintButtonProps {
  onHint: () => void
}

export const HintButton = ({ onHint }: HintButtonProps) => {
  const { t } = useI18n()
  return (
  <button
    type="button"
    onClick={onHint}
    aria-label={t.hint}
    className="relative flex h-9 min-w-9 items-center justify-center rounded-2xl bg-white px-2 text-lg shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D] touch-manipulation [@media(min-height:760px)]:h-11 [@media(min-height:760px)]:min-w-11 [@media(min-height:760px)]:px-3 [@media(min-height:760px)]:text-xl"
  >
    <span aria-hidden="true">💡</span>
  </button>
  )
}
