# async/await

`async` を付けた関数の中では `await` が使えます。`await` は Promise が解決するまで待ち、
その結果を値として返します。ループの中で `await` すると、**1つずつ順番に**待てます。

```js
async function main() {
  const a = await stepA();
  const b = await stepB();
}
```

## やってみよう

ユーザー名の配列 `users` を受け取り、各ユーザーの投稿を順番に取得して
**1つの配列にまとめて**返す `async` 関数 `getAllPosts` を実装してください。
投稿を取得する `getPosts` は用意済みです（**変更しないで**使ってください）。
`getPosts(user)` は `["<user>: post1", "<user>: post2"]` で resolve します。

```js
await getAllPosts(["a", "b"]);
// -> ["a: post1", "a: post2", "b: post1", "b: post2"]
```