# Promise.all

`Promise.all([...])` は複数の Promise をまとめて待ち、**すべて**が resolve したら
結果を**元の順番のまま**配列で返す Promise になります。

```js
const results = await Promise.all([p1, p2, p3]);
```

## やってみよう

数値の配列 `numbers` を受け取り、各要素を 2 乗した結果を**順番を保って**配列で返す関数 `squareAll` を実装してください。
非同期に 2 乗を計算する `fetchSquare` は用意済みです（**変更しないで**使ってください）。

`Promise.all` を使うと、すべての計算を並行して待てます。

```js
await squareAll([1, 2, 3]); // -> [1, 4, 9]
```