// a8 が 1 && 10 の結果と一致しているか
const actual: unknown = a8;
if (actual !== 10) {
  throw new Error(`a8 は 1 && 10 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
