{
  const expected = JSON.stringify(["make", "model", "year"]);
  const actual = JSON.stringify(keys);
  if (actual !== expected) {
    throw new Error(`keys は ${expected} を期待しましたが ${actual} でした`);
  }
}