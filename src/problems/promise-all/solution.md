# 解説

```js
function squareAll(numbers) {
  return Promise.all(numbers.map((n) => fetchSquare(n)));
}
```

`numbers.map((n) => fetchSquare(n))` で Promise の配列を作り、`Promise.all` でまとめて待ちます。
`Promise.all` は入力の順番どおりに結果を並べるので、`map` で作った順序が保たれます。

途中経過が気になったら `console.log(numbers.map((n) => fetchSquare(n)))` を
出力してみましょう。2 乗の結果ではなく Promise の配列であることが確認でき、
「結果を取り出すには待つ (`await`) 必要がある」ことが実感できます。