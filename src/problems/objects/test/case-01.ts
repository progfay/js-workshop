{
  const expected = JSON.stringify({
    toppings: ["cheese", "sauce", "pepperoni"],
    crust: "deep dish",
    serves: 2,
  });
  const actual = JSON.stringify(pizza);
  if (actual !== expected) {
    throw new Error(`pizza は ${expected} を期待しましたが ${actual} でした`);
  }
}