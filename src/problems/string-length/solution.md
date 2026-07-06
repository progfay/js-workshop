# 解説

```js
const example = "example string";
const length = example.length;
```

`.length` は文字列に含まれる文字の数を返します。`"example string"` は 14 文字です
（空白も1文字として数えます）。

よくあるミスは `example.length()` と括弧を付けてしまうことです。
`.length` はメソッドではなく**プロパティ**なので、括弧を付けると
`not a function` というエラーになります。気になったら試して、
実行結果のエラーメッセージを見てみましょう。