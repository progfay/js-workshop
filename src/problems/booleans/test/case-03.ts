// a3 が 10 == "10" の結果と一致しているか
const actual: unknown = a3;
if (actual !== true) {
  throw new Error(`a3 は 10 == "10" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
