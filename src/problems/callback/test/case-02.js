// callback は同期コードより後に呼ばれる
{
  const order = [];
  await new Promise((resolve) => {
    delay(() => {
      order.push("callback");
      resolve();
    });
    order.push("sync");
  });
  const expected = JSON.stringify(["sync", "callback"]);
  const actual = JSON.stringify(order);
  if (actual !== expected) {
    throw new Error(`実行順は ${expected} を期待しましたが ${actual} でした (callback が後から呼ばれていない可能性があります)`);
  }
}