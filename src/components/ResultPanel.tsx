import type { GradeResult } from '../runtime/runner'
import { Markdown } from './Markdown'

interface Props {
  result: GradeResult | null
  running: boolean
  solutionMarkdown: string
}

/** 採点結果の表示 (SPEC 6): 合否一覧 / Error message / console.log 出力。 */
export function ResultPanel({ result, running, solutionMarkdown }: Props) {
  if (running) {
    return <p className="result-status">実行中…</p>
  }
  if (!result) {
    return <p className="result-status">「実行」を押すと採点結果が表示されます。</p>
  }

  const passedCount = result.cases.filter((c) => c.passed).length

  return (
    <div className="result">
      <p className={`result-summary ${result.solved ? 'is-solved' : 'is-failed'}`}>
        {result.solved
          ? `✓ 全 ${result.cases.length} ケース通過 — 正解!`
          : `✗ ${passedCount} / ${result.cases.length} ケース通過`}
      </p>

      <ul className="case-list">
        {result.cases.map((c) => (
          <li key={c.name} className={c.passed ? 'is-pass' : 'is-fail'}>
            <div className="case-head">
              <span className="case-badge">{c.passed ? 'PASS' : 'FAIL'}</span>
              <span className="case-name">{c.name}</span>
              {c.timedOut && <span className="case-tag">timeout</span>}
            </div>
            {c.errorMessage && <pre className="case-error">{c.errorMessage}</pre>}
            {c.logs.length > 0 && (
              <details className="case-logs">
                <summary>console.log ({c.logs.length})</summary>
                <pre>{c.logs.join('\n')}</pre>
              </details>
            )}
          </li>
        ))}
      </ul>

      {/* 全テスト通過(正解)時のみ解説を表示する (SPEC 7) */}
      {result.solved && (
        <section className="solution">
          <h2>解説</h2>
          <Markdown>{solutionMarkdown}</Markdown>
        </section>
      )}
    </div>
  )
}
