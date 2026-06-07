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
  // GitHub Pages のプロジェクトページ (https://progfay.github.io/js-workshop/)
  // 配下で配信するためのベースパス。
  base: '/js-workshop/',
  plugins: [markdownHtml(), react()],
  // QuickJS の変換 (release-sync) は WASM を伴う。pre-bundle すると dev で
  // wasm が正しく読み込めないため除外する。
  optimizeDeps: {
    exclude: ['quickjs-emscripten-core', '@jitl/quickjs-wasmfile-release-sync'],
  },
  build: {
    // 500kB 超の唯一のチャンクは CodeMirror (約507kB) で、必要時に読み込む
    // 意図的な async ベンダチャンク。エントリを塞がないため閾値を上げて警告を抑制する。
    chunkSizeWarningLimit: 600,
  },
})
