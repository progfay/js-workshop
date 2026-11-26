// 空配列
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(evens([]));
  if (actual !== expected) {
    throw new Error(`evens([]) は ${expected} を期待しましたが ${actual} でした`);
  }
}