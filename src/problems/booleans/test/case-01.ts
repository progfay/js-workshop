// a1 が 0 == 1 の結果と一致しているか
const actual: unknown = a1;
if (actual !== false) {
  throw new Error(`a1 は 0 == 1 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
