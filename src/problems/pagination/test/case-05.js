{
  const expected = JSON.stringify([2, 3, 4, 5, 6, 7]);
  const actual = JSON.stringify(getPageNums(4, 8, 6));
  if (actual !== expected) {
    throw new Error(`getPageNums(4, 8, 6) は ${expected} を期待しましたが ${actual} でした`);
  }
}