import { useEffect, useMemo, useState } from 'react'
import { categories, problems } from './problems'
import type { Problem } from './problems/types'
import { grade, type GradeResult } from './runtime/runner'
import { Editor } from './components/Editor'
import { Markdown } from './components/Markdown'
import { ResultPanel } from './components/ResultPanel'
import { ResizableDrawer } from './components/ResizableDrawer'
import { useTheme } from './hooks/useTheme'
import { loadCode, loadProgress, saveCode, setSolved, type Progress } from './storage/storage'
import './styles/app.css'

export default function App() {
  const { theme, toggle } = useTheme()
  const [currentId, setCurrentId] = useState<string>(() => problems[0]?.id ?? '')
  const current = useMemo<Problem | undefined>(
    () => problems.find((problem) => problem.id === currentId),
    [currentId],
  )
  const [code, setCode] = useState<string>('')
  const [result, setResult] = useState<GradeResult | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  // 問題切り替え時: 保存コード or テンプレートを読み込み、前回の結果を消す。
  useEffect(() => {
    if (!current) return
    setCode(loadCode(current.id) ?? current.template)
    setResult(null)
  }, [current])

  // コード変更を localStorage に保存 (SPEC 9)。
  useEffect(() => {
    if (current) saveCode(current.id, code)
  }, [current, code])

  if (!current) {
    return <p className="empty">問題がありません。</p>
  }

  const run = async () => {
    setRunning(true)
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
    setResult(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>JavaScript 演習</h1>
        <button className="theme-toggle" onClick={toggle}>
          {theme === 'dark' ? '☀️ ライト' : '🌙 ダーク'}
        </button>
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

        {/* 中央: 問題説明 */}
        <section className="description">
          <Markdown>{current.problemMarkdown}</Markdown>
        </section>

        {/* 右: エディタ + 下部ドロワー */}
        <section className="editor-pane">
          <div className="editor-wrap">
            <Editor value={code} onChange={setCode} theme={theme} />
          </div>

          <ResizableDrawer>
            <div className="drawer-toolbar">
              <button className="run" onClick={run} disabled={running}>
                {running ? '実行中…' : '▶ 実行'}
              </button>
              <button className="reset" onClick={reset} disabled={running}>
                リセット
              </button>
            </div>

            <div className="drawer-content">
              <ResultPanel
                result={result}
                running={running}
                solutionMarkdown={current.solutionMarkdown}
              />

              <details className="tests-source">
                <summary>テストケースを見る ({current.tests.length})</summary>
                {current.tests.map((test) => (
                  <div key={test.name} className="test-source">
                    <h3>{test.name}</h3>
                    <pre>{test.code}</pre>
                  </div>
                ))}
              </details>
            </div>
          </ResizableDrawer>
        </section>
      </div>
    </div>
  )
}
