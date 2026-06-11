import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'
import ts from 'typescript'
import * as Comlink from 'comlink'
import { createWorker } from '@valtown/codemirror-ts/worker'

/**
 * CodeMirror エディタ向けに TypeScript 言語サービスを別スレッドで動かす Worker。
 *
 * ねらい:
 * - ファイルを `.js` 拡張子 + `allowJs` で扱うことで TS 構文は許容せず、
 *   JSDoc (`@param` `@type` `@returns` 等) を型として解釈させて
 *   autocomplete / hover の精度を上げる (補完・hover 専用、診断は出さない)。
 * - TS コンパイラ + lib.d.ts という重量物をメインチャンクから隔離する。
 *
 * 言語サービスのセットアップは @valtown/codemirror-ts の worker レシピに準拠。
 */
const compilerOptions: ts.CompilerOptions = {
  // .js を解析対象にし、JSDoc 型推論を有効化する。
  allowJs: true,
  checkJs: true,
  target: ts.ScriptTarget.ES2022,
  lib: ['es2022', 'dom', 'dom.iterable'],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  // 診断 (tsLinter) は使わないため strict は不要。補完の安定性を優先する。
  strict: false,
  noEmit: true,
}

Comlink.expose(
  createWorker(async () => {
    // lib.d.ts は CDN から取得する。Worker は localStorage を持たないため
    // キャッシュ無効 (第3引数 false)。バージョンは同梱の typescript に合わせる。
    const fsMap = await createDefaultMapFromCDN(
      compilerOptions,
      ts.version,
      false,
      ts,
    )
    const system = createSystem(fsMap)
    return createVirtualTypeScriptEnvironment(system, [], ts, compilerOptions)
  }),
)
