'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mascot } from '@/components/Brand/Mascot'
import { ComingSoon } from '@/components/Game/ComingSoon'
import { GameScreen } from '@/components/Game/GameScreen'
import { HomeScreen } from '@/components/Game/HomeScreen'
import { LevelSelect } from '@/components/Game/LevelSelect'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { LEVEL_CAP } from '@/lib/campaign'
import { IS_PORTAL_BUILD } from '@/lib/platform'
import { useGame } from '@/hooks/useGame'
import { useProgress } from '@/hooks/useProgress'

export const GameApp = () => {
  const hydrate = useProgress((state) => state.hydrate)
  const ready = useProgress((state) => state.ready)
  const view = useGame((state) => state.view)
  const toast = useGame((state) => state.toast)
  const startLevel = useGame((state) => state.startLevel)
  const startDaily = useGame((state) => state.startDaily)
  const showSoon = useGame((state) => state.showSoon)
  const { t } = useI18n()
  const claimedLaunch = useRef(false)
  const [booted, setBooted] = useState(!IS_PORTAL_BUILD)
  useEffect(() => {
    hydrate()
  }, [hydrate])
  useEffect(() => {
    if (!ready || claimedLaunch.current) return
    const params = new URLSearchParams(window.location.search)
    const play = params.get('play')
    const openSavedLevel = (): void => {
      const progress = useProgress.getState().progress
      if (progress.completedLevels.includes(LEVEL_CAP)) {
        showSoon()
        return
      }
      startLevel(Math.min(LEVEL_CAP, Math.max(1, progress.currentLevel)))
    }
    if (play === 'next' || play === 'daily') {
      claimedLaunch.current = true
      window.history.replaceState(null, '', '/')
      if (play === 'daily') startDaily()
      else openSavedLevel()
      setBooted(true)
      return
    }
    if (!IS_PORTAL_BUILD) return
    claimedLaunch.current = true
    openSavedLevel()
    setBooted(true)
  }, [ready, showSoon, startDaily, startLevel])
  return (
    <>
      {IS_PORTAL_BUILD && !booted ? (
        <div className="flex h-dvh flex-col items-center justify-center gap-3">
          <Mascot className="h-28 w-28" />
          <p className="font-display text-xl font-bold">{t.folding}</p>
        </div>
      ) : null}
      {view === 'home' && booted ? <HomeScreen /> : null}
      {view === 'levels' ? <LevelSelect /> : null}
      {view === 'play' ? <GameScreen /> : null}
      {view === 'soon' ? <ComingSoon /> : null}
      <AnimatePresence>
        {toast ? (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[#3D2C29] px-4 py-2 text-sm text-white shadow-lg"
          >
            {toast}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  )
}
