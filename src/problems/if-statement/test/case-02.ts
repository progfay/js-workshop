// ちょうど 5 文字 (5 以下)
{
  const actual = describe("apple");
  const expected = "The fruit name has five characters or less.";
  if (actual !== expected) {
    throw new Error(`describe("apple") は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}