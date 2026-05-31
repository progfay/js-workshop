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

const PLACEMENTS: ProblemPlacement[] = [{ id: 'array-sum', category: '配列', order: 1 }]

interface Metadata {
  id: string
  title: string
}

// ビルド時に各問題ファイルを取り込む (SPEC 3)。
const metadataModules = import.meta.glob<Metadata>('./*/metadata.json', {
  eager: true,
  import: 'default',
})
const problemModules = import.meta.glob<string>('./*/problem.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const solutionModules = import.meta.glob<string>('./*/solution.md', {
  eager: true,
  query: '?raw',
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
    problemMarkdown: pickRaw(problemModules, id, 'problem.md'),
    solutionMarkdown: pickRaw(solutionModules, id, 'solution.md'),
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
