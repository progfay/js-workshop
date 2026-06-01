{
  const expected = JSON.stringify([3, 4, 5]);
  const actual = JSON.stringify(getPageNums(4, 8, 3));
  if (actual !== expected) {
    throw new Error(`getPageNums(4, 8, 3) は ${expected} を期待しましたが ${actual} でした`);
  }
}