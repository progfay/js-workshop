# 解説

## 解答例 1: `for...of` で素直に足す

```js
function sumArray(numbers) {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}
```

`total` を `0` で初期化しているので、空配列のときは何も足されず `0` がそのまま返ります。

## 解答例 2: `reduce` を使う

```js
function sumArray(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
```

`reduce` の第2引数(初期値)に `0` を渡すのがポイントです。これを省略すると空配列で
`TypeError` になります。

## ポイント

- 合計を求める処理は「初期値 0 から始めて、要素を順番に足していく」という形が基本です。
- 初期値を明示することで、空配列のような端のケースも自然に扱えます。
