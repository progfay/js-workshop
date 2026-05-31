// localStorage への保存 (SPEC 9)。プライベートブラウズ等で失敗しても
// アプリが落ちないよう、すべて try/catch でフォールバックする。

const CODE_PREFIX = 'jsw:code:'
const PROGRESS_KEY = 'jsw:progress'

export type Progress = Record<string, boolean>

/** 受講者が書いたコードを問題ごとに読み込む。 */
export function loadCode(problemId: string): string | null {
  try {
    return localStorage.getItem(CODE_PREFIX + problemId)
  } catch {
    return null
  }
}

/** 受講者が書いたコードを問題ごとに保存する。 */
export function saveCode(problemId: string, code: string): void {
  try {
    localStorage.setItem(CODE_PREFIX + problemId, code)
  } catch {
    /* 保存できなくても処理は続行する */
  }
}

/** 進捗(どの問題を正解したか)を読み込む。 */
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as Progress) : {}
  } catch {
    return {}
  }
}

/** 指定問題の正解フラグを更新し、更新後の進捗を返す。 */
export function setSolved(problemId: string, solved: boolean): Progress {
  const progress = loadProgress()
  progress[problemId] = solved
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    /* 保存できなくても処理は続行する */
  }
  return progress
}
