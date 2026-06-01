// 割り切れない数は数値のまま返す
{
  const actual = fizzbuzz(7);
  if (actual !== 7) {
    throw new Error(`fizzbuzz(7) は 数値 7 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}