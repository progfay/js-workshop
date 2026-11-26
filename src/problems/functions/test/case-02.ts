{
  const actual = eat("pizza");
  const expected = "pizza tasted really good.";
  if (actual !== expected) {
    throw new Error(`eat("pizza") は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}