export interface ProblemTestCase {
  /** ファイル名から導出した表示名 (例: "case-01") */
  name: string
  /** テストケースのソースコード。受講者にも公開する (SPEC 4.6) */
  code: string
}

export interface Problem {
  id: string
  title: string
  /** category / order はローダ側で指定する (SPEC 4.2 / 8) */
  category: string
  order: number
  /** ビルド時に markdown からレンダリング済みの HTML (problem.md) */
  problemHtml: string
  /** ビルド時に markdown からレンダリング済みの HTML (solution.md) */
  solutionHtml: string
  template: string
  tests: ProblemTestCase[]
}

export interface ProblemCategory {
  name: string
  problems: Problem[]
}
