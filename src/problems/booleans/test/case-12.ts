// a12 が 1 || 10 の結果と一致しているか
const actual: unknown = a12;
if (actual !== 1) {
  throw new Error(`a12 は 1 || 10 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
