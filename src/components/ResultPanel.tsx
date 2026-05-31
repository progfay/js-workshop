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
        {result.cases.map((c) =>
          c.passed ? (
            // 成功ケース: 折りたたみ。開くとテストケースのコードを表示する。
            <li key={c.name} className="is-pass">
              <details>
                <summary className="case-head">
                  <span className="case-badge">PASS</span>
                  <span className="case-name">{c.name}</span>
                </summary>
                <CodeBlock code={c.code} theme={theme} />
                {c.logs.length > 0 && (
                  <details className="case-logs">
                    <summary>console.log ({c.logs.length})</summary>
                    <pre>{c.logs.join('\n')}</pre>
                  </details>
                )}
              </details>
            </li>
          ) : (
            // 失敗ケース: throw された Error message と log をそのまま表示する。
            <li key={c.name} className="is-fail">
              <div className="case-head">
                <span className="case-badge">FAIL</span>
                <span className="case-name">{c.name}</span>
                {c.timedOut && <span className="case-tag">timeout</span>}
              </div>
              {c.errorMessage && <pre className="case-error">{c.errorMessage}</pre>}
              <details className="case-code">
                <summary>テストケース</summary>
                <CodeBlock code={c.code} theme={theme} />
              </details>
              {c.logs.length > 0 && (
                <details className="case-logs">
                  <summary>console.log ({c.logs.length})</summary>
                  <pre>{c.logs.join('\n')}</pre>
                </details>
              )}
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
