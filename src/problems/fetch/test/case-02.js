// 存在しない todo はエラーを throw する
{
  let err;
  try {
    await fetchTodo(2);
  } catch (e) {
    err = e;
  }
  if (!err) {
    throw new Error("fetchTodo(2) は 404 でエラーを throw すべきですが、しませんでした");
  }
  if (err.message !== "Error! Status: 404") {
    throw new Error(`エラーの message は "Error! Status: 404" を期待しましたが ${JSON.stringify(err.message)} でした`);
  }
}