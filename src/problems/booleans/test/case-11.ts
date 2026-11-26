// a11 が 0 || 10 の結果と一致しているか
const actual: unknown = a11;
if (actual !== 10) {
  throw new Error(`a11 は 0 || 10 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
