// 空配列はすぐに空配列で解決する
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(await squareAll([]));
  if (actual !== expected) {
    throw new Error(`squareAll([]) は ${expected} を期待しましたが ${actual} でした`);
  }
}