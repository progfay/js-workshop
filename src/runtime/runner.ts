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
  vm.setProp(vm.global, 'console', consoleObj)
  consoleObj.dispose()
  logFn.dispose()
}

/** 受講者コード + 1つの case.js を concat し、隔離環境で1回だけ実行する (SPEC 5.1)。 */
function runCase(
  QuickJS: QuickJSWASMModule,
  studentCode: string,
  test: ProblemTestCase,
): CaseResult {
  const runtime = QuickJS.newRuntime()
  runtime.setMemoryLimit(MEMORY_LIMIT_BYTES)
  // 無限ループ対策: 期限を過ぎたら実行を中断する。
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + TIMEOUT_MS))
  const vm = runtime.newContext()
  const logs: string[] = []
  installConsole(vm, logs)

  const source = `${studentCode}\n;\n${test.code}`
  const result = vm.evalCode(source)

  let passed = true
  let errorMessage: string | undefined
  let timedOut = false

  if (result.error) {
    passed = false
    const dumped = vm.dump(result.error)
    result.error.dispose()
    const message = formatError(dumped)
    // 中断は InternalError: interrupted として現れる。
    if (/interrupted/i.test(message)) {
      timedOut = true
      errorMessage = `実行が ${TIMEOUT_MS}ms を超えたため中断しました(無限ループの可能性があります)`
    } else {
      errorMessage = message
    }
  } else {
    result.value.dispose()
  }

  vm.dispose()
  runtime.dispose()

  return { name: test.name, code: test.code, passed, errorMessage, timedOut, logs }
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
