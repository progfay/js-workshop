// 端のケース: 空配列の合計は 0
{
  const actual = sumArray([]);
  const expected = 0;
  if (actual !== expected) {
    throw new Error(`sumArray([]) は ${expected} を期待しましたが ${actual} が返りました`);
  }
}

// 要素が1つだけのケース
{
  const actual = sumArray([42]);
  const expected = 42;
  if (actual !== expected) {
    throw new Error(`sumArray([42]) は ${expected} を期待しましたが ${actual} が返りました`);
  }
}
