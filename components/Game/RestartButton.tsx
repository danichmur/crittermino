'use client'

import { useI18n } from '@/components/Locale/LocaleProvider'

interface RestartButtonProps {
  onRestart: () => void
}

export const RestartButton = ({ onRestart }: RestartButtonProps) => {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onRestart}
      aria-label={t.restartLevel}
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#3D2C29] shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D] touch-manipulation"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M17 8.1A6.4 6.4 0 1 1 12 5.6"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <path
          d="M12 3.4 15.4 5.6 12 7.8"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
