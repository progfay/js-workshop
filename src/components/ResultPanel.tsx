import type { GradeResult } from '../runtime/runner'
import type { ThemeName } from '../hooks/useTheme'
import { CodeBlock } from './CodeBlock'

interface Props {
  result: GradeResult | null
  running: boolean
  theme: ThemeName
}

/** 採点結果の表示 (SPEC 6): 合否一覧 / Error message / console.log 出力。 */
export function ResultPanel({ result, running, theme }: Props) {
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
          // PASS / FAIL とも開閉式。summary(左に三角)を押すとテストコードを開閉。
          // FAIL は summary 内に Error message も表示し(赤い領域がクリック対象)、
          // 最初からアコーディオンを開いた状態で表示する。
          <li key={c.name} className={c.passed ? 'is-pass' : 'is-fail'}>
            <details open={!c.passed}>
              <summary className="case-summary">
                <span className="case-summary-body">
                  <span className="case-head">
                    <span className="case-badge">{c.passed ? 'PASS' : 'FAIL'}</span>
                    <span className="case-name">{c.name}</span>
                    {c.timedOut && <span className="case-tag">timeout</span>}
                  </span>
                  {c.errorMessage && <span className="case-error">{c.errorMessage}</span>}
                </span>
              </summary>

              <CodeBlock code={c.code} theme={theme} />

              {c.logs.length > 0 && (
                <details className="case-logs">
                  <summary>console ({c.logs.length})</summary>
                  <pre>
                    {c.logs.map((log, i) => (
                      <span key={i} className={`log-line log-${log.level}`}>
                        <span className="log-level">{log.level}</span>
                        {log.text}
                        {'\n'}
                      </span>
                    ))}
                  </pre>
                </details>
              )}
            </details>
          </li>
        ))}
      </ul>
    </div>
  )
}
