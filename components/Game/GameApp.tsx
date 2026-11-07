'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComingSoon } from '@/components/Game/ComingSoon'
import { GameScreen } from '@/components/Game/GameScreen'
import { HomeScreen } from '@/components/Game/HomeScreen'
import { LevelSelect } from '@/components/Game/LevelSelect'
import { LEVEL_CAP } from '@/lib/campaign'
import { useGame } from '@/hooks/useGame'
import { useProgress } from '@/hooks/useProgress'

export const GameApp = () => {
  const hydrate = useProgress((state) => state.hydrate)
  const ready = useProgress((state) => state.ready)
  const view = useGame((state) => state.view)
  const toast = useGame((state) => state.toast)
  const startLevel = useGame((state) => state.startLevel)
  const showSoon = useGame((state) => state.showSoon)
  const claimedNext = useRef(false)
  useEffect(() => {
    hydrate()
  }, [hydrate])
  useEffect(() => {
    if (!ready || claimedNext.current) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('play') !== 'next') return
    claimedNext.current = true
    window.history.replaceState(null, '', '/')
    const progress = useProgress.getState().progress
    if (progress.completedLevels.includes(LEVEL_CAP)) {
      showSoon()
      return
    }
    startLevel(Math.min(LEVEL_CAP, Math.max(1, progress.currentLevel)))
  }, [ready, showSoon, startLevel])
  return (
    <>
      {view === 'home' ? <HomeScreen /> : null}
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
