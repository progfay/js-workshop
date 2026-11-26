// 別々の makeCounter() は独立している
{
  const [inc1] = makeCounter();
  const [inc2] = makeCounter();
  inc1();
  inc1();
  const actual = inc2();
  if (actual !== 1) {
    throw new Error(`独立した別カウンタの最初の increment() は 1 を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}