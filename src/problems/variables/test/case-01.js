if (example !== "some string") {
  throw new Error(`example は "some string" を期待しましたが ${JSON.stringify(example)} でした`);
}