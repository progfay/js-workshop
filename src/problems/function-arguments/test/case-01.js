{
  const actual = math(53, 61, 67);
  if (actual !== 4140) {
    throw new Error(`math(53, 61, 67) は 4140 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}