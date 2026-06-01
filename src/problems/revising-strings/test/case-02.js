if (replaced !== "pizza is wonderful") {
  throw new Error(`replaced は "pizza is wonderful" を期待しましたが ${JSON.stringify(replaced)} でした`);
}