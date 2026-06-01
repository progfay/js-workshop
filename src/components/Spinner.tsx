interface Props {
  /** スピナーの下に表示する補助テキスト(任意)。 */
  label?: string
}

/** 読み込み中に中央へ表示する共通ローディングインジケータ。 */
export function Spinner({ label }: Props) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      {label && <span className="loading-label">{label}</span>}
    </div>
  )
}
