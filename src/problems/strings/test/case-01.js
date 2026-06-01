if (someString !== "this is a string") {
  throw new Error(`someString は "this is a string" を期待しましたが ${JSON.stringify(someString)} でした`);
}