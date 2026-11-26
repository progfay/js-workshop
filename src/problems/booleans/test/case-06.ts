// a6 が 1 && "" の結果と一致しているか
const actual: unknown = a6;
if (actual !== "") {
  throw new Error(`a6 は 1 && "" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
