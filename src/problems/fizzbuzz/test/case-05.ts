// 大きい FizzBuzz
{
  const actual = fizzbuzz(30);
  if (actual !== "FizzBuzz") {
    throw new Error(`fizzbuzz(30) は "FizzBuzz" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}