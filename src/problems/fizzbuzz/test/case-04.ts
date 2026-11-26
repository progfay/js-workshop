// 3 でも 5 でも割り切れる
{
  const actual = fizzbuzz(15);
  if (actual !== "FizzBuzz") {
    throw new Error(`fizzbuzz(15) は "FizzBuzz" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}