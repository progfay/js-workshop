import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { ThemeName } from '../hooks/useTheme'

interface Props {
  value: string
  onChange: (value: string) => void
  theme: ThemeName
}

/** JavaScript モードのコードエディタ。light/dark に対応 (SPEC 3)。 */
export function Editor({ value, onChange, theme }: Props) {
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
