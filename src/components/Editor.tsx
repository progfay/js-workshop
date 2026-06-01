import { lazy, Suspense } from 'react'
import type { ThemeName } from '../hooks/useTheme'
import { Spinner } from './Spinner'

interface Props {
  value: string
  onChange: (value: string) => void
  theme: ThemeName
}

// CodeMirror (大きい) を初期バンドルから外し、必要時に dynamic import する。
const EditorImpl = lazy(() => import('./EditorImpl'))

/** JavaScript モードのコードエディタ。light/dark に対応 (SPEC 3)。 */
export function Editor(props: Props) {
  return (
    <Suspense fallback={<Spinner label="エディタを読み込み中…" />}>
      <EditorImpl {...props} />
    </Suspense>
  )
}
