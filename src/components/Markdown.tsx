interface Props {
  /** ビルド時に markdown からレンダリング済みの HTML (SPEC 4.3 / 4.4) */
  html: string
}

/**
 * problem.md / solution.md をビルド時に変換した HTML を描画する。
 * パースとコードブロックのハイライトはビルド時に済ませてある (markdown-html プラグイン)。
 */
export function Markdown({ html }: Props) {
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
}
