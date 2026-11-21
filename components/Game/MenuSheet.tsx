'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LanguageChoices } from '@/components/Locale/LanguageMenu'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { Mascot } from '@/components/Brand/Mascot'
import { Button } from '@/components/UI/Button'
import { LEVEL_CAP } from '@/lib/campaign'
import { utcDateString } from '@/lib/daily'
import { STORE_MONETIZATION } from '@/lib/monetization'
import { IS_APP_SHELL, IS_IOS_APP, IS_PORTAL_BUILD } from '@/lib/platform'
import { Modal } from '@/components/UI/Modal'
import { useGame } from '@/hooks/useGame'
import { usePlus } from '@/hooks/usePlus'
import { useProgress } from '@/hooks/useProgress'
import { LegalLinks } from '@/components/Game/LegalLinks'

export const MenuSheet = () => {
  const open = useGame((state) => state.menuOpen)
  const closeMenu = useGame((state) => state.closeMenu)
  const showLevels = useGame((state) => state.showLevels)
  const showHome = useGame((state) => state.showHome)
  const startDaily = useGame((state) => state.startDaily)
  const showToast = useGame((state) => state.showToast)
  const openSettings = useGame((state) => state.openSettings)
  const { t } = useI18n()
  const startLevel = useGame((state) => state.startLevel)
  const handleDaily = (): void => {
    const progress = useProgress.getState().progress
    if (!progress.tutorialCompleted) {
      closeMenu()
      showToast(t.dailyNeedsLesson)
      startLevel(Math.min(LEVEL_CAP, Math.max(1, progress.currentLevel)))
      return
    }
    const finishedToday = progress.lastDaily === utcDateString()
    if (finishedToday) {
      closeMenu()
      showToast(t.dailyDoneToday)
      return
    }
    startDaily()
  }
  const linkClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 font-display font-semibold text-[#3D2C29] ring-1 ring-[#E5D5C0]'
  return (
    <Modal open={open} title={t.menu} onClose={closeMenu}>
      <div className="flex items-center gap-3">
        <Mascot className="h-11 w-11" />
        <h2 className="font-display text-2xl font-bold">{t.menu}</h2>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={closeMenu}>{t.continue}</Button>
        {IS_APP_SHELL ? (
          <Button variant="secondary" onClick={handleDaily}>
            {t.dailyPuzzle}
          </Button>
        ) : null}
        <Button variant="secondary" onClick={showLevels}>
          {t.levelSelect}
        </Button>
        {IS_APP_SHELL ? null : (
          <>
            <Link href="/how-to-play" onClick={closeMenu} className={linkClass}>
              {t.howToPlay}
            </Link>
            <Link href="/daily-challenge" onClick={closeMenu} className={linkClass}>
              {t.dailyPuzzle}
            </Link>
            <Link href="/blog" onClick={closeMenu} className={linkClass}>
              {t.blog}
            </Link>
            <Link href="/about" onClick={closeMenu} className={linkClass}>
              {t.about}
            </Link>
            <Link href="/privacy" onClick={closeMenu} className={linkClass}>
              {t.privacy}
            </Link>
          </>
        )}
        <Button variant="secondary" onClick={openSettings}>
          {t.settings}
        </Button>
        <Button variant="ghost" onClick={showHome}>
          {t.home}
        </Button>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-[#E5D5C0]">
        <p className="font-display font-semibold">{t.moreAnimals}</p>
        <p className="mt-1 text-sm text-[#8C7468]">{t.moreAnimalsBody}</p>
        <Button className="mt-3" variant="secondary" disabled>
          {t.unlockAnimals}
        </Button>
      </div>
    </Modal>
  )
}

export const SettingsDialog = () => {
  const open = useGame((state) => state.settingsOpen)
  const closeSettings = useGame((state) => state.closeSettings)
  const soundEnabled = useProgress((state) => state.progress.soundEnabled)
  const hapticsEnabled = useProgress((state) => state.progress.hapticsEnabled)
  const setSound = useProgress((state) => state.setSound)
  const setHaptics = useProgress((state) => state.setHaptics)
  const reset = useProgress((state) => state.reset)
  const showHome = useGame((state) => state.showHome)
  const startLevel = useGame((state) => state.startLevel)
  const [confirmReset, setConfirmReset] = useState(false)
  const plus = usePlus()
  const openPlus = useGame((state) => state.openPlus)
  const { t } = useI18n()
  return (
    <Modal open={open} title={t.settings} onClose={closeSettings}>
      <div className="flex items-center gap-3">
        <Mascot className="h-11 w-11" />
        <h2 className="font-display text-2xl font-bold">{t.settings}</h2>
      </div>
      <div className="mt-4">
        <p className="mb-2 font-display font-semibold">{t.language}</p>
        <LanguageChoices />
      </div>
      {IS_IOS_APP && STORE_MONETIZATION ? (
        <button
          type="button"
          onClick={() => {
            closeSettings()
            openPlus()
          }}
          className="mt-4 flex min-h-11 w-full items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0] focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          <span className="font-display font-semibold">{t.plusName}</span>
          <span className="text-sm font-semibold text-[#E84B7F]">{plus ? t.plusActive : t.plusTrial}</span>
        </button>
      ) : null}
      {IS_IOS_APP ? <LegalLinks className="mt-3 text-center text-sm text-[#8C7468]" /> : null}
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          aria-pressed={soundEnabled}
          onClick={() => setSound(!soundEnabled)}
          className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0]"
        >
          <span>{t.sound}</span>
          <span className="font-semibold">{soundEnabled ? t.on : t.off}</span>
        </button>
        <button
          type="button"
          aria-pressed={hapticsEnabled}
          onClick={() => setHaptics(!hapticsEnabled)}
          className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0]"
        >
          <span>{t.haptics}</span>
          <span className="font-semibold">{hapticsEnabled ? t.on : t.off}</span>
        </button>
      </div>
      {confirmReset ? (
        <div className="mt-4">
          <p className="text-sm text-[#8C7468]">{t.resetWarning}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                reset()
                setConfirmReset(false)
                if (IS_PORTAL_BUILD) {
                  startLevel(1)
                  return
                }
                showHome()
              }}
            >
              {t.confirmReset}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              {t.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <Button className="mt-5" variant="secondary" onClick={() => setConfirmReset(true)}>
          {t.resetProgress}
        </Button>
      )}
    </Modal>
  )
}
