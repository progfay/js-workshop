import type { ProblemTestCase } from '../problems/types'
// sandbox 内で動くスクリプトは import できない (opaque origin の blob: Worker) ため、
// 文字列として取り込み iframe の srcdoc に埋め込む。
import hostSource from './sandbox/host.js?raw'
import workerSource from './sandbox/worker.js?raw'

/** console のどのメソッドから出力されたか (表示で log と error 等を区別する)。 */
export type LogLevel = 'log' | 'info' | 'debug' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  text: string
}

export interface CaseResult {
  name: string
  passed: boolean
  /** テストケースのソースコード (受講者にも公開する, SPEC 4.6) */
  code: string
  /** 失敗時に throw された Error の message (整形済み, SPEC 6) */
  errorMessage?: string
  /** タイムアウト (無限ループ等) で打ち切られたか */
  timedOut?: boolean
  /** 受講者コードの console 出力 (デバッグ用, SPEC 5.3)。level でメソッドを区別する。 */
  logs: LogEntry[]
}

export interface GradeResult {
  cases: CaseResult[]
  /** 全テストケース通過時のみ true (SPEC 5.2) */
  solved: boolean
}

/** 1ケースあたりの実行時間上限 (ms)。無限ループ対策 (SPEC 3)。 */
export const TIMEOUT_MS = 1000

/** sandbox/host.js が返す1ケースの実行結果。 */
interface SandboxResult {
  status: 'fulfilled' | 'rejected' | 'stalled' | 'runaway-timers' | 'timeout' | 'crashed'
  errorMessage?: string
  logs: LogEntry[]
}

/**
 * 受講者コードの実行環境 = sandbox iframe + 1ケースごとの Web Worker (SPEC 3)。
 *
 * - iframe は allow-scripts のみの sandbox で origin が opaque になり、アプリ本体の
 *   DOM・localStorage (進捗やコード) に触れられない。
 * - CSP で通信を遮断する (fetch はモック)。GitHub Pages ではヘッダーを設定できないので
 *   meta で指定する。srcdoc は親の CSP も継承するため、アプリに CSP を足す場合は
 *   'unsafe-eval' と blob: の Worker を許可すること。
 * - Worker から本物の Worker URL は opaque origin の同一オリジン制約で使えないため、
 *   iframe 内で blob: URL を作って起動する (sandbox/host.js)。
 */
const CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline' 'unsafe-eval' blob:",
  'worker-src blob:',
  "connect-src 'none'",
].join('; ')

/** <script> 内に埋め込んでも </script> で途切れないようにする。 */
const escapeScript = (source: string) => source.replace(/<\/(script)/gi, '<\\/$1')

const srcdoc = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<script>
const WORKER_SOURCE = ${JSON.stringify(workerSource).replace(/</g, '\\u003c')};
${escapeScript(hostSource)}
</script>`

interface Sandbox {
  run(studentCode: string, testCode: string): Promise<SandboxResult>
}

let sandboxPromise: Promise<Sandbox> | null = null

/** sandbox iframe を1つだけ作り、以後の採点で使い回す。 */
function getSandbox(): Promise<Sandbox> {
  if (sandboxPromise) return sandboxPromise
  sandboxPromise = new Promise((resolve) => {
    const iframe = document.createElement('iframe')
    iframe.sandbox.add('allow-scripts')
    iframe.hidden = true
    iframe.tabIndex = -1
    iframe.setAttribute('aria-hidden', 'true')
    iframe.title = 'コード実行環境'
    iframe.srcdoc = srcdoc

    let nextId = 0
    const pending = new Map<number, (result: SandboxResult) => void>()
    const sandbox: Sandbox = {
      run(studentCode, testCode) {
        return new Promise((resolveRun) => {
          const id = nextId++
          pending.set(id, resolveRun)
          iframe.contentWindow?.postMessage(
            { type: 'run', id, studentCode, testCode, timeoutMs: TIMEOUT_MS },
            '*',
          )
        })
      },
    }

    window.addEventListener('message', (event) => {
      // origin は opaque ("null") なので、送信元の window で sandbox からの応答か判定する。
      if (event.source !== iframe.contentWindow) return
      const message = event.data
      if (message?.type === 'ready') {
        resolve(sandbox)
      } else if (message?.type === 'result') {
        const resolveRun = pending.get(message.id)
        pending.delete(message.id)
        resolveRun?.({ status: message.status, errorMessage: message.errorMessage, logs: message.logs })
      }
    })
    document.body.append(iframe)
  })
  return sandboxPromise
}

const interruptMessage = `実行が ${TIMEOUT_MS}ms を超えたため中断しました(無限ループの可能性があります)`
// 実行できる処理が無くなったのに pending のまま。resolve やコールバックの
// 呼び忘れという初学者の典型ミスなので、無限ループ疑いとは区別して伝える。
const stalledMessage =
  'テストが完了しませんでした (Promise が解決されないままです。resolve やコールバックを呼び忘れていませんか?)'
// 0ms タイマーの再帰呼び出しや setInterval の止め忘れ。無限ループの一種だが、
// 原因がタイマーだと分かるように区別して伝える。
const runawayTimersMessage =
  'テストが完了しませんでした (タイマーが止まらずに発火し続けています。setTimeout の再帰呼び出しや clearInterval の呼び忘れはありませんか?)'

function toCaseResult(test: ProblemTestCase, result: SandboxResult): CaseResult {
  const base = { name: test.name, code: test.code, logs: result.logs }
  switch (result.status) {
    case 'fulfilled':
      return { ...base, passed: true }
    case 'rejected':
    case 'crashed':
      return { ...base, passed: false, errorMessage: result.errorMessage }
    case 'stalled':
      return { ...base, passed: false, errorMessage: stalledMessage }
    case 'runaway-timers':
      return { ...base, passed: false, errorMessage: runawayTimersMessage }
    case 'timeout':
      return { ...base, passed: false, timedOut: true, errorMessage: interruptMessage }
  }
}

/** 同時に実行する Worker 数の上限。無限ループのケースが並んでも CPU を占有しすぎないように。 */
const CONCURRENCY = Math.max(1, Math.min(navigator.hardwareConcurrency || 2, 4))

/**
 * 受講者コードを全テストケースに対して個別実行し採点する (SPEC 5.1)。
 * ケースごとに新しい Worker で実行するので、ケース間でグローバルの汚染は起きない。
 * 全ケース通過時のみ solved=true (部分点なし, SPEC 5.2)。
 */
export async function grade(
  studentCode: string,
  tests: ProblemTestCase[],
): Promise<GradeResult> {
  const sandbox = await getSandbox()
  const cases: CaseResult[] = new Array(tests.length)
  let next = 0
  const workers = Array.from({ length: Math.min(CONCURRENCY, tests.length) }, async () => {
    while (next < tests.length) {
      const index = next++
      const test = tests[index]
      cases[index] = toCaseResult(test, await sandbox.run(studentCode, test.code))
    }
  })
  await Promise.all(workers)
  return { cases, solved: cases.length > 0 && cases.every((caseResult) => caseResult.passed) }
}
