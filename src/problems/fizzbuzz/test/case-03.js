// 5 で割り切れる
{
  const actual = fizzbuzz(5);
  if (actual !== "Buzz") {
    throw new Error(`fizzbuzz(5) は "Buzz" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}