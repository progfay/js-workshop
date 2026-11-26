{
  const text = `
correct zipcode 1234567
correct zipcode 111-2222
incorrect zipcode 12345678
incorrect zipcode 1111-222
incorrect zipcode 123-4567-890
incorrect zipcode 123-4567890
`;
  const expected = JSON.stringify(["1234567", "111-2222"]);
  const actual = JSON.stringify(extractZipcodes(text));
  if (actual !== expected) {
    throw new Error(`extractZipcodes(サンプル) は ${expected} を期待しましたが ${actual} でした`);
  }
}