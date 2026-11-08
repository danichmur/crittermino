'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LanguageChoices } from '@/components/Locale/LanguageMenu'
import { useI18n } from '@/components/Locale/LocaleProvider'
import { Button } from '@/components/UI/Button'
import { Modal } from '@/components/UI/Modal'
import { useGame } from '@/hooks/useGame'
import { useProgress } from '@/hooks/useProgress'

export const MenuSheet = () => {
  const open = useGame((state) => state.menuOpen)
  const closeMenu = useGame((state) => state.closeMenu)
  const restart = useGame((state) => state.restart)
  const showLevels = useGame((state) => state.showLevels)
  const showHome = useGame((state) => state.showHome)
  const openSettings = useGame((state) => state.openSettings)
  const { t } = useI18n()
  const linkClass = 'inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 font-display font-semibold text-[#3D2C29] ring-1 ring-[#E5D5C0]'
  return (
    <Modal open={open} title={t.menu} onClose={closeMenu}>
      <h2 className="font-display text-2xl font-bold">{t.menu}</h2>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={closeMenu}>{t.continue}</Button>
        <Button variant="secondary" onClick={restart}>
          {t.restartLevel}
        </Button>
        <Button variant="secondary" onClick={showLevels}>
          {t.levelSelect}
        </Button>
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
  const [confirmReset, setConfirmReset] = useState(false)
  const { t } = useI18n()
  return (
    <Modal open={open} title={t.settings} onClose={closeSettings}>
      <h2 className="font-display text-2xl font-bold">{t.settings}</h2>
      <div className="mt-4">
        <p className="mb-2 font-display font-semibold">{t.language}</p>
        <LanguageChoices />
      </div>
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
