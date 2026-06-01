// decrement は increment と同じカウンタを操作する
{
  const [increment, decrement] = makeCounter();
  increment();
  increment();
  const actual = decrement();
  if (actual !== 1) {
    throw new Error(`increment 2 回の後の decrement() は 1 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}