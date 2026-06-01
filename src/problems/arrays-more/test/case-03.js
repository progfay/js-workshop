// 素数が無いケース (0, 1 は素数ではない)
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(primeHexes(2));
  if (actual !== expected) {
    throw new Error(`primeHexes(2) は ${expected} を期待しましたが ${actual} でした`);
  }
}