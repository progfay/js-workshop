// 連続して呼ぶと積み上がる
{
  const [increment] = makeCounter();
  increment();
  increment();
  const actual = increment();
  if (actual !== 3) {
    throw new Error(`increment() を 3 回呼ぶと 3 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}