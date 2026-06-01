{
  const actual = eat("bananas");
  const expected = "bananas tasted really good.";
  if (actual !== expected) {
    throw new Error(`eat("bananas") は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}