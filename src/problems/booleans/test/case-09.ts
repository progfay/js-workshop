// a9 が 0 || "" の結果と一致しているか
const actual: unknown = a9;
if (actual !== "") {
  throw new Error(`a9 は 0 || "" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
