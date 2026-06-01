{
  const expected = JSON.stringify(["a: post1", "a: post2", "b: post1", "b: post2"]);
  const actual = JSON.stringify(await getAllPosts(["a", "b"]));
  if (actual !== expected) {
    throw new Error(`getAllPosts(["a", "b"]) は ${expected} を期待しましたが ${actual} でした`);
  }
}