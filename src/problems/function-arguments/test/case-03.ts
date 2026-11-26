{
  const actual = math(0, 5, 5);
  if (actual !== 25) {
    throw new Error(`math(0, 5, 5) は 25 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}