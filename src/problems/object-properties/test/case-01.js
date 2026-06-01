if (types !== "only pizza") {
  throw new Error(`types は "only pizza" を期待しましたが ${JSON.stringify(types)} でした`);
}