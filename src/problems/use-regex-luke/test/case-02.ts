// 正しい郵便番号が無ければ空配列
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(extractZipcodes("no zipcode here 12345678 only"));
  if (actual !== expected) {
    throw new Error(`extractZipcodes("...12345678...") は ${expected} を期待しましたが ${actual} でした`);
  }
}