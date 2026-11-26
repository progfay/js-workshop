import { createSystem, createVirtualTypeScriptEnvironment } from '@typescript/vfs'
import ts from 'typescript'

/**
 * エディタの言語サービスと採点時の型チェックで共有する TypeScript 環境。
 *
 * - lib.d.ts は CDN から取らず、typescript パッケージのものをビルド時に同梱する
 *   (完全クライアント完結 / オフラインでも採点できる, SPEC 2)。
 * - 実行環境 (sandbox の Worker) に合わせ、DOM lib は使わない。代わりに受講者コードが
 *   使えるグローバル (console / タイマー / fetch) だけを globals.d.ts で宣言する。
 */

// ES2022 までの lib だけを取り込む。*.full は DOM を参照するので除外する。
const libModules = import.meta.glob<string>(
  [
    '../../node_modules/typescript/lib/lib.{decorators,decorators.legacy,es5}.d.ts',
    '../../node_modules/typescript/lib/lib.es201[5-9]*.d.ts',
    '../../node_modules/typescript/lib/lib.es202[0-2]*.d.ts',
    '!../../node_modules/typescript/lib/lib.*.full.d.ts',
  ],
  { query: '?raw', import: 'default', eager: true },
)

/** sandbox (Web Worker) が提供するグローバルだけを宣言する。 */
const GLOBALS_PATH = '/globals.d.ts'
const globalsSource = `
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): number;
declare function clearTimeout(id: number | undefined): void;
declare function setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): number;
declare function clearInterval(id: number | undefined): void;

interface Console {
  log(...data: unknown[]): void;
  info(...data: unknown[]): void;
  debug(...data: unknown[]): void;
  warn(...data: unknown[]): void;
  error(...data: unknown[]): void;
}
declare const console: Console;

interface Response {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<any>;
}
declare function fetch(input: string): Promise<Response>;
`

/**
 * 受講者コードは TypeScript として厳格 (strict) に検査する。
 * moduleDetection: 'force' で常にモジュール扱いにし、トップレベル await を許可しつつ
 * グローバル宣言 (例: length や name) との名前衝突を避ける。
 */
export const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  lib: ['es2022'],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  moduleDetection: ts.ModuleDetectionKind.Force,
  types: [],
  strict: true,
  skipLibCheck: true,
  noEmit: true,
}

export function createTsEnv() {
  const fsMap = new Map<string, string>()
  for (const [path, source] of Object.entries(libModules)) {
    fsMap.set(`/${path.slice(path.lastIndexOf('/') + 1)}`, source)
  }
  fsMap.set(GLOBALS_PATH, globalsSource)
  const system = createSystem(fsMap)
  return createVirtualTypeScriptEnvironment(system, [GLOBALS_PATH], ts, compilerOptions)
}
