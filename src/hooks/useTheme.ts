import { useEffect, useState } from 'react'
import { loadTheme, saveTheme, type ThemeName } from '../storage/storage'

function systemTheme(): ThemeName {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * ライト/ダークテーマ (SPEC 3)。保存値 > OS 設定 の優先順で初期化し、
 * 変更を <html data-theme> と localStorage に反映する。
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => loadTheme() ?? systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
