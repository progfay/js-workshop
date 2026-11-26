// 空文字列もそのまま (|| ではないことの確認)
{
  const actual = getOrDefault("", "default");
  if (actual !== "") {
    throw new Error(`getOrDefault("", "default") は "" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}