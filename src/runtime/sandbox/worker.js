// 受講者コード + 1つの case.js を実行する Web Worker 本体 (1ケース = 1 Worker)。
//
// sandbox iframe (opaque origin) の中で blob: URL から起動されるため、モジュールの
// import はできない。runner.ts から `?raw` で文字列として取り込み、そのまま Worker の
// ソースになるので、このファイルは依存なしの素の JS で書く。
//
// 親 (iframe の host.js) とのプロトコル:
//   受信: { studentCode, testCode }
//   送信: { type: 'started' }                           実行開始 (ここからタイムアウトを計る)
//         { type: 'log', level, text }                   console 出力 (逐次送る。打ち切られても残る)
//         { type: 'done', status, errorMessage? }
//           status: 'fulfilled' | 'rejected' | 'stalled' | 'runaway-timers'
//
// 無限ループ (同期・マイクロタスク) はこの中では止められないので、親が terminate() する。

/** 1ケースあたりの console 出力の上限。無限ループ中の console.log で溢れないように。 */
const MAX_LOGS = 1000

/**
 * 仮想時間で実行できる処理が尽きたあと、stalled と判定するまで実時間で待つ猶予 (ms)。
 * Blob#text() や crypto.subtle など、本物のタスクを経て resolve する API を待っている
 * 間に「resolve 呼び忘れ」と誤判定しないため。
 */
const STALL_GRACE_MS = 200

/**
 * タイマーが止まらずに発火し続けている (setTimeout の再帰呼び出し・setInterval の止め忘れ)
 * と判定する発火回数の上限。発火1回ごとに本物のマクロタスクを1往復するため、
 * 低速な端末でもタイムアウト (1秒) より十分早く上限に届く値にしている。
 * 仮想経過時間では判定しない (長い delay の setTimeout 1回を誤検出しないように)。
 */
const MAX_TIMER_FIRES = 10000

/**
 * setTimeout / setInterval / clear* と Date.now / performance.now / new Date() を
 * 仮想時間に差し替え、Promise が settle するまで駆動する関数 drive を返す。
 *
 * - 実時間は待たず、予定時刻 (登録時の仮想時刻 + delay) の昇順、同時刻は登録順に発火する。
 *   ブラウザと同じ順序になり、非同期問題を決定論的かつ高速に採点できる。
 * - マイクロタスクが尽きたかは「本物のマクロタスク (MessageChannel) が来たか」で判定する。
 *   HTML の event loop は、タスクの合間に必ずマイクロタスクをすべて消化するため。
 */
function installVirtualTime(global, onUncaught) {
  // 受講者コードに差し替えられる前に本物を確保しておく (クロージャ内なので触れない)。
  const NativeMessageChannel = global.MessageChannel
  const nativeSetTimeout = global.setTimeout.bind(global)
  const NativeDate = global.Date
  const nativeDateNow = NativeDate.now.bind(NativeDate)
  const nativePerfNow = global.performance.now.bind(global.performance)

  const startDate = nativeDateNow()
  const startPerf = nativePerfNow()
  /** 仮想経過時間 (ms) */
  let now = 0
  let seq = 0
  let nextId = 1
  /** id -> { time, seq, cb, args, interval } */
  const timers = new Map()

  // ブラウザと同じく delay を 32bit 符号付き整数 (WebIDL long) に変換し、負なら 0 にする。
  // そのため 2 ** 31 以上の delay は桁あふれして即時 (や短い delay) で発火する。
  const toDelay = (delay) => Math.max(Number(delay) | 0, 0)

  function schedule(cb, delay, args, repeat) {
    if (typeof cb !== 'function') {
      throw new TypeError('setTimeout / setInterval の第1引数には関数を渡してください')
    }
    const id = nextId++
    const d = toDelay(delay)
    timers.set(id, { time: now + d, seq: seq++, cb, args, interval: repeat ? d : null })
    return id
  }
  const clear = (id) => {
    timers.delete(id)
  }

  global.setTimeout = (cb, delay, ...args) => schedule(cb, delay, args, false)
  global.setInterval = (cb, delay, ...args) => schedule(cb, delay, args, true)
  global.clearTimeout = clear
  global.clearInterval = clear
  NativeDate.now = () => startDate + now
  global.performance.now = () => startPerf + now
  // new Date() (引数なし) も仮想時刻にする。Date.prototype は共有なので instanceof も保たれる。
  global.Date = new Proxy(NativeDate, {
    construct(target, argList, newTarget) {
      return Reflect.construct(target, argList.length ? argList : [startDate + now], newTarget)
    },
  })

  // 本物のマクロタスクを1つ待つ = それまでに積まれたマイクロタスクがすべて消化される。
  const channel = new NativeMessageChannel()
  let tickResolvers = []
  channel.port1.onmessage = () => {
    const resolvers = tickResolvers
    tickResolvers = []
    for (const resolve of resolvers) resolve()
  }
  const tick = () =>
    new Promise((resolve) => {
      tickResolvers.push(resolve)
      channel.port2.postMessage(null)
    })
  const sleep = (ms) => new Promise((resolve) => nativeSetTimeout(resolve, ms))

  function popEarliest() {
    let bestId = null
    let best = null
    for (const [id, timer] of timers) {
      if (!best || timer.time < best.time || (timer.time === best.time && timer.seq < best.seq)) {
        best = timer
        bestId = id
      }
    }
    return best ? [bestId, best] : null
  }

  /**
   * promise が settle するまで「マイクロタスク消化 → 最も早い仮想タイマーを1つ発火」を繰り返す。
   * 戻り値: { status: 'fulfilled' | 'rejected' | 'stalled' | 'runaway-timers', error? }
   */
  async function drive(promise) {
    let settled = null
    let fires = 0
    promise.then(
      () => (settled = { status: 'fulfilled' }),
      (error) => (settled = { status: 'rejected', error }),
    )
    while (true) {
      await tick()
      if (settled) break
      if (timers.size === 0) {
        // 仮想タイマーが尽きても、本物のタスク待ち (Blob#text() 等) があり得るので
        // 実時間で少しだけ待ってから stalled と判定する。
        const graceEnd = nativePerfNow() + STALL_GRACE_MS
        while (!settled && timers.size === 0 && nativePerfNow() < graceEnd) await sleep(5)
        if (settled) break
        if (timers.size === 0) {
          // 実行できる処理が尽きたのに pending → resolve やコールバックの呼び忘れ
          settled = { status: 'stalled' }
          break
        }
        continue
      }
      const [id, timer] = popEarliest()
      if (++fires > MAX_TIMER_FIRES) {
        // 0ms タイマーの再帰や setInterval の止め忘れ
        settled = { status: 'runaway-timers' }
        break
      }
      now = timer.time
      if (timer.interval === null) {
        timers.delete(id)
      } else {
        // 0ms の interval で同じ時刻に無限に発火しないよう、最低 1ms は進める。
        timer.time = now + Math.max(timer.interval, 1)
        timer.seq = seq++
      }
      try {
        timer.cb.apply(undefined, timer.args)
      } catch (error) {
        // ブラウザでいう Uncaught。採点は止めないが、手掛かりとして console に出す。
        onUncaught(error)
      }
    }
    channel.port1.close()
    return settled
  }

  return drive
}

