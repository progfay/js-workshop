import {
  getQuickJS,
  shouldInterruptAfterDeadline,
  type QuickJSContext,
  type QuickJSHandle,
  type QuickJSWASMModule,
} from 'quickjs-emscripten'
import type { ProblemTestCase } from '../problems/types'

export interface CaseResult {
  name: string
  passed: boolean
  /** テストケースのソースコード (受講者にも公開する, SPEC 4.6) */
  code: string
  /** 失敗時に throw された Error の message (整形済み, SPEC 6) */
  errorMessage?: string
  /** タイムアウト (無限ループ等) で打ち切られたか */
  timedOut?: boolean
  /** 受講者コードの console.log 出力 (デバッグ用, SPEC 5.3) */
  logs: string[]
}

export interface GradeResult {
  cases: CaseResult[]
  /** 全テストケース通過時のみ true (SPEC 5.2) */
  solved: boolean
}

/** 1ケースあたりの実行時間上限 (ms)。無限ループ対策 (SPEC 3)。 */
export const TIMEOUT_MS = 1000
const MEMORY_LIMIT_BYTES = 128 * 1024 * 1024

let modulePromise: Promise<QuickJSWASMModule> | null = null
function loadQuickJS(): Promise<QuickJSWASMModule> {
  if (!modulePromise) modulePromise = getQuickJS()
  return modulePromise
}

/** console.log の引数を1つの文字列に整形する。 */
function formatValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'bigint') return `${value}n`
  if (value === undefined) return 'undefined'
  if (typeof value === 'function') return '[Function]'
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

/** dump 結果から表示用のエラーメッセージを取り出す。 */
function formatError(dumped: unknown): string {
  if (typeof dumped === 'string') return dumped
  if (dumped && typeof dumped === 'object' && 'message' in dumped) {
    const { name, message } = dumped as { name?: unknown; message?: unknown }
    const msg = typeof message === 'string' ? message : formatValue(message)
    // throw new Error(...) の素の Error は message だけを見せる (SPEC 4.6)。
    // ReferenceError 等は種別が手掛かりになるので name を前置する。
    if (typeof name === 'string' && name && name !== 'Error') {
      return `${name}: ${msg}`
    }
    return msg
  }
  return formatValue(dumped)
}

/** ゲスト側に console.log を用意し、出力を logs に蓄積する (SPEC 5.3)。 */
function installConsole(vm: QuickJSContext, logs: string[]): void {
  const logFn = vm.newFunction('log', (...args: QuickJSHandle[]) => {
    logs.push(args.map((arg) => formatValue(vm.dump(arg))).join(' '))
  })
  const consoleObj = vm.newObject()
  vm.setProp(consoleObj, 'log', logFn)
  // console.error も log と同様に扱う (一部の問題でデバッグ出力に使われる)。
  vm.setProp(consoleObj, 'error', logFn)
  vm.setProp(vm.global, 'console', consoleObj)
  consoleObj.dispose()
  logFn.dispose()
}

interface VirtualTimer {
  delay: number
  seq: number
  cb: QuickJSHandle
}

/**
 * QuickJS には setTimeout が無いので、ホスト側の仮想タイマーとして実装する。
 * 実時間は待たず、駆動ループが遅延の昇順 (同遅延は登録順) でコールバックを発火する。
 * これにより非同期問題 (callback / promise 等) を決定論的かつ高速に採点できる。
 */
function installSetTimeout(vm: QuickJSContext, timers: VirtualTimer[]): void {
  let seq = 0
  const setTimeoutFn = vm.newFunction(
    'setTimeout',
    (cbHandle: QuickJSHandle, delayHandle?: QuickJSHandle) => {
      const delay = delayHandle && vm.typeof(delayHandle) === 'number' ? vm.getNumber(delayHandle) : 0
      // コールバックは呼び出し後も保持する必要があるので dup する。
      timers.push({ delay, seq: seq++, cb: cbHandle.dup() })
      return vm.newNumber(timers.length)
    },
  )
  // clearTimeout は今回の問題群では使われないが、存在しないと参照エラーになるため no-op で用意。
  const clearTimeoutFn = vm.newFunction('clearTimeout', () => vm.undefined)
  vm.setProp(vm.global, 'setTimeout', setTimeoutFn)
  vm.setProp(vm.global, 'clearTimeout', clearTimeoutFn)
  setTimeoutFn.dispose()
  clearTimeoutFn.dispose()
}

/**
 * ネットワークに依存しない決定論的な fetch のモックを注入する。
 * fetch 問題が参照する固定のレスポンスだけを返す (オフライン・再現可能)。
 */
function installFetch(vm: QuickJSContext): void {
  const preamble = `globalThis.fetch = (url) => {
  const DB = {
    "https://dummyjson.com/todos/1": { id: 1, todo: "Do something nice for someone you care about", completed: false, userId: 152 },
  };
  const body = DB[url];
  if (!body) {
    return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error("Not Found")) });
  }
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
};`
  const res = vm.evalCode(preamble)
  if (res.error) res.error.dispose()
  else res.value.dispose()
}

