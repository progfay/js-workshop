if (result !== "a: 1, b: 8, c: 6") {
  throw new Error(`result は "a: 1, b: 8, c: 6" を期待しましたが ${JSON.stringify(result)} でした`);
}