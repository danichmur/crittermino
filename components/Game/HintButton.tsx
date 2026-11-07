'use client'

interface HintButtonProps {
  onHint: () => void
}

export const HintButton = ({ onHint }: HintButtonProps) => (
  <button
    type="button"
    onClick={onHint}
    aria-label="Hint"
    className="relative flex h-11 min-w-11 items-center justify-center rounded-2xl bg-white px-3 text-xl shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D] touch-manipulation"
  >
    <span aria-hidden="true">💡</span>
  </button>
)
