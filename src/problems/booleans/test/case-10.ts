// a10 が 1 || "" の結果と一致しているか
const actual: unknown = a10;
if (actual !== 1) {
  throw new Error(`a10 は 1 || "" の結果と一致しません (現在: ${JSON.stringify(actual)})`);
}
