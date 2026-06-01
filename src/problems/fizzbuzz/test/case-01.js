// 3 でも 5 でも割り切れない
{
  const actual = fizzbuzz(1);
  if (actual !== 1) {
    throw new Error(`fizzbuzz(1) は 1 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}