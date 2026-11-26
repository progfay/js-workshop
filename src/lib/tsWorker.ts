import * as Comlink from 'comlink'
import { createWorker } from '@valtown/codemirror-ts/worker'
import { createTsEnv } from './tsEnv'

/**
 * CodeMirror エディタ向けに TypeScript 言語サービスを別スレッドで動かす Worker。
 *
 * 補完 / hover / 型エラー表示 (診断) に使う。採点時の型チェックと同じ環境
 * (tsEnv.ts) を使うので、エディタで赤線が出ないコードは採点でも型エラーにならない。
 * TS コンパイラ + lib.d.ts という重量物をメインチャンクから隔離する。
 *
 * 言語サービスのセットアップは @valtown/codemirror-ts の worker レシピに準拠。
 */
Comlink.expose(createWorker(async () => createTsEnv()))
