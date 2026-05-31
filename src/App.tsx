import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, problems } from './problems'
import type { Problem } from './problems/types'
import { grade, type GradeResult } from './runtime/runner'
import { Editor } from './components/Editor'
import { Markdown } from './components/Markdown'
import { ResultPanel } from './components/ResultPanel'
import { ResizableDrawer } from './components/ResizableDrawer'
import { useSystemTheme } from './hooks/useTheme'
import { loadCode, loadProgress, saveCode, setSolved, type Progress } from './storage/storage'
import { formatJs } from './lib/format'
import './styles/app.css'

const PROBLEM_PARAM = 'problem'

/** URL クエリ ?problem=<id> から初期表示する問題を決める。無効なら先頭の問題。 */
function getInitialProblemId(): string {
  const fromUrl = new URLSearchParams(window.location.search).get(PROBLEM_PARAM)
  if (fromUrl && problems.some((problem) => problem.id === fromUrl)) {
    return fromUrl
  }
  return problems[0]?.id ?? ''
}

export default function App() {
  const theme = useSystemTheme()
  const [currentId, setCurrentId] = useState<string>(getInitialProblemId)
  const current = useMemo<Problem | undefined>(
    () => problems.find((problem) => problem.id === currentId),
    [currentId],
  )
  const [code, setCode] = useState<string>('')
  const [result, setResult] = useState<GradeResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [formatError, setFormatError] = useState<string | null>(null)
  // 実行結果ドロワーはデフォルト非表示。実行時に開く。
  const [drawerOpen, setDrawerOpen] = useState(false)
  // 説明(中央)とエディタ(右)の幅比率。中央の縦線ドラッグで調整する。
  const [descWidth, setDescWidth] = useState(420)
  const descRef = useRef<HTMLElement>(null)
  const colDragging = useRef(false)
  // キーボードショートカット(⌘/Ctrl+S)から最新の整形処理を呼ぶための ref。
  const formatRef = useRef<() => void>(() => {})

  // 問題を開いたとき: 保存済みコードがあれば復元、なければ template (SPEC 9)。
  // 前回の採点結果もクリアする。
  useEffect(() => {
    if (!current) return
    setCode(loadCode(current.id) ?? current.template)
    setResult(null)
    setFormatError(null)
    setDrawerOpen(false)
  }, [current])

  // 選択中の問題を URL クエリに反映する(履歴は汚さず replaceState)。
  useEffect(() => {
    if (!currentId) return
    const params = new URLSearchParams(window.location.search)
    params.set(PROBLEM_PARAM, currentId)
    window.history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`)
  }, [currentId])

  // ⌘/Ctrl+S で整形(ブラウザの保存ダイアログは抑止する)。
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        formatRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // 中央の縦線ドラッグで説明カラムの幅を変える(エディタは残りを占有)。
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const el = descRef.current
      if (!colDragging.current || !el) return
      const left = el.getBoundingClientRect().left
      const body = el.parentElement
      const max = body ? body.getBoundingClientRect().right - 320 - left : 1200
      const next = Math.min(Math.max(event.clientX - left, 240), Math.max(240, max))
      setDescWidth(next)
    }
    const stop = () => {
      if (!colDragging.current) return
      colDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', stop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', stop)
    }
  }, [])

  if (!current) {
    return <p className="empty">問題がありません。</p>
  }

  // コード変更は都度 localStorage に保存する。問題切り替え時の取り違えを避けるため
  // effect ではなく onChange 側で (id, code) を必ず一致させて保存する。
  const handleCodeChange = (value: string) => {
    setCode(value)
    saveCode(current.id, value)
  }

  const run = async () => {
    setRunning(true)
    setDrawerOpen(true)
    setResult(null)
    // 同期実行で固まる前に「実行中…」を描画させる。
    await new Promise((resolve) => setTimeout(resolve, 0))
    const graded = await grade(code, current.tests)
    setResult(graded)
    setRunning(false)
    setProgress(setSolved(current.id, graded.solved))
  }

  const reset = () => {
    setCode(current.template)
    saveCode(current.id, current.template)
    setResult(null)
    setDrawerOpen(false)
  }

  // Prettier で整形。構文エラー時はメッセージを出す。
  const format = async () => {
    try {
      const formatted = await formatJs(code)
      setCode(formatted)
      saveCode(current.id, formatted)
      setFormatError(null)
    } catch {
      setFormatError('整形できませんでした(構文エラーの可能性があります)')
    }
  }
  // ⌘/Ctrl+S から常に最新のクロージャを呼べるよう毎レンダーで更新する。
  formatRef.current = () => void format()

  const startColDrag = (event: React.PointerEvent) => {
    event.preventDefault()
    colDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const solved = progress[current.id] === true

  return (
    <div className="app">
      <header className="app-header">
        <h1>JavaScript 演習</h1>
      </header>

      <div className="app-body">
        {/* 左: 問題ナビゲーション */}
        <aside className="sidebar">
          {categories.map((category) => (
            <div key={category.name} className="cat">
              <h2 className="cat-name">{category.name}</h2>
              <ul>
                {category.problems.map((problem) => (
                  <li key={problem.id}>
                    <button
                      className={problem.id === currentId ? 'prob is-current' : 'prob'}
                      onClick={() => setCurrentId(problem.id)}
                    >
                      <span className="prob-status">{progress[problem.id] ? '✓' : '・'}</span>
                      <span className="prob-title">{problem.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* 中央: 問題説明 + 正解時の解説 */}
        <section className="description" ref={descRef} style={{ width: descWidth }}>
          <Markdown theme={theme}>{current.problemMarkdown}</Markdown>

          {/* 全テスト通過(正解)時のみ解説を表示する (SPEC 7) */}
          {solved && (
            <section className="solution">
              <h2>解説</h2>
              <Markdown theme={theme}>{current.solutionMarkdown}</Markdown>
            </section>
          )}
        </section>

        {/* 説明とエディタを分ける、左右ドラッグ可能な縦線 */}
        <div
          className="col-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="説明とエディタの幅を変更"
          onPointerDown={startColDrag}
        />

        {/* 右: ツールバー + エディタ + 下部ドロワー(実行結果) */}
        <section className="editor-pane">
          <div className="editor-toolbar">
            <button className="run" onClick={run} disabled={running}>
              {running ? '実行中…' : '▶ 実行'}
            </button>
            <button
              className="format"
              onClick={() => void format()}
              disabled={running}
              title="⌘/Ctrl+S"
            >
              整形
            </button>
            <button className="reset" onClick={reset} disabled={running}>
              リセット
            </button>
            {formatError && <span className="format-error">{formatError}</span>}
            {result && (
              <button className="toggle-drawer" onClick={() => setDrawerOpen((open) => !open)}>
                {drawerOpen ? '結果を隠す' : '結果を表示'}
              </button>
            )}
          </div>

          <div className="editor-wrap">
            <Editor value={code} onChange={handleCodeChange} theme={theme} />
          </div>

          {drawerOpen && (
            <ResizableDrawer>
              <div className="drawer-headerbar">
                <span className="drawer-title">実行結果</span>
                <button
                  className="drawer-close"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="結果を閉じる"
                >
                  ✕
                </button>
              </div>
              <div className="drawer-content">
                <ResultPanel result={result} running={running} theme={theme} />
              </div>
            </ResizableDrawer>
          )}
        </section>
      </div>
    </div>
  )
}
