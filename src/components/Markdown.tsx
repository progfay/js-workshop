import { Spinner } from './Spinner'

interface Props {
  /** ビルド時に markdown からレンダリング済みの HTML (SPEC 4.3 / 4.4) */
  html: string
}

/**
 * problem.md / solution.md をビルド時に変換した HTML を描画する。
 * パースとコードブロックのハイライトはビルド時に済ませてある (markdown-html プラグイン)。
 * HTML はオンデマンドで dynamic import するため、未取得の間はローディング表示にする。
 */
export function Markdown({ html }: Props) {
  if (!html) {
    return <Spinner label="読み込み中…" />
  }
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
}
