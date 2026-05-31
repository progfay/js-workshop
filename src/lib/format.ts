/**
 * Prettier(standalone, ブラウザ実行)で JavaScript を整形する。
 * 初期バンドルを膨らませないよう、Prettier 本体とプラグインは動的 import する。
 */
export async function formatJs(code: string): Promise<string> {
  const [prettier, babel, estree] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
  ])
  return prettier.format(code, {
    parser: 'babel',
    plugins: [babel, estree],
    tabWidth: 2,
  })
}
