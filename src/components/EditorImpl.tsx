import { useEffect, useRef, useState } from 'react'
import CodeMirror, {
  type ReactCodeMirrorRef,
} from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { linter, lintGutter } from '@codemirror/lint'
import { autocompletion } from '@codemirror/autocomplete'
import { Compartment, type Extension } from '@codemirror/state'
import * as Comlink from 'comlink'
import {
  tsAutocompleteWorker,
  tsFacetWorker,
  tsHoverWorker,
  tsSyncWorker,
} from '@valtown/codemirror-ts'
import type { WorkerShape } from '@valtown/codemirror-ts/worker'
import type { ThemeName } from '../hooks/useTheme'
import { createJsLintSource } from '../lib/jsLinter'

interface Props {
  value: string
  onChange: (value: string) => void
  theme: ThemeName
}

// TS 言語サービスがエディタ内のコードを識別するための仮想ファイルパス。
// `.js` 拡張子により TS 構文は許容されず、JSDoc を型として解釈する (tsWorker.ts)。
const TS_PATH = 'index.js'

// theme 切り替えなどの再レンダーで作り直さない静的拡張。
// 構文エラーは引き続き meriyah ベースの linter で表示する (TS の診断は使わない)。
const baseExtensions: Extension[] = [
  javascript(),
  linter(createJsLintSource(), { delay: 400 }),
  lintGutter(),
]

/**
 * JavaScript モードのコードエディタ本体 (SPEC 3)。
 * CodeMirror をメインチャンクから切り離すため、Editor から React.lazy で読み込む。
 *
 * TypeScript 言語サービスを Web Worker で起動し、補完/hover を型認識化する。
 * Worker の初期化は非同期なので、準備完了後に Compartment 経由で拡張を差し込む。
 */
export default function EditorImpl({ value, onChange, theme }: Props) {
  const cmRef = useRef<ReactCodeMirrorRef>(null)
  const tsCompartment = useRef(new Compartment()).current
  // 初回マウント時に一度だけ拡張配列を組む (再レンダーで作り直さない)。
  const [extensions] = useState<Extension[]>(() => [
    ...baseExtensions,
    tsCompartment.of([]),
  ])

  useEffect(() => {
    let disposed = false
    const rawWorker = new Worker(
      new URL('../lib/tsWorker.ts', import.meta.url),
      { type: 'module' },
    )
    const worker = Comlink.wrap(rawWorker) as unknown as WorkerShape

    void worker.initialize().then(() => {
      const view = cmRef.current?.view
      if (disposed || !view) return
      // Worker 準備後に TS 拡張を投入する。reconfigure のトランザクションが
      // updateListener を発火させ、tsSyncWorker が現在のコードを Worker へ送る。
      view.dispatch({
        effects: tsCompartment.reconfigure([
          tsFacetWorker.of({ worker, path: TS_PATH }),
          tsSyncWorker(),
          autocompletion({ override: [tsAutocompleteWorker()] }),
          tsHoverWorker(),
        ]),
      })
    })

    return () => {
      disposed = true
      rawWorker.terminate()
    }
  }, [tsCompartment])

  return (
    <CodeMirror
      ref={cmRef}
      value={value}
      theme={theme}
      height="100%"
      extensions={extensions}
      onChange={onChange}
      basicSetup={{ tabSize: 2 }}
    />
  )
}
