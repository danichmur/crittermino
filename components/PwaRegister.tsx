'use client'

import { useEffect, useState } from 'react'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferredPrompt: InstallPromptEvent | null = null
const listeners = new Set<() => void>()

const notify = (): void => {
  for (const listener of listeners) listener()
}

export const useInstallPrompt = (): { canInstall: boolean; install: () => Promise<void> } => {
  const [canInstall, setCanInstall] = useState(false)
  useEffect(() => {
    const sync = (): void => setCanInstall(deferredPrompt !== null)
    listeners.add(sync)
    sync()
    return () => {
      listeners.delete(sync)
    }
  }, [])
  const install = async (): Promise<void> => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    deferredPrompt = null
    notify()
  }
  return { canInstall, install }
}

export const PwaRegister = () => {
  useEffect(() => {
    const onPrompt = (event: Event): void => {
      event.preventDefault()
      deferredPrompt = event as InstallPromptEvent
      notify()
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js')
    }
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])
  return null
}
