import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeStringify from 'rehype-stringify'

/**
 * problem.md / solution.md をビルド時に HTML 文字列へ変換するプラグイン。
 * 実行時パース (react-markdown) を排し、クライアントから markdown パーサを除去する。
 * コードブロックは Shiki の dual-theme で静的ハイライトし、ライト/ダークは
 * CSS 変数 (--shiki-light / --shiki-dark) を [data-theme='dark'] 配下で
 * 切り替えることで追従させる (src/styles/app.css)。
 */
function markdownHtml(): Plugin {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
    })
    .use(rehypeStringify)

  return {
    name: 'markdown-html',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return null
      const file = await processor.process(code)
      return { code: `export default ${JSON.stringify(String(file))}`, map: null }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [markdownHtml(), react()],
  // quickjs-emscripten ships a WASM variant; let Vite handle it without
  // pre-bundling so the embedded wasm loads correctly in dev.
  optimizeDeps: {
    exclude: ['quickjs-emscripten'],
  },
})
