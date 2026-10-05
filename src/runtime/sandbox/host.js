// sandbox iframe (opaque origin) の中で動くホストスクリプト。
// runner.ts が srcdoc に埋め込み、直前に `const WORKER_SOURCE = "..."` を定義する。
//
// 1ケースごとに blob: URL から Worker を起動し、実行開始から timeoutMs を超えたら
// terminate() で打ち切る (同期・マイクロタスクの無限ループは Worker 内からは止められない)。
//
// 親 (runner.ts) とのプロトコル:
//   受信: { type: 'run', id, studentCode, testCode, timeoutMs }
//   送信: { type: 'ready' }
//         { type: 'result', id, status, errorMessage?, logs }
//           status: 'fulfilled' | 'rejected' | 'stalled' | 'runaway-timers' | 'timeout' | 'crashed'

/* global WORKER_SOURCE */

/** Worker の起動 (started が届くまで) を待つ上限 (ms)。起動の遅い端末でも余裕を持たせる。 */
const STARTUP_TIMEOUT_MS = 10000

const workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }))

function runCase({ id, studentCode, testCode, timeoutMs }) {
  const logs = []
  const worker = new Worker(workerUrl)
  let finished = false
  let timer = 0

  const finish = (result) => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    worker.terminate()
    parent.postMessage({ type: 'result', id, logs, ...result }, '*')
  }

  timer = setTimeout(
    () => finish({ status: 'crashed', errorMessage: '実行環境の起動に失敗しました' }),
    STARTUP_TIMEOUT_MS,
  )
  worker.onmessage = (event) => {
    const message = event.data
    if (message.type === 'started') {
      // 起動時間を除き、受講者コードの実行開始からタイムアウトを計る。
      clearTimeout(timer)
      timer = setTimeout(() => finish({ status: 'timeout' }), timeoutMs)
    } else if (message.type === 'log') {
      logs.push({ level: message.level, text: message.text })
    } else if (message.type === 'done') {
      finish({ status: message.status, errorMessage: message.errorMessage })
    }
  }
  // 巨大なメモリ確保などで Worker ごと落ちた場合。
  worker.onerror = (event) => {
    event.preventDefault()
    finish({ status: 'crashed', errorMessage: event.message || '実行環境が異常終了しました' })
  }
  worker.postMessage({ studentCode, testCode })
}

window.addEventListener('message', (event) => {
  // 親 (アプリ本体) からのメッセージだけを受け付ける。
  if (event.source !== parent) return
  if (event.data && event.data.type === 'run') runCase(event.data)
})

parent.postMessage({ type: 'ready' }, '*')
