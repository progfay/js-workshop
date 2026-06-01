# 文字列を変更

文字列には中身を調べたり書き換えたりするメソッドがあります。
`.replace()` は一致した部分を置き換えた**新しい文字列**を返します（元の文字列は変わりません）。

```js
const example = "this example exists";
const replaced = example.replace("exists", "is awesome");
// -> "this example is awesome"
```

## やってみよう

1. 変数 `pizza` に文字列 `"pizza is alright"` を代入してください。
2. `.replace()` を使い、`"alright"` を `"wonderful"` に置き換えた結果を変数 `replaced` に代入してください。

`console.log(replaced)` でデバッグ出力できます。