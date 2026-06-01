// 6 文字 (5 より大きい)
{
  const actual = describe("orange");
  const expected = "The fruit name has more than five characters.";
  if (actual !== expected) {
    throw new Error(`describe("orange") は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}