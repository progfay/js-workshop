# 解説

```js
function squareAll(numbers) {
  return Promise.all(numbers.map((n) => fetchSquare(n)));
}
```

`numbers.map((n) => fetchSquare(n))` で Promise の配列を作り、`Promise.all` でまとめて待ちます。
`Promise.all` は入力の順番どおりに結果を並べるので、`map` で作った順序が保たれます。