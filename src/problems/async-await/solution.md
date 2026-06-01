# 解説

```js
async function getAllPosts(users) {
  const all = [];
  for (const user of users) {
    const posts = await getPosts(user);
    for (const post of posts) {
      all.push(post);
    }
  }
  return all;
}
```

`for...of` の中で `await` することで、ユーザーごとの投稿を順番に取得して `all` に集めています。
`async` 関数は必ず Promise を返すので、呼び出し側は `await getAllPosts(...)` で結果を受け取れます。