if (second !== "pizza") {
  throw new Error(`second は "pizza" を期待しましたが ${JSON.stringify(second)} でした`);
}