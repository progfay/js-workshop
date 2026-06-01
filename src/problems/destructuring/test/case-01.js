{
  const input = { toppings: ["cheese", "sauce", "pepperoni"], crust: "deep dish", serves: 2 };
  const expected = JSON.stringify(["sauce", "cheese"]);
  const actual = JSON.stringify(topTwo(input));
  if (actual !== expected) {
    throw new Error(`topTwo(...) は ${expected} を期待しましたが ${actual} でした`);
  }
}