# 解説

```js
const food = ["apple", "pizza", "pear"];
const second = food[1]; // -> "pizza"
```

添え字は `0` 始まりなので、2 番目の要素は `food[1]` です。

範囲外の添え字（例: `food[3]`）はエラーにならず `undefined` が返ります。
`console.log(food[3])` で確かめてみましょう。
また、末尾の要素は `food[food.length - 1]` や `food.at(-1)` で取得できます。