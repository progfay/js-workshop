// mood が "excited" に再代入されているか
if (mood !== "excited") {
  throw new Error(`mood は "excited" を期待しましたが ${JSON.stringify(mood)} でした`);
}
