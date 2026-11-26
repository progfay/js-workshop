import * as Comlink from 'comlink'
import type { CheckApi, CheckDiagnostic } from './typeCheckWorker'

export type { CheckDiagnostic }

let checkerPromise: Promise<Comlink.Remote<CheckApi>> | null = null

/** 型チェック Worker を1つだけ作り、以後の採点で使い回す。TS コンパイラは重いので遅延起動する。 */
function getTypeChecker(): Promise<Comlink.Remote<CheckApi>> {
  checkerPromise ??= Promise.resolve(
    Comlink.wrap<CheckApi>(
      new Worker(new URL('./typeCheckWorker.ts', import.meta.url), { type: 'module' }),
    ),
  )
  return checkerPromise
}

/** 初回採点を待たせないよう、Worker 起動と lib.d.ts の解析を先に済ませておく。 */
export function warmUpTypeChecker(): void {
  void getTypeChecker().then((checker) => checker.warmUp())
}

/** 受講者コードとテストを連結して型チェックし、通れば JavaScript に変換して返す。 */
export async function typeCheck(studentCode: string, testCode: string) {
  const checker = await getTypeChecker()
  return checker.check(studentCode, testCode)
}

const MAX_SHOWN = 3

/** 型エラーを受講者向けのメッセージに整形する (SPEC 6: Error message をそのまま表示する方針に沿う)。 */
export function formatDiagnostics(diagnostics: CheckDiagnostic[]): string {
  const lines = diagnostics.slice(0, MAX_SHOWN).map(({ message, line, inTest }) => {
    const where = inTest ? `テストコードの ${line} 行目` : `あなたのコードの ${line} 行目`
    return `型エラー (${where}): ${message}`
  })
  if (diagnostics.length > MAX_SHOWN) {
    lines.push(`…ほか ${diagnostics.length - MAX_SHOWN} 件の型エラー`)
  }
  return lines.join('\n')
}
