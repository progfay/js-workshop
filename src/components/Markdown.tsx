import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import type { ThemeName } from '../hooks/useTheme'

interface Props {
  children: string
  theme: ThemeName
}

/** problem.md / solution.md を描画する (SPEC 4.3 / 4.4)。コードブロックはハイライトする。 */
export function Markdown({ children, theme }: Props) {
  const components: Components = {
    // ブロックコードは CodeBlock(CodeMirror)でハイライト、インラインは <code> のまま。
    pre: ({ children: preChildren }) => <>{preChildren}</>,
    code: ({ className, children: codeChildren }) => {
      const text = String(codeChildren).replace(/\n$/, '')
      const isBlock = /language-/.test(className ?? '') || text.includes('\n')
      return isBlock ? (
        <CodeBlock code={text} theme={theme} />
      ) : (
        <code className={className}>{codeChildren}</code>
      )
    },
  }

  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
