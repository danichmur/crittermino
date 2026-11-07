'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { useGame } from '@/hooks/useGame'

export const HintAdModal = () => {
  const open = useGame((state) => state.hintAdOpen)
  const closeHintAd = useGame((state) => state.closeHintAd)
  const grantHintFromAd = useGame((state) => state.grantHintFromAd)
  const [seconds, setSeconds] = useState(3)
  useEffect(() => {
    if (!open) return
    setSeconds(3)
  }, [open])
  useEffect(() => {
    if (!open || seconds <= 0) return
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [open, seconds])
  return (
    <Modal open={open} title="Hint ad" onClose={closeHintAd}>
      <p className="text-center text-3xl" aria-hidden="true">
        📺
      </p>
      <h2 className="mt-2 text-center font-display text-2xl font-bold">Watch an ad for a hint</h2>
      <p className="mt-2 text-center text-sm text-[#8C7468]">
        Placeholder only. A real ad would play here. You still get three free hints on every level.
      </p>
      <div className="mt-4 flex min-h-16 items-center justify-center rounded-2xl border border-dashed border-[#E5D5C0] bg-white text-sm text-[#8C7468]">
        {seconds > 0 ? `Ad placeholder · ${seconds}` : 'Ad finished'}
      </div>
      <Button className="mt-4 w-full" size="lg" disabled={seconds > 0} onClick={grantHintFromAd}>
        {seconds > 0 ? `Claim hint in ${seconds}` : 'Claim hint'}
      </Button>
    </Modal>
  )
}
