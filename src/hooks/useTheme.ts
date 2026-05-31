import { useEffect, useState } from 'react'

export type ThemeName = 'light' | 'dark'

const QUERY = '(prefers-color-scheme: dark)'

function getSystemTheme(): ThemeName {
  return window.matchMedia?.(QUERY).matches ? 'dark' : 'light'
}

/**
 * OS のカラースキーム (system theme) に追従するテーマ (SPEC 3)。
 * トグルや永続化は持たず、OS 設定の変更にもリアルタイムで追従する。
 */
export function useSystemTheme(): ThemeName {
  const [theme, setTheme] = useState<ThemeName>(getSystemTheme)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return theme
}
