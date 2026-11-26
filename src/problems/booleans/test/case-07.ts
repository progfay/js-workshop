// a7 が 0 && 10 の結果と一致しているか
const actual: unknown = a7;
if (actual !== 0) {
  throw new Error(`a7 は 0 && 10 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
