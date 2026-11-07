'use client'

interface HintButtonProps {
  hintsUsed: number
  onHint: () => void
}

export const HintButton = ({ hintsUsed, onHint }: HintButtonProps) => {
  const freeLeft = Math.max(0, 3 - hintsUsed)
  return (
    <button
      type="button"
      onClick={onHint}
      aria-label={freeLeft > 0 ? `Hint, ${freeLeft} free left` : 'Watch an ad for a hint'}
      className="relative flex h-11 min-w-11 items-center justify-center rounded-2xl bg-white px-3 text-xl shadow-sm ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D] touch-manipulation"
    >
      <span aria-hidden="true">💡</span>
      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF6B9D] px-1 text-[10px] font-bold text-white tabular-nums">
        {freeLeft > 0 ? freeLeft : 'Ad'}
      </span>
    </button>
  )
}
