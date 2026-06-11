import type { Diagnostic } from '@codemirror/lint'
import type { EditorView } from '@codemirror/view'

/**
 * Prettier 同梱の meriyah パーサを再利用して JavaScript の syntax error を検出し、
 * CodeMirror の Diagnostic(波線) に変換する。
 *
 * meriyah は最初の構文エラーで parse を停止するため、一度に表示できるのは 1 件。
 * パーサは初期バンドルを膨らませないよう動的 import し、初回ロード後はキャッシュする。
 * (format.ts と同じ prettier/plugins/meriyah を流用)
 */

type MeriyahPlugin = {
  parsers: { meriyah: { parse: (code: string, options: unknown) => unknown } }
}

let pluginPromise: Promise<MeriyahPlugin> | undefined

function loadPlugin(): Promise<MeriyahPlugin> {
  if (!pluginPromise) {
    pluginPromise = import('prettier/plugins/meriyah').then(
      (m) => (m.default ?? m) as unknown as MeriyahPlugin,
    )
  }
  return pluginPromise
}

/** meriyah が throw する SyntaxError は line/column 付きの loc を持つ。 */
interface SyntaxErrorWithLoc extends Error {
  loc?: {
    start: { line: number; column: number }
    end?: { line: number; column: number }
  }
}

function hasLoc(error: unknown): error is SyntaxErrorWithLoc {
  return (
    error instanceof Error &&
    'loc' in error &&
    typeof (error as SyntaxErrorWithLoc).loc?.start?.line === 'number'
  )
}

/**
 * meriyah の {line(1-based), column(0-based)} を CodeMirror の絶対オフセットに変換する。
 * 範囲外を指してもエディタを壊さないようドキュメント長でクランプする。
 */
function toOffset(
  view: EditorView,
  pos: { line: number; column: number },
): number {
  const { doc } = view.state
  const lineNo = Math.min(Math.max(pos.line, 1), doc.lines)
  const line = doc.line(lineNo)
  return Math.min(line.from + Math.max(pos.column, 0), doc.length)
}

export function createJsLintSource() {
  return async (view: EditorView): Promise<readonly Diagnostic[]> => {
    const code = view.state.doc.toString()
    const plugin = await loadPlugin()

    try {
      plugin.parsers.meriyah.parse(code, {})
      return []
    } catch (error) {
      if (!hasLoc(error) || !error.loc) {
        // 想定外の例外はエディタを壊さないよう無視する。
        return []
      }
      const { start, end } = error.loc
      const from = toOffset(view, start)
      const to = end
        ? Math.max(toOffset(view, end), from)
        : Math.min(from + 1, view.state.doc.length)
      return [
        {
          from,
          to: from === to ? Math.min(from + 1, view.state.doc.length) : to,
          severity: 'error',
          source: 'meriyah',
          message: error.message,
        },
      ]
    }
  }
}
