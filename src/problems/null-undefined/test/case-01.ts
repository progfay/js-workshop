// undefined は fallback に置き換わる
{
  const actual = getOrDefault(undefined, "default");
  if (actual !== "default") {
    throw new Error(`getOrDefault(undefined, "default") は "default" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}