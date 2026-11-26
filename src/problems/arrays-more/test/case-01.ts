{
  const expected = JSON.stringify(["2", "3", "5", "7"]);
  const actual = JSON.stringify(primeHexes(10));
  if (actual !== expected) {
    throw new Error(`primeHexes(10) は ${expected} を期待しましたが ${actual} でした`);
  }
}