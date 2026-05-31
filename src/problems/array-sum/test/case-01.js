// 基本: 正の数の合計
{
  const actual = sumArray([1, 2, 3]);
  const expected = 6;
  if (actual !== expected) {
    throw new Error(`sumArray([1, 2, 3]) は ${expected} を期待しましたが ${actual} が返りました`);
  }
}

// 負の数を含むケース
{
  const actual = sumArray([10, -4, 2]);
  const expected = 8;
  if (actual !== expected) {
    throw new Error(`sumArray([10, -4, 2]) は ${expected} を期待しましたが ${actual} が返りました`);
  }
}
