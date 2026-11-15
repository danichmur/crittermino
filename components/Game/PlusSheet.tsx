'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { useI18n } from '@/components/Locale/LocaleProvider'
import {
  PLUS_PRODUCTS,
  loadPlusProducts,
  purchasePlus,
  restorePlus,
  setPlus,
  type PlusPlan,
  type PlusProduct,
} from '@/lib/monetization'
import { useGame } from '@/hooks/useGame'
import { usePlus } from '@/hooks/usePlus'
import { LegalLinks } from '@/components/Game/LegalLinks'

const PLANS: readonly PlusPlan[] = ['yearly', 'monthly', 'weekly']

const fallbackPrice = (plan: PlusPlan, prices: { yearly: string; monthly: string; weekly: string }): string => prices[plan]

export const PlusSheet = () => {
  const open = useGame((state) => state.plusOpen)
  const closePlus = useGame((state) => state.closePlus)
  const showToast = useGame((state) => state.showToast)
  const plus = usePlus()
  const { t } = useI18n()
  const [plan, setPlan] = useState<PlusPlan>('yearly')
  const [products, setProducts] = useState<PlusProduct[]>([])
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!open) return
    let cancelled = false
    void loadPlusProducts().then((loaded) => {
      if (!cancelled) setProducts(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [open])
  const prices = { yearly: t.plusYearlyPrice, monthly: t.plusMonthlyPrice, weekly: t.plusWeeklyPrice }
  const labels = { yearly: t.plusYearly, monthly: t.plusMonthly, weekly: t.plusWeekly }
  const priceFor = (choice: PlusPlan): string => {
    const match = products.find((product) => product.productId === PLUS_PRODUCTS[choice])
    return match?.displayPrice || fallbackPrice(choice, prices)
  }
  const finish = (active: boolean): void => {
    if (!active) return
    const grantHint = useGame.getState().hintAdOpen
    setPlus(true)
    useGame.setState({ plusOpen: false, hintAdOpen: false, plusNudge: false })
    if (grantHint) useGame.getState().grantHintFromAd()
  }
  const handlePurchase = async (): Promise<void> => {
    if (busy) return
    setBusy(true)
    const result = await purchasePlus(plan)
    setBusy(false)
    if (result === 'active') {
      finish(true)
      return
    }
    if (result === 'pending') showToast(t.plusPending)
    if (result === 'failed') showToast(t.plusPurchaseFailed)
  }
  const handleRestore = async (): Promise<void> => {
    if (busy) return
    setBusy(true)
    const active = await restorePlus()
    setBusy(false)
    if (!active) {
      showToast(t.plusPurchaseFailed)
      return
    }
    finish(true)
    showToast(t.plusRestored)
  }
  return (
    <Modal open={open} title={t.plusName} dismissable={!busy} onClose={closePlus}>
      <h2 className="font-display text-2xl font-bold">{t.plusName}</h2>
      <p className="mt-2 text-sm text-[#8C7468]">{t.plusBody}</p>
      {plus ? <p className="mt-4 font-display text-lg font-bold text-[#E84B7F]">{t.plusActive}</p> : null}
      {plus ? null : (
        <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label={t.plusName}>
          {PLANS.map((choice) => {
            const selected = plan === choice
            return (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={busy}
                onClick={() => setPlan(choice)}
                className={
                  selected
                    ? 'flex min-h-14 items-center justify-between rounded-2xl bg-white px-4 text-left ring-2 ring-[#FF6B9D]'
                    : 'flex min-h-14 items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0]'
                }
              >
                <span>
                  <span className="block font-display font-semibold">{labels[choice]}</span>
                  {choice === 'yearly' ? <span className="text-sm text-[#8C7468]">{t.plusTrial}</span> : null}
                </span>
                <span className="text-right">
                  <span className="block font-semibold tabular-nums">{priceFor(choice)}</span>
                  {choice === 'yearly' ? <span className="text-xs font-semibold text-[#E84B7F]">{t.plusBestValue}</span> : null}
                </span>
              </button>
            )
          })}
        </div>
      )}
      {plus ? null : (
        <Button className="mt-4 w-full" size="lg" disabled={busy} onClick={() => void handlePurchase()}>
          {busy ? t.plusWorking : plan === 'yearly' ? t.plusStartTrial : t.plusContinue}
        </Button>
      )}
      <Button className="mt-3 w-full" variant="secondary" disabled={busy} onClick={() => void handleRestore()}>
        {t.plusRestore}
      </Button>
      {plus ? null : <p className="mt-3 text-center text-xs text-[#8C7468]">{t.plusRenews}</p>}
      <LegalLinks className="mt-2 text-center text-xs text-[#8C7468]" />
    </Modal>
  )
}
