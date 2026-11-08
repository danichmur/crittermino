'use client'

import { ANIMALS } from '@/lib/animals'
import { LEVEL_CAP } from '@/lib/campaign'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { fill } from '@/lib/i18n'
import { Button } from '@/components/UI/Button'
import { useGame } from '@/hooks/useGame'

export const ComingSoon = () => {
  const showHome = useGame((state) => state.showHome)
  const showLevels = useGame((state) => state.showLevels)
  const { t } = useI18n()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 pt-[max(1.5rem,env(safe-area-inset-top))] pb-8 text-center">
      <div className="flex gap-2 text-4xl" aria-hidden="true">
        {ANIMALS.map((animal) => (
          <span key={animal.emoji}>{animal.emoji}</span>
        ))}
      </div>
      <p className="mt-6 text-sm font-semibold tracking-wide text-[#E84B7F] uppercase">{fill(t.capCleared, { n: LEVEL_CAP })}</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-[#3D2C29]">{t.comingSoon}</h1>
      <p className="mt-3 max-w-xs text-base text-[#8C7468]">{t.comingBody}</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
        <Button size="lg" onClick={showLevels}>
          {t.levelSelect}
        </Button>
        <Button variant="secondary" onClick={showHome}>
          {t.home}
        </Button>
      </div>
    </div>
  )
}
