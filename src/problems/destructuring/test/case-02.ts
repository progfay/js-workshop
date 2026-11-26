{
  const input = { toppings: ["a", "b"] };
  const expected = JSON.stringify(["b", "a"]);
  const actual = JSON.stringify(topTwo(input));
  if (actual !== expected) {
    throw new Error(`topTwo({ toppings: ["a", "b"] }) は ${expected} を期待しましたが ${actual} でした`);
  }
}