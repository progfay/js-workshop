import { lazy, Suspense } from 'react'
import type { ThemeName } from '../hooks/useTheme'

interface Props {
  code: string
  theme: ThemeName
}

// CodeMirror (大きい) を初期バンドルから外し、必要時に dynamic import する。
const CodeBlockImpl = lazy(() => import('./CodeBlockImpl'))

/** 読み取り専用の CodeMirror で JavaScript をシンタックスハイライト表示する。 */
export function CodeBlock({ code, theme }: Props) {
  return (
    <Suspense fallback={<pre className="code-block code-block-loading">{code}</pre>}>
      <CodeBlockImpl code={code} theme={theme} />
    </Suspense>
  )
}
