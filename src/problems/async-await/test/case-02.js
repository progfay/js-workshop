// ユーザーが居なければ空配列
{
  const expected = JSON.stringify([]);
  const actual = JSON.stringify(await getAllPosts([]));
  if (actual !== expected) {
    throw new Error(`getAllPosts([]) は ${expected} を期待しましたが ${actual} でした`);
  }
}