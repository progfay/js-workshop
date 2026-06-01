// 3 で割り切れる
{
  const actual = fizzbuzz(3);
  if (actual !== "Fizz") {
    throw new Error(`fizzbuzz(3) は "Fizz" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}