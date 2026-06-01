{
  const expected = JSON.stringify([2, 4, 6, 8, 10]);
  const actual = JSON.stringify(evens([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  if (actual !== expected) {
    throw new Error(`evens([1..10]) は ${expected} を期待しましたが ${actual} でした`);
  }
}