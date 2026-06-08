// localStorage への保存 (SPEC 9)。プライベートブラウズ等で失敗しても
// アプリが落ちないよう、すべて try/catch でフォールバックする。

const CODE_PREFIX = 'jsw:code:'
const PROGRESS_KEY = 'jsw:progress'
const SPLIT_KEY = 'jsw:split'

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

/** 説明カラムが占める幅の割合 (0..1)。未保存ならデフォルト 0.5 (50/50)。 */
export function loadSplitRatio(): number {
  try {
    const raw = localStorage.getItem(SPLIT_KEY)
    if (raw == null) return 0.5
    const value = Number(raw)
    return Number.isFinite(value) && value > 0 && value < 1 ? value : 0.5
  } catch {
    return 0.5
  }
}

/** 説明カラムが占める幅の割合 (0..1) を保存する。 */
export function saveSplitRatio(ratio: number): void {
  try {
    localStorage.setItem(SPLIT_KEY, String(ratio))
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
