# 解説

```js
async function fetchTodo(id) {
  const response = await fetch(`https://dummyjson.com/todos/${id}`);
  if (!response.ok) {
    throw new Error(`Error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data.todo;
}
```

`fetch` と `response.json()` はどちらも Promise を返すので `await` します。
`response.ok` のチェックを忘れると、エラー時に本文の読み取りで失敗してしまいます。

`response.json()` の `await` を忘れて `data.todo` にアクセスすると、
`data` が Promise のため `undefined` が返ってテストが失敗します。
`console.log(data)` を挟んで、`await` の有無で中身がどう変わるか見てみましょう。