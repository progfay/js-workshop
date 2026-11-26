/**
 * Prettier(standalone, ブラウザ実行)で TypeScript を整形する。
 * 初期バンドルを膨らませないよう、Prettier 本体とプラグインは動的 import する。
 */
export async function formatTs(code: string): Promise<string> {
  const [prettier, typescript, estree] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/typescript'),
    import('prettier/plugins/estree'),
  ])
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [typescript, estree],
    tabWidth: 2,
  })
}
