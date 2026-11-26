// a5 が 0 && "" の結果と一致しているか
const actual: unknown = a5;
if (actual !== 0) {
  throw new Error(`a5 は 0 && "" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
