'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { showRewardedAd } from '@/lib/monetization'
import { useGame } from '@/hooks/useGame'

export const HintAdModal = () => {
  const open = useGame((state) => state.hintAdOpen)
  const closeHintAd = useGame((state) => state.closeHintAd)
  const openPlus = useGame((state) => state.openPlus)
  const grantHintFromAd = useGame((state) => state.grantHintFromAd)
  const showToast = useGame((state) => state.showToast)
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!open) setBusy(false)
  }, [open])
  const handleWatch = async (): Promise<void> => {
    if (busy) return
    setBusy(true)
    const earned = await showRewardedAd()
    setBusy(false)
    if (!earned) {
      showToast(t.plusAdFailed)
      return
    }
    grantHintFromAd()
  }
  return (
    <Modal open={open} title={t.hintAdTitle} dismissable={!busy} onClose={closeHintAd}>
      <h2 className="text-center font-display text-2xl font-bold">{t.hintAdTitle}</h2>
      <p className="mt-2 text-center text-sm text-[#8C7468]">{t.hintAdBody}</p>
      <div className="mt-5 flex flex-col gap-3">
        <Button size="lg" disabled={busy} onClick={() => void handleWatch()}>
          {busy ? t.plusWorking : t.hintWatch}
        </Button>
        <Button variant="secondary" disabled={busy} onClick={openPlus}>
          {t.plusName}
        </Button>
        <Button variant="ghost" disabled={busy} onClick={closeHintAd}>
          {t.hintNotNow}
        </Button>
      </div>
    </Modal>
  )
}
