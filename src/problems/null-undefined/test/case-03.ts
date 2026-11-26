// 0 は null/undefined ではないのでそのまま
{
  const actual = getOrDefault(0, "default");
  if (actual !== 0) {
    throw new Error(`getOrDefault(0, "default") は 0 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}