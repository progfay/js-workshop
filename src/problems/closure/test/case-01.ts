// increment は 0 から増えて 1 を返す
{
  const [increment] = makeCounter();
  const actual = increment();
  if (actual !== 1) {
    throw new Error(`最初の increment() は 1 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}