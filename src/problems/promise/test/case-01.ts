// "greeting" なら "Hello" で resolve
{
  const actual = await getData("greeting");
  if (actual !== "Hello") {
    throw new Error(`getData("greeting") は "Hello" を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}