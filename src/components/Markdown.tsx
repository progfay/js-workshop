import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** problem.md / solution.md を描画する (SPEC 4.3 / 4.4)。 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
