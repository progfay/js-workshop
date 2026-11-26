{
  const expected = JSON.stringify([1, 4, 9, 16, 25]);
  const actual = JSON.stringify(await squareAll([1, 2, 3, 4, 5]));
  if (actual !== expected) {
    throw new Error(`squareAll([1, 2, 3, 4, 5]) は ${expected} を期待しましたが ${actual} でした`);
  }
}