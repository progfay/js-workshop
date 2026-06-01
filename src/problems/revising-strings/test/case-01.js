if (pizza !== "pizza is alright") {
  throw new Error(`pizza は "pizza is alright" を期待しましたが ${JSON.stringify(pizza)} でした`);
}