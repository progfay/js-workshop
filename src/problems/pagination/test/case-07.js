{
  const expected = JSON.stringify([6, 7, 8]);
  const actual = JSON.stringify(getPageNums(8, 8, 3));
  if (actual !== expected) {
    throw new Error(`getPageNums(8, 8, 3) は ${expected} を期待しましたが ${actual} でした`);
  }
}