{
  const expected = JSON.stringify([1, 2, 3, 4, 5, 6]);
  const actual = JSON.stringify(getPageNums(3, 8, 6));
  if (actual !== expected) {
    throw new Error(`getPageNums(3, 8, 6) は ${expected} を期待しましたが ${actual} でした`);
  }
}