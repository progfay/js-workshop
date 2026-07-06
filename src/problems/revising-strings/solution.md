# 解説

```js
const pizza = "pizza is alright";
const replaced = pizza.replace("alright", "wonderful");
// -> "pizza is wonderful"
```

`.replace()` は新しい文字列を返すので、結果を別の変数で受け取ります。
`console.log(pizza)` で確認すると、元の `pizza` が変わっていないことがわかります。

なお `.replace()` が置き換えるのは**最初に一致した1か所だけ**です。
すべて置き換えたいときは `.replaceAll()` を使います。