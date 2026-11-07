'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  return (
    <Modal open={open} title="Menu" onClose={closeMenu}>
      <h2 className="font-display text-2xl font-bold">Menu</h2>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={closeMenu}>Continue</Button>
        <Button variant="secondary" onClick={restart}>
          Restart level
        </Button>
        <Button variant="secondary" onClick={showLevels}>
          Level select
        </Button>
        <Link
          href="/how-to-play"
          onClick={closeMenu}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 font-display font-semibold text-[#3D2C29] ring-1 ring-[#E5D5C0]"
        >
          How to play
        </Link>
        <Link
          href="/privacy"
          onClick={closeMenu}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 font-display font-semibold text-[#3D2C29] ring-1 ring-[#E5D5C0]"
        >
          Privacy
        </Link>
        <Button variant="secondary" onClick={openSettings}>
          Settings
        </Button>
        <Button variant="ghost" onClick={showHome}>
          Home
        </Button>
      </div>
      <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-[#E5D5C0]">
        <p className="font-display font-semibold">More animals</p>
        <p className="mt-1 text-sm text-[#8C7468]">Cosmetic unlocks are coming later. The puzzle stays free.</p>
        <Button className="mt-3" variant="secondary" disabled>
          Unlock more animals
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
  return (
    <Modal open={open} title="Settings" onClose={closeSettings}>
      <h2 className="font-display text-2xl font-bold">Settings</h2>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          aria-pressed={soundEnabled}
          onClick={() => setSound(!soundEnabled)}
          className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0]"
        >
          <span>Sound</span>
          <span className="font-semibold">{soundEnabled ? 'On' : 'Off'}</span>
        </button>
        <button
          type="button"
          aria-pressed={hapticsEnabled}
          onClick={() => setHaptics(!hapticsEnabled)}
          className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-4 text-left ring-1 ring-[#E5D5C0]"
        >
          <span>Haptics</span>
          <span className="font-semibold">{hapticsEnabled ? 'On' : 'Off'}</span>
        </button>
      </div>
      {confirmReset ? (
        <div className="mt-4">
          <p className="text-sm text-[#8C7468]">This clears levels, streaks, and best scores on this device.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                reset()
                setConfirmReset(false)
                showHome()
              }}
            >
              Confirm reset
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button className="mt-5" variant="secondary" onClick={() => setConfirmReset(true)}>
          Reset progress
        </Button>
      )}
    </Modal>
  )
}
