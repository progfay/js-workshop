import * as Comlink from 'comlink'
import ts from 'typescript'
import { createTsEnv } from '../lib/tsEnv'

/**
 * 採点用の型チェック + JavaScript 変換を行う Worker。
 *
 * 受講者コードとテストケースを連結 (SPEC 5.1) した TypeScript を型チェックし、
 * 型エラーが無ければ JavaScript に変換して返す。メインスレッドを塞がないよう
 * TS コンパイラはこの Worker に閉じ込める。
 */

export interface CheckDiagnostic {
  message: string
  /** 該当コード内の行番号 (1 始まり) */
  line: number
  /** テストケース側のコードで起きた型エラーか (false なら受講者コード) */
  inTest: boolean
}

export interface CheckResult {
  diagnostics: CheckDiagnostic[]
  /** 型エラーが無いときの変換後 JavaScript (受講者コード + テスト) */
  js: string
}

const FILE = '/solution.ts'
// sandbox/worker.js が受講者コードとテストを連結するときの区切りと揃える。
const SEPARATOR = '\n;\n'

let env: ReturnType<typeof createTsEnv> | undefined

const lineOf = (text: string, offset: number) => {
  let line = 1
  for (let i = 0; i < offset; i++) if (text.charCodeAt(i) === 10) line++
  return line
}

/**
 * 型を取り除いて JavaScript にする。トップレベル await を使えるようモジュール扱いで
 * 変換するため、出力末尾に付く `export {};` は async 関数の本体に埋め込めないので除く。
 */
function toJavaScript(source: string): string {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleDetection: ts.ModuleDetectionKind.Force,
    },
  })
  return outputText.replace(/^export \{\};\s*$/m, '')
}

const api = {
  /** 初回の lib.d.ts 解析が重いので、実行前に呼んでおく。 */
  warmUp(): void {
    env ??= createTsEnv()
  },

  check(studentCode: string, testCode: string): CheckResult {
    const source = `${studentCode}${SEPARATOR}${testCode}`
    const testStart = studentCode.length + SEPARATOR.length

    env ??= createTsEnv()
    env.createFile(FILE, source)
    const raw = [
      ...env.languageService.getSyntacticDiagnostics(FILE),
      ...env.languageService.getSemanticDiagnostics(FILE),
    ]

    const seen = new Set<string>()
    const diagnostics: CheckDiagnostic[] = []
    for (const d of raw) {
      if (d.start === undefined) continue
      const inTest = d.start >= testStart
      const line = inTest
        ? lineOf(testCode, d.start - testStart)
        : lineOf(studentCode, d.start)
      const message = ts.flattenDiagnosticMessageText(d.messageText, '\n')
      const key = `${inTest}:${line}:${message}`
      if (seen.has(key)) continue
      seen.add(key)
      diagnostics.push({ message, line, inTest })
    }
    // 受講者コードの指摘を先に並べる。
    diagnostics.sort((a, b) => Number(a.inTest) - Number(b.inTest) || a.line - b.line)

    return { diagnostics, js: diagnostics.length === 0 ? toJavaScript(source) : '' }
  },
}

export type CheckApi = typeof api

Comlink.expose(api)
