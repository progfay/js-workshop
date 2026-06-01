{
  const expected = JSON.stringify([2, 3, 4, 5, 6]);
  const actual = JSON.stringify(getPageNums(4, 6, 5));
  if (actual !== expected) {
    throw new Error(`getPageNums(4, 6, 5) は ${expected} を期待しましたが ${actual} でした`);
  }
}