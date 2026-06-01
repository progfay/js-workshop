# 文字列の長さ

文字列の文字数は `.length` プロパティで取得できます。

```js
const example = "example string";
example.length; // -> 14
```

> ⚠️ 正確には `.length` は UTF-16 コード単位の数を返すため、一部の文字 (例: 👀) では見た目の文字数と異なります。

## やってみよう

1. 変数 `example` に文字列 `"example string"` を代入してください。
2. 変数 `length` に `example` の文字数を代入してください。

`console.log(length)` でデバッグ出力できます。