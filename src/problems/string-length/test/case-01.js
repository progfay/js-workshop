if (example !== "example string") {
  throw new Error(`example は "example string" を期待しましたが ${JSON.stringify(example)} でした`);
}