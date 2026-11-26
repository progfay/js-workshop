{
  const expected = JSON.stringify(["cats", "dogs", "rats"]);
  const actual = JSON.stringify(plurals);
  if (actual !== expected) {
    throw new Error(`plurals は ${expected} を期待しましたが ${actual} でした`);
  }
}