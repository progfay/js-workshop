{
  const actual = math(1, 2, 3);
  if (actual !== 7) {
    throw new Error(`math(1, 2, 3) は 7 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}