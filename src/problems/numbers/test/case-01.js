if (example !== 123456789) {
  throw new Error(`example は 123456789 を期待しましたが ${JSON.stringify(example)} でした`);
}