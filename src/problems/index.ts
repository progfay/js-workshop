import type { Problem, ProblemCategory, ProblemTestCase } from './types'

/**
 * category / order は問題ファイル(metadata.json)側には持たせず、
 * 読み込み側であるこのローダで指定する (SPEC 4.2 / 8)。
 * 新しい問題を追加したらこの配列に1行足す。
 */
interface ProblemPlacement {
  id: string
  category: string
  order: number
}

// @recruit-tech/javascripting の問題をテーマ別カテゴリに分類して配置する。
// order はこの並び順 (テーマごとに連続) に沿った通し番号。各テーマ内は元の menu.json の順序を踏襲。
const PLACEMENTS: ProblemPlacement[] = [
  // はじめの一歩
  { id: 'introduction', category: 'はじめの一歩', order: 1 },
  { id: 'variables', category: 'はじめの一歩', order: 2 },
  { id: 'booleans', category: 'はじめの一歩', order: 3 },
  { id: 'null-undefined', category: 'はじめの一歩', order: 4 },
  // 文字列
  { id: 'strings', category: '文字列', order: 5 },
  { id: 'string-length', category: '文字列', order: 6 },
  { id: 'revising-strings', category: '文字列', order: 7 },
  // 数値
  { id: 'numbers', category: '数値', order: 8 },
  { id: 'rounding-numbers', category: '数値', order: 9 },
  { id: 'number-to-string', category: '数値', order: 10 },
  { id: 'fizzbuzz', category: '数値', order: 11 },
  // 制御構文
  { id: 'if-statement', category: '制御構文', order: 12 },
  { id: 'for-loop', category: '制御構文', order: 13 },
  // 配列
  { id: 'arrays', category: '配列', order: 14 },
  { id: 'accessing-array-values', category: '配列', order: 15 },
  { id: 'looping-through-arrays', category: '配列', order: 16 },
  { id: 'array-filtering', category: '配列', order: 17 },
  { id: 'arrays-more', category: '配列', order: 18 },
  // オブジェクト
  { id: 'objects', category: 'オブジェクト', order: 19 },
  { id: 'object-properties', category: 'オブジェクト', order: 20 },
  { id: 'object-keys', category: 'オブジェクト', order: 21 },
  { id: 'object-spreading', category: 'オブジェクト', order: 22 },
  { id: 'destructuring', category: 'オブジェクト', order: 23 },
  // 関数
  { id: 'functions', category: '関数', order: 24 },
  { id: 'function-arguments', category: '関数', order: 25 },
  { id: 'arrow-functions', category: '関数', order: 26 },
  // スコープとクロージャ
  { id: 'scope', category: 'スコープとクロージャ', order: 27 },
  { id: 'closure', category: 'スコープとクロージャ', order: 28 },
  // 非同期処理
  { id: 'callback', category: '非同期処理', order: 29 },
  { id: 'promise', category: '非同期処理', order: 30 },
  { id: 'promise-all', category: '非同期処理', order: 31 },
  { id: 'async-await', category: '非同期処理', order: 32 },
  { id: 'fetch', category: '非同期処理', order: 33 },
  // 応用
  { id: 'use-regex-luke', category: '応用', order: 34 },
  { id: 'pagination', category: '応用', order: 35 },
]

interface Metadata {
  id: string
  title: string
}

// ビルド時に各問題ファイルを取り込む (SPEC 3)。
const metadataModules = import.meta.glob<Metadata>('./*/metadata.json', {
  eager: true,
  import: 'default',
})
// problem.md / solution.md は markdown-html プラグインがビルド時に HTML 文字列へ変換する。
const problemModules = import.meta.glob<string>('./*/problem.md', {
  eager: true,
  import: 'default',
})
const solutionModules = import.meta.glob<string>('./*/solution.md', {
  eager: true,
  import: 'default',
})
const templateModules = import.meta.glob<string>('./*/template.js', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const testModules = import.meta.glob<string>('./*/test/*.js', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function pickRaw(modules: Record<string, string>, id: string, file: string): string {
  const value = modules[`./${id}/${file}`]
  if (value === undefined) {
    throw new Error(`問題 "${id}" の ${file} が見つかりません`)
  }
  return value
}

function testsFor(id: string): ProblemTestCase[] {
  const prefix = `./${id}/test/`
  return Object.keys(testModules)
    .filter((path) => path.startsWith(prefix))
    .sort()
    .map((path) => ({
      name: path.slice(prefix.length).replace(/\.js$/, ''),
      code: testModules[path],
    }))
}

function buildProblem({ id, category, order }: ProblemPlacement): Problem {
  const metadata = metadataModules[`./${id}/metadata.json`]
  if (!metadata) {
    throw new Error(`問題 "${id}" の metadata.json が見つかりません`)
  }
  return {
    id,
    title: metadata.title,
    category,
    order,
    problemHtml: pickRaw(problemModules, id, 'problem.md'),
    solutionHtml: pickRaw(solutionModules, id, 'solution.md'),
    template: pickRaw(templateModules, id, 'template.js'),
    tests: testsFor(id),
  }
}

export const problems: Problem[] = PLACEMENTS.map(buildProblem)

export function getProblem(id: string): Problem | undefined {
  return problems.find((problem) => problem.id === id)
}

/** カテゴリごとにまとめ、order 昇順で並べた一覧 (SPEC 8)。 */
export const categories: ProblemCategory[] = (() => {
  const byCategory = new Map<string, Problem[]>()
  for (const problem of [...problems].sort((a, b) => a.order - b.order)) {
    const list = byCategory.get(problem.category) ?? []
    list.push(problem)
    byCategory.set(problem.category, list)
  }
  return [...byCategory.entries()].map(([name, list]) => ({ name, problems: list }))
})()
