import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { ThemeName } from '../hooks/useTheme'

interface Props {
  value: string
  onChange: (value: string) => void
  theme: ThemeName
}

/**
 * JavaScript モードのコードエディタ本体 (SPEC 3)。
 * CodeMirror をメインチャンクから切り離すため、Editor から React.lazy で読み込む。
 */
export default function EditorImpl({ value, onChange, theme }: Props) {
  return (
    <CodeMirror
      value={value}
      theme={theme}
      height="100%"
      extensions={[javascript()]}
      onChange={onChange}
      basicSetup={{ tabSize: 2 }}
    />
  )
}
