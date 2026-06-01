# Promiseオブジェクト

`Promise` は「後で完了する処理の結果」を表すオブジェクトです。
`new Promise((resolve, reject) => { ... })` で作り、成功時は `resolve(値)`、失敗時は `reject(エラー)` を呼びます。
結果は `await` で受け取れます（`await` は `async` 関数の中で使えます）。

```js
const value = await somePromise; // resolve された値
```

## やってみよう

文字列 `key` を受け取り、`Promise` を返す関数 `getData` を実装してください。

- `key` が `"greeting"` のとき … `"Hello"` で **resolve** する
- それ以外のとき … `new Error(\`unknown key: ${key}\`)` で **reject** する

```js
await getData("greeting"); // -> "Hello"
await getData("foo"); // -> reject (Error: unknown key: foo)
```