// a2 が 0 === 1 の結果と一致しているか
const actual: unknown = a2;
if (actual !== false) {
  throw new Error(`a2 は 0 === 1 の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
