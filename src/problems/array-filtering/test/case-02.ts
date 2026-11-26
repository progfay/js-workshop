// 偶数が無いケース
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(evens([1, 3, 5]));
  if (actual !== expected) {
    throw new Error(`evens([1, 3, 5]) は ${expected} を期待しましたが ${actual} でした`);
  }
}