// false もそのまま
{
  const actual = getOrDefault(false, "default");
  if (actual !== false) {
    throw new Error(`getOrDefault(false, "default") は false を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}