if (total !== 45) {
  throw new Error(`total は 45 (0 から 9 までの合計) を期待しましたが ${JSON.stringify(total)} でした`);
}