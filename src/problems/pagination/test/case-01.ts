{
  const expected = JSON.stringify([1, 2, 3, 4, 5]);
  const actual = JSON.stringify(getPageNums(1, 5, 5));
  if (actual !== expected) {
    throw new Error(`getPageNums(1, 5, 5) は ${expected} を期待しましたが ${actual} でした`);
  }
}