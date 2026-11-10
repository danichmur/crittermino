import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GameApp } from '@/components/Game/GameApp'
import { LocaleProvider } from '@/components/Locale/LocaleProvider'
import { connectCrazyGames, initCrazyGames, resolvePortalLocale } from './sdk'
import './styles.css'

const start = async (): Promise<void> => {
  const root = document.getElementById('root')
  if (!root) throw new Error('Missing #root element')
  const sdk = await initCrazyGames()
  if (sdk) connectCrazyGames(sdk)
  createRoot(root).render(
    <StrictMode>
      <LocaleProvider initialLocale={resolvePortalLocale(sdk)}>
        <GameApp />
      </LocaleProvider>
    </StrictMode>,
  )
}

void start()
