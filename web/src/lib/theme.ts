import 'server-only'
import { cookies } from 'next/headers'

export type Theme = 'light' | 'dark'

const THEME_COOKIE = 'theme'

export async function getTheme(): Promise<Theme | null> {
  const store = await cookies()
  const value = store.get(THEME_COOKIE)?.value
  return value === 'light' || value === 'dark' ? value : null
}
