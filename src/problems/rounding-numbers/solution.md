# 解説

```js
const roundUp = 1.5;
const rounded = Math.round(roundUp);
// -> 2
```

`Math.round(1.5)` は `2` を返します。

`Math` には他にも丸めの仲間があります。`console.log` で結果を確かめてみましょう。

```js
Math.floor(1.5); // -> 1  (切り捨て)
Math.ceil(1.2); // -> 2  (切り上げ)
```