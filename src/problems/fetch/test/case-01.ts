// 存在する todo を取得できる
{
  const actual = await fetchTodo(1);
  const expected = "Do something nice for someone you care about";
  if (actual !== expected) {
    throw new Error(`fetchTodo(1) は ${JSON.stringify(expected)} を期待しましたが ${JSON.stringify(actual)} でした`);
  }
}