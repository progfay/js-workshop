{
  const expected = JSON.stringify(["2", "3", "5", "7", "b", "d", "11", "13"]);
  const actual = JSON.stringify(primeHexes(20));
  if (actual !== expected) {
    throw new Error(`primeHexes(20) は ${expected} を期待しましたが ${actual} でした`);
  }
}