if (a10 !== (1 || "")) {
  throw new Error(`a10 は 1 || "" の結果と一致しません (現在: ${JSON.stringify(a10)})`);
}