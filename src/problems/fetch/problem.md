# Fetch API

`fetch(url)` は HTTP リクエストを送り、レスポンスを表す Promise を返します。
`response.ok` でステータスが成功（200〜299）かを確認し、`response.json()` で本文を JSON として読み取ります。

```js
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Error! Status: ${response.status}`);
}
const data = await response.json();
```

> このアプリの `fetch` は学習用のモックです。`https://dummyjson.com/todos/1` だけが存在し、
> その本文は `{ id: 1, todo: "Do something nice for someone you care about", ... }` です。
> それ以外の URL は `404` を返します。

## やってみよう

数値 `id` を受け取り、`https://dummyjson.com/todos/${id}` を `fetch` して、
本文の `todo` プロパティ（文字列）を返す `async` 関数 `fetchTodo` を実装してください。
`response.ok` が `false` のときは `new Error(\`Error! Status: ${response.status}\`)` を throw してください。

```js
await fetchTodo(1); // -> "Do something nice for someone you care about"
await fetchTodo(2); // -> throw (Error! Status: 404)
```