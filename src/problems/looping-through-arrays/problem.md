# 配列をループする

配列の各要素を先頭から順に処理するには `for...of` が便利です。

```js
const greetings = ["hello", "hi"];
for (const greeting of greetings) {
  console.log(greeting);
}
```

## やってみよう

次の配列 `pets` が与えられています。

```js
const pets = ["cat", "dog", "rat"];
```

各要素の末尾に `"s"` を付けて複数形にし、その結果を配列 `plurals` に集めてください。
（`["cats", "dogs", "rats"]` になります。）