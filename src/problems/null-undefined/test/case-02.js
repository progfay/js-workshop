// null は fallback に置き換わる
{
  const actual = getOrDefault(null, "default");
  if (actual !== "default") {
    throw new Error(`getOrDefault(null, "default") は "default" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}