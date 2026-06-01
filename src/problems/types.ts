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
  /** problem.md をビルド時に HTML 化したものを遅延ロードする (問題押下時に dynamic import) */
  loadProblemHtml: () => Promise<string>
  /** solution.md をビルド時に HTML 化したものを遅延ロードする (正解表示時に dynamic import) */
  loadSolutionHtml: () => Promise<string>
  template: string
  tests: ProblemTestCase[]
}

export interface ProblemCategory {
  name: string
  problems: Problem[]
}
