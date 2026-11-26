// a4 が 10 === "10" の結果と一致しているか
const actual: unknown = a4;
if (actual !== false) {
  throw new Error(`a4 は 10 === "10" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
