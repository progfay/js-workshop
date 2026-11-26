{
  const actual = eat("apples");
  const expected = "apples tasted really good.";
  if (actual !== expected) {
    throw new Error(`eat("apples") は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}