/**
 * 受講者コード + 1つの case.js を1つの async 関数にまとめ、隔離環境で実行する (SPEC 5.1)。
 * async でラップすることで await・Promise・setTimeout を含む問題も採点できる。
 * 同期問題は await を含まないだけで、同じ経路を通る。
 */
function runCase(
  QuickJS: QuickJSWASMModule,
  studentCode: string,
  test: ProblemTestCase,
): CaseResult {
  const runtime = QuickJS.newRuntime()
  runtime.setMemoryLimit(MEMORY_LIMIT_BYTES)
  // 無限ループ対策: 期限を過ぎたら実行を中断する。pump 全体で共有する単一の期限。
  const deadline = Date.now() + TIMEOUT_MS
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(deadline))
  const vm = runtime.newContext()
  const logs: string[] = []
  const timers: VirtualTimer[] = []
  installConsole(vm, logs)
  installSetTimeout(vm, timers)
  installFetch(vm)

  let passed = true
  let errorMessage: string | undefined
  let timedOut = false

  const interruptMessage = `実行が ${TIMEOUT_MS}ms を超えたため中断しました(無限ループの可能性があります)`

  // 受講者コードと case.js を1つの async 関数にまとめる。
  // 戻り値の Promise の状態 (fulfilled / rejected) で合否を判定する。
  const source = `(async () => {\n${studentCode}\n;\n${test.code}\n})()`
  const evalResult = vm.evalCode(source)

  if (evalResult.error) {
    // 同期部分の実行で throw / 中断が起きたケース。
    const dumped = vm.dump(evalResult.error)
    evalResult.error.dispose()
    const message = formatError(dumped)
    passed = false
    if (/interrupted/i.test(message)) {
      timedOut = true
      errorMessage = interruptMessage
    } else {
      errorMessage = message
    }
    disposeTimers(timers)
    vm.dispose()
    runtime.dispose()
    return { name: test.name, code: test.code, passed, errorMessage, timedOut, logs }
  }

  const resultPromise = evalResult.value

  // 駆動ループ: Promise が settle するまで、マイクロタスク実行と仮想タイマー発火を繰り返す。
  while (true) {
    if (isSettled(vm, resultPromise)) break

    if (Date.now() > deadline) {
      timedOut = true
      break
    }

    const jobs = runtime.executePendingJobs(-1)
    if (jobs.error) {
      // マイクロタスク実行中の中断 (無限ループ等)。
      const dumped = vm.dump(jobs.error)
      jobs.error.dispose()
      const message = formatError(dumped)
      if (/interrupted/i.test(message)) {
        timedOut = true
      } else {
        passed = false
        errorMessage = message
      }
      break
    }
    if (jobs.value > 0) continue

    // マイクロタスクが尽きた: 最も早い仮想タイマーを1つ発火する。
    if (timers.length === 0) break // これ以上進めない (pending のまま)。
    timers.sort((a, b) => a.delay - b.delay || a.seq - b.seq)
    const timer = timers.shift() as VirtualTimer
    const callRes = vm.callFunction(timer.cb, vm.undefined)
    timer.cb.dispose()
    if (callRes.error) callRes.error.dispose()
    else callRes.value.dispose()
  }

  if (passed && errorMessage === undefined && !timedOut) {
    const state = vm.getPromiseState(resultPromise)
    if (state.type === 'fulfilled') {
      state.value.dispose()
    } else if (state.type === 'rejected') {
      passed = false
      const dumped = vm.dump(state.error)
      state.error.dispose()
      const message = formatError(dumped)
      // 非同期コードの中断は、ジョブの reject として現れることがある。
      if (/interrupted/i.test(message)) {
        timedOut = true
      } else {
        errorMessage = message
      }
    } else {
      // まだ pending → タイムアウト扱い。
      passed = false
      timedOut = true
    }
  }

  if (timedOut) {
    passed = false
    errorMessage = interruptMessage
  }

  resultPromise.dispose()
  disposeTimers(timers)
  vm.dispose()
  runtime.dispose()

  return { name: test.name, code: test.code, passed, errorMessage, timedOut, logs }
}

/**
 * Promise が settle 済みか調べる。getPromiseState が返す value/error handle は
 * その都度解放する必要があるので、判定だけ行いここで dispose する。
 */
function isSettled(vm: QuickJSContext, promise: QuickJSHandle): boolean {
  const state = vm.getPromiseState(promise)
  if (state.type === 'fulfilled') {
    state.value.dispose()
    return true
  }
  if (state.type === 'rejected') {
    state.error.dispose()
    return true
  }
  return false
}

/** 未発火のまま残った仮想タイマーのコールバック handle を解放する。 */
function disposeTimers(timers: VirtualTimer[]): void {
  for (const timer of timers) timer.cb.dispose()
  timers.length = 0
}

/**
 * 受講者コードを全テストケースに対して個別実行し採点する。
 * 全ケース通過時のみ solved=true (部分点なし, SPEC 5.2)。
 */
export async function grade(
  studentCode: string,
  tests: ProblemTestCase[],
): Promise<GradeResult> {
  const QuickJS = await loadQuickJS()
  const cases = tests.map((test) => runCase(QuickJS, studentCode, test))
  return { cases, solved: cases.length > 0 && cases.every((caseResult) => caseResult.passed) }
}
