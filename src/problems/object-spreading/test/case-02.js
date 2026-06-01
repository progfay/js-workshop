// 重複キーが無い場合は単純な結合
{
  const expected = JSON.stringify({ a: 1, b: 2 });
  const actual = JSON.stringify(merge({ a: 1 }, { b: 2 }));
  if (actual !== expected) {
    throw new Error(`merge({ a: 1 }, { b: 2 }) は ${expected} を期待しましたが ${actual} でした`);
  }
}