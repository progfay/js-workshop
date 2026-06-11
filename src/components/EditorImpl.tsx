import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { linter, lintGutter } from '@codemirror/lint'
import type { ThemeName } from '../hooks/useTheme'
import { createJsLintSource } from '../lib/jsLinter'

interface Props {
  value: string
  onChange: (value: string) => void
  theme: ThemeName
}

// theme 切り替えなどの再レンダーで lint 設定を作り直さないよう、一度だけ生成する。
const extensions = [
  javascript(),
  linter(createJsLintSource(), { delay: 400 }),
  lintGutter(),
]

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
      extensions={extensions}
      onChange={onChange}
      basicSetup={{ tabSize: 2 }}
    />
  )
}
