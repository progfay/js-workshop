import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { ThemeName } from '../hooks/useTheme'

interface Props {
  code: string
  theme: ThemeName
}

/**
 * 読み取り専用の CodeMirror で JavaScript をシンタックスハイライト表示する本体。
 * CodeMirror をメインチャンクから切り離すため、CodeBlock から React.lazy で読み込む。
 */
export default function CodeBlockImpl({ code, theme }: Props) {
  return (
    <CodeMirror
      className="code-block"
      value={code}
      theme={theme}
      editable={false}
      extensions={[javascript()]}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        highlightSelectionMatches: false,
        autocompletion: false,
      }}
    />
  )
}