/** console.log の引数を1つの文字列に整形する。 */
function formatValue(value) {
  if (typeof value === 'string') return value
  if (typeof value === 'bigint') return `${value}n`
  if (value === undefined) return 'undefined'
  if (typeof value === 'function') return '[Function]'
  if (value instanceof Error) return `${value.name}: ${value.message}`
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return String(value)
  }
}

/** throw された値から表示用のエラーメッセージを取り出す。 */
function formatError(error) {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    const { name, message } = error
    const msg = typeof message === 'string' ? message : formatValue(message)
    // throw new Error(...) の素の Error は message だけを見せる (SPEC 4.6)。
    // ReferenceError 等は種別が手掛かりになるので name を前置する。
    if (typeof name === 'string' && name && name !== 'Error') return `${name}: ${msg}`
    return msg
  }
  return formatValue(error)
}

/**
 * 受講者コードの console 出力を親へ逐次送る (SPEC 5.3)。level でメソッドを区別する。
 * 受講者に console を差し替えられても使えるよう、出力関数 emit を返す。
 */
function installConsole(global) {
  let count = 0
  const emit = (level, text) => {
    count++
    if (count > MAX_LOGS) return
    if (count === MAX_LOGS) {
      level = 'warn'
      text = `(console 出力が ${MAX_LOGS} 件を超えたため、以降は省略します)`
    }
    self.postMessage({ type: 'log', level, text })
  }
  const consoleObj = {}
  for (const level of ['log', 'info', 'debug', 'warn', 'error']) {
    consoleObj[level] = (...args) => emit(level, args.map(formatValue).join(' '))
  }
  global.console = consoleObj
  return emit
}

/**
 * ネットワークに依存しない決定論的な fetch のモック。
 * fetch 問題が参照する固定のレスポンスだけを返す (オフライン・再現可能)。
 * 本物の通信は iframe の CSP (connect-src 'none') で遮断されている。
 */
function installFetch(global) {
  global.fetch = (url) => {
    const DB = {
      'https://dummyjson.com/todos/1': {
        id: 1,
        todo: 'Do something nice for someone you care about',
        completed: false,
        userId: 152,
      },
    }
    const body = DB[url]
    if (!body) {
      return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('Not Found')) })
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) })
  }
}

self.onmessage = async (event) => {
  const { studentCode, testCode } = event.data
  self.onmessage = null
  const emit = installConsole(self)
  const drive = installVirtualTime(self, (error) => emit('error', `Uncaught ${formatValue(error)}`))
  installFetch(self)

  self.postMessage({ type: 'started' })
  // 受講者コードと case.js を1つの async 関数にまとめる (SPEC 5.1)。
  // async でラップすることで await・Promise・setTimeout を含む問題も同じ経路で採点できる。
  // 戻り値の Promise の状態 (fulfilled / rejected) で合否を判定する。
  let promise
  try {
    promise = new Function(`return (async () => {\n${studentCode}\n;\n${testCode}\n})()`)()
  } catch (error) {
    // 構文エラー等
    promise = Promise.reject(error)
  }
  const result = await drive(promise)
  self.postMessage({
    type: 'done',
    status: result.status,
    errorMessage: result.status === 'rejected' ? formatError(result.error) : undefined,
  })
}
