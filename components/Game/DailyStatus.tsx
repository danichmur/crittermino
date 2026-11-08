'use client'

import { useEffect } from 'react'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { useProgress } from '@/hooks/useProgress'

export const DailyStatus = ({ utcDate }: { utcDate: string }) => {
  const hydrate = useProgress((state) => state.hydrate)
  const ready = useProgress((state) => state.ready)
  const lastDaily = useProgress((state) => state.progress.lastDaily)
  const { t } = useI18n()
  useEffect(() => {
    hydrate()
  }, [hydrate])
  if (!ready || lastDaily !== utcDate) return null
  return (
    <p className="mt-4 rounded-full bg-white px-3 py-1 text-center text-sm font-medium text-[#1B7A45] ring-1 ring-[#E5D5C0]" role="status">
      {t.clearedDevice}
    </p>
  )
}
