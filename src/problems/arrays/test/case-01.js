{
  const expected = JSON.stringify(["tomato sauce", "cheese", "pepperoni"]);
  const actual = JSON.stringify(pizzaToppings);
  if (actual !== expected) {
    throw new Error(`pizzaToppings は ${expected} を期待しましたが ${actual} でした`);
  }
}