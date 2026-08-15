'use client'

import { Moon, Sun } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'
import type { Theme } from '@/lib/theme'

const THEME_COOKIE = 'theme'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const MEDIA_QUERY = '(prefers-color-scheme: light)'

function subscribeToSystemTheme(callback: () => void) {
  const mql = window.matchMedia(MEDIA_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSystemTheme(): Theme {
  return window.matchMedia(MEDIA_QUERY).matches ? 'light' : 'dark'
}

function getServerSystemTheme(): Theme {
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`
}

type ThemeToggleProps = {
  initialTheme: Theme | null
  className?: string
}

export function ThemeToggle({ initialTheme, className }: ThemeToggleProps) {
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  )

  const [manualTheme, setManualTheme] = useState<Theme | null>(initialTheme)
  const theme = manualTheme ?? systemTheme

  function handleClick() {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    setManualTheme(next)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors duration-300 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer',
        className,
      )}
    >
      {theme === 'light' ? (
        <Moon aria-hidden="true" size={16} />
      ) : (
        <Sun aria-hidden="true" size={16} />
      )}
    </button>
  )
}
