{
  const expected = JSON.stringify({ key1: "A", key2: "B", key3: "C" });
  const actual = JSON.stringify(merge({ key1: "A", key2: "A" }, { key2: "B", key3: "C" }));
  if (actual !== expected) {
    throw new Error(`merge(...) は ${expected} を期待しましたが ${actual} でした`);
  }
